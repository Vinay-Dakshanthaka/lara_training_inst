// Import required modules
const db = require('../models');
const multer = require('multer');
const upload = multer({dest: 'Images/'});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const nodemailer = require('nodemailer')

// Import models
const Student = db.Student;
const Profile = db.Profile;

// Number of salt rounds for hashing
const saltRounds = 10;

// JWT secret key
const jwtSecret = process.env.JWT_SECRET;

// Save student controller
const saveStudent = async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const studentInfo = {
            name,
            email,
            phoneNumber,
            password: hashedPassword, // Stores the hashed password in the database
            role: "STUDENT"
        };

        const student = await Student.create(studentInfo);
        res.status(200).send(student);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

// Get student details controller
const getStudentDetails = async (req, res) => {
    try {
        const studentId = req.studentId; // Extracted from the token
        const student = await Student.findByPk(studentId, {
            attributes: { exclude:['password'] }
        });
        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }
        res.status(200).send(student);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Verify by email and password controller
const verifyByEmailAndPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ where: { email } });
        if (!student) {
            return res.status(404).send({ message: 'Student not found.' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, student.password);
        if (passwordMatch) {
            // Generate JWT token
            const token = jwt.sign({ id: student.id, email: student.email }, jwtSecret );

            // Include role in the response
            const role = student.role;

            res.status(200).send({ token, role }); // Send token and role to client
        } else {
            res.status(401).send({ message: 'Invalid password.' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// Verify by phone and password controller
const verifyByPhoneAndPassword = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        const student = await Student.findOne({ where: { phoneNumber } });
        if (!student) {
            return res.status(404).send({ message: 'Student not found.' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, student.password);
        if (passwordMatch) {
            // Generate JWT token
            const token = jwt.sign({ id: student.id, phoneNumber: student.phoneNumber }, jwtSecret);
             // Include role in the response
             const role = student.role;

            res.status(200).send({ token, role }); // Send token and role to client
        } else {
            res.status(401).send({ message: 'Invalid password.' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};



// Save or update profile controller
const saveOrUpdateProfile = async (req, res) => {
    try {
        const student_id = req.studentId;
        const profileInfo = {
            name: req.body.name,
            gender: req.body.gender,
            highest_education: req.body.highest_education,
            year_of_passout: req.body.year_of_passout,
            specialization: req.body.specialization,
            highest_education_percent: req.body.highest_education_percent,
            tenth_percentage: req.body.tenth_percentage,
            twelth_percentage: req.body.twelth_percentage,
            mobile_number: req.body.mobile_number,
            father_name: req.body.father_name,
            father_mobile_number: req.body.father_mobile_number,
            father_occupation: req.body.father_occupation,
            mother_name: req.body.mother_name,
            mother_mobile_number: req.body.mother_mobile_number,
            adhaar_number: req.body.adhaar_number,
            address: req.body.address,
            pincode: req.body.pincode,
            city: req.body.city,
            district: req.body.district,
            state: req.body.state,
            country: req.body.country,
            student_id: student_id
        };

        // Check if the profile already exists
        const existingProfile = await Profile.findOne({ where: { student_id } });

        if (existingProfile) {
            // If the profile exists, update it
            await Profile.update(profileInfo, { where: { student_id } });
            res.status(200).send({ message: 'Profile updated successfully.' });
        } else {
            // If the profile doesn't exist, create a new one
            await Profile.create(profileInfo);
            res.status(200).send({ message: 'Profile saved successfully.' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// Get profile details controller
const getProfileDetails = async (req, res) => {
    console.log("inside get profile")
    try {
        // console.log("inside get profile tyr")
        const student_id = req.studentId;
        const profile = await Profile.findOne({ where: { student_id } });
        if (profile) {
            res.status(200).send(profile);
        } else {
            res.status(404).send({ message: 'Profile not found.' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// Get profile image controller
const getProfileImage = async (req, res) => {
    try {
        const id = req.studentId;
        const profile = await Student.findOne({ where: { id } });

        if (!profile) {
            return res.status(404).send({ message: 'Student not found.' });
        }

        const imagePath = profile.imagePath;

        // Check if imagePath exists
        if (!imagePath) {
            return res.status(404).send({ message: 'Image not found.' });
        }

        // Read the image file
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                return res.status(500).send({ message: 'Error reading image file.' });
            }

            // Set the appropriate content type
            res.setHeader('Content-Type', 'image/jpeg'); // Adjust content type based on your image format

            // Send the image file as response
            // console.log(data)
            res.status(200).send(data);
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};



const validFileFormats = ['jpeg', 'jpg', 'png'];

const uploadProfileImage = async (req, res) => {
    try {
        const studentId = req.studentId;
        console.log("id :"+studentId);
        // Check if file was uploaded
        if (!req.file) {
            throw new Error('No image file uploaded.');
        }

        // Check if the file format is valid
        const fileFormat = req.file.originalname.split('.').pop().toLowerCase();
        if (!validFileFormats.includes(fileFormat)) {
            throw new Error('Invalid file format. Supported formats: JPEG, JPG, PNG.');
        }

        // Construct the full path for saving the image
        const imagePath = req.file.path;
        console.log("path :"+imagePath);
        // Update the image path in the database
        await Student.update({ imagePath: imagePath }, { where: { id: studentId } });

        res.status(200).send({ message: 'Profile image uploaded successfully.', imagePath });
        console.log("Path: " + imagePath);
    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).send({ message: error.message });
    }
};

// const getAllStudentDetails = async (req, res) => {
//     try {
//         // Fetch all students
//         const allStudents = await Student.findAll();

//         // Return the student details as a JSON response
//         res.json(allStudents);
//     } catch (error) {
//         console.error('Error fetching student details:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

const getAllStudentDetails = async (req, res) => {
    try {
        // Fetch the user's role from the database using the user's ID
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role
        console.log("role :"+userRole)
        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Fetch all students
        const allStudents = await Student.findAll();

        // Return the student details as a JSON response
        res.json(allStudents);
    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateRole = async (req, res) => {
    try {
        // Fetch the user's role from the database using the user's ID
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role
        console.log("role :"+userRole)
        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        const { id, role } = req.body; // Extract the id and role from the request body

        // Update only the role field in the database
        await Student.update({ role }, { where: { id } });

        res.status(200).send({ message: 'Student role updated successfully.' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const getAllStudentProfileDetails = async (req, res) => {
    try {
        // Fetch the user's role from the database using the user's ID
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role
        console.log("role :"+userRole)
        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Fetch all students profiles
        const allStudentProfiles = await Profile.findAll(); // Await the result of Profile.findAll()

        // Return the student details as a JSON response
        res.json(allStudentProfiles);
        // console.log("profile details : "+allStudentProfiles)
    } catch (error) {
        console.error('Error fetching student profile details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updatePassword = async (req, res) => {
    try {
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); 
        const existingPassword = user.password; 

        const { oldPassword, newPassword } = req.body;

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(oldPassword, existingPassword);
        // Check if the old password matches the existing password
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Old password does not match' });
        }

        // Update the password with the new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await Student.update({ password: hashedPassword }, { where: { id: studentId } });

        res.status(200).send({ message: 'Password updated successfully.' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};



// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'vinayhari789@gmail.com', // Your email address
        pass: 'cchprxipjwvmryes' // Your app password
    }
});


const sendPasswordResetEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if the email exists in the database
        const user = await Student.findOne({ where: { email } });
        if (!user) {
            return res.status(403).send({ message: 'No account exists with this email ID.' });
        }

        // Generate unique token using JWT
        const token = jwt.sign({ studentId: user.id }, jwtSecret, { expiresIn: '30m' }); 

        // Define the email options
        const mailOptions = {
            from: 'vinayhari789@gmail.com', // Sender address
            to: email, // Recipient's email address
            subject: 'Password Reset Request', // Subject line
            text: 'Please click the following link to reset your password: http://localhost:3000/resetPassword?token=' + token, // Plain text body
            html: '<p>We received a request to reset the password associated with your account. To proceed with the password reset, please click on Reset Password</p><p>Please click the following link to reset your password: <a href="http://localhost:3000/resetPassword?token=' + token + '">Reset Password</a></p><p>If you did not request a password reset, you can ignore this email. Please note that the link will expire after 30 minutes, so make sure to reset your password promptly</p><p>Thank You,</p><p>Lara Technologies Team</p>'
        };

        // Send mail with defined transport object
        await transporter.sendMail(mailOptions);

        return res.status(200).send({ success: true, message: 'Password reset email sent successfully.' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return res.status(500).send({ success: false, message: 'An error occurred while sending the password reset email.' });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const token = req.query.token; // Get the token from the query parameters

        if (!token) {
            return res.status(400).send({ message: 'Token is missing.' });
        }

        // Verify the JWT token
        jwt.verify(token, jwtSecret, async (err, decoded) => {
            if (err) {
                // Token verification failed
                console.error('Error verifying token:', err);
                return res.status(403).send({ message: 'Invalid or expired token.' });
            } else {
                // Token verification succeeded
                const studentId = decoded.studentId;

                // Retrieve user information from the database
                try {
                    const user = await Student.findByPk(studentId);
                    if (!user) {
                        return res.status(404).send({ message: 'User not found.' });
                    }

                    // Hash the new password
                    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

                    // Update the password in the database
                    await Student.update({ password: hashedPassword }, { where: { id: studentId } });

                    res.status(200).send({ message: 'Password updated successfully.' });
                } catch (error) {
                    console.error('Error finding user:', error);
                    res.status(500).send({ message: 'An error occurred while resetting the password.' });
                }
            }
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send({ message: 'An error occurred while resetting the password.' });
    }
};






// Export all controllers
module.exports = {
    saveStudent,
    verifyByEmailAndPassword,
    verifyByPhoneAndPassword,
    updateRole,
    getProfileDetails,
    saveOrUpdateProfile,
    getStudentDetails,
    uploadProfileImage,
    upload,
    getProfileImage,
    getAllStudentDetails,
    getAllStudentProfileDetails,
    updatePassword,
    resetPassword,
    sendPasswordResetEmail
};
