const multer = require('multer');
const path = require('path');
const { Student, Transaction } = require('../models'); // Import the necessary models
const { v4: uuidv4 } = require('uuid');
const s3 = require('./digitalOceanConfig');
const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const saveTransaction = async (req, res) => {
    try {
        const { student_id, transaction_id } = req.body;
        console.log("Received Data:", req.body);
        
        let studentName = null;
        let studentemail = null;
        const students = await Student.findAll({
          where: {
            id: student_id,
          }
        });
        
        if (students.length > 0) {
           studentName = students[0].dataValues.name;
           studentemail = students[0].dataValues.email;
          // console.log(studentName, "-----------------------");
        } else {
          console.log("Student not found");
        }
        
        if (!student_id || !transaction_id || !studentemail) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const clientName = process.env.CLIENT_NAME || 'default_client';
            const fileKey = `${clientName}/ filename/${uuidv4()}_${req.file.originalname.replace(/\s+/g, '')}`;
          
            const params = {
                Bucket: 'real_estate',
                Key: fileKey,
                Body: req.file.buffer,
                ACL: 'public-read',
                ContentType: req.file.mimetype,
            };
        
            const uploadResult = await s3.upload(params).promise();
        
            
            const transactionslip_img = uploadResult.Location;

        const student = await Student.findByPk(student_id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        const emailContent = `
        Dear ${studentName},
        
       We would like to inform you that the payment for Transaction ID ${transaction_id} has been successfully done.
        
        Thank you for choose in Lara Technologies. 
        
        Best regards,  
        Lara Technologies Team
        `;
        
        // Send Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: studentemail, 
            subject: "Payment Confirmation - Laratechnologies",
            text: emailContent //`Dear ${studentName}, Your payment for transaction ID ${transaction_id} was successful. Thank you for choosing Lara Technologies.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email Error:", error);
                return res.status(500).json({ message: "Transaction saved, but email failed to send" });
            } else {
                console.log("Email sent:", info.response);
                return res.status(201).json({ message: "Transaction saved and email sent", transaction });
            }
        });
        const transaction = await Transaction.create({
          student_id,
          transaction_id,
          transactionslip_img 
      });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


// The saveTransaction method to handle saving the transaction data and image
// const saveTransaction = async (req, res) => {
//   try {
  
//     const { student_id, transaction_id } = req.body;
//     console.log(req.body,"-----------body")
    
//     const clientName = process.env.CLIENT_NAME || 'default_client';
//     const fileKey = `${clientName}/ filename/${uuidv4()}_${req.file.originalname.replace(/\s+/g, '')}`;
  
//     const params = {
//         Bucket: 'real_estate',
//         Key: fileKey,
//         Body: req.file.buffer,
//         ACL: 'public-read',
//         ContentType: req.file.mimetype,
//     };

//     const uploadResult = await s3.upload(params).promise();

    
//     const transactionslip_img = uploadResult.Location;

//     // const transactionslip_img = req.file ? req.file.path : null; // If a file is uploaded, use its path
    
//     // console.log(transactionslip_img,"------------------transcationpath")

//     if (!student_id || !transaction_id) {
//       return res.status(400).json({ message: 'Student ID and Transaction ID are required' });
//     }

//     // Check if the student exists in the database
//     const student = await Student.findByPk(student_id);
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     // Save the transaction record to the database
//     const transaction = await Transaction.create({
//       student_id,
//       transaction_id,
//       transactionslip_img,
//     });

//     // Return a success response with the saved transaction
//     return res.status(201).json({
//       message: 'Transaction saved successfully',
//       transaction,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

const getAllTransactions = async (req, res) => {
  try {
    
    const transactions = await Transaction.findAll({
      include: [
        {
          model: Student,
          attributes: ['name'], 
        },
      ],
    });

    
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    return res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



// Export the upload and saveTransaction functions together
module.exports = {  saveTransaction,getAllTransactions };
