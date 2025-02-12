const XLSX = require("xlsx");
const { Student , Student_Batch} = require("../models");
const db = require("../models");
const { Op } = require("sequelize");
const paperBasedTestResults = db.PaperBasedTestResults;




// Email validation function
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Upload Excel File and Store Data
const uploadTestResults = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded!" });
        }

        // Read Excel file
        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const skippedRecords = [];

        for (let row of data) {
            try {
                const { email, obtainedMarks, totalMarks, subjectName, topicName } = row;

                if (!email || !isValidEmail(email) || !totalMarks || !subjectName || !topicName) {
                    skippedRecords.push({ email: email || "N/A", reason: "Invalid data format or missing fields" });
                    continue;
                }

                // Check if the student exists
                const student = await Student.findOne({ where: { email: email } });

                if (!student) {
                    skippedRecords.push({ email, reason: "Student email not found in database" });
                    continue; // Skip storing data if student doesn't exist
                }

                // Log safely after checking student exists
                console.log(student.email, "-------------------- student email exists");

                // Store test result only if student exists
                await paperBasedTestResults.create({
                    studentId: student.id,
                    email: student.email,
                    obtainedMarks: obtainedMarks || 0,
                    totalMarks: totalMarks || 12,
                    subjectName: subjectName || "core java",
                    topicName: topicName || "basics",
                });

            } catch (err) {
                console.error("Skipping row due to error:", err.message);
                skippedRecords.push({ email: row.email || "Unknown", reason: err.message });
            }
        }

        console.log(skippedRecords, "------------------------ Skipped Records");

        res.status(200).json({
            message: "Data processed successfully!",
            skippedRecords, // Send skipped emails and reasons to frontend
        });

    } catch (error) {
        console.error("Error processing file:", error);

        if (error.message && error.message.includes("email is not defined")) {
            return res.status(200).json({
                message: "Data processed with errors!",
                skippedRecords,
            });
        }

        res.status(500).json({ message: "Internal server error", error });
    }
};


// const getAttendedStudentsByBatch = async (req, res) => {
//     try {
//         const { batchId } = req.body;
//         console.log(req.body,"-----------------------req.")
//         if (!batchId) {
//             return res.status(400).json({ message: "Batch ID is required" });
//         }

//         // Fetch student IDs linked to the given batch
//         const studentsInBatch = await Student_Batch.findAll({
//             where: { batch_id: batchId },
//             attributes: ["student_id"]
//         });
//           console.log(studentsInBatch,"-----------------students in baatch")
//         if (!studentsInBatch.length) {
//             return res.status(404).json({ message: "No students found in this batch" });
//         }

//         const studentIds = studentsInBatch.map(student => student.student_id);

//         // Fetch students who attended the test
//         const attendedStudents = await paperBasedTestResults.findAll({
//             where: { studentId: studentIds }, // Compare with students in batch
//             include: [{ model: Student, attributes: ["name"] }]
//         });
         
//         console.log(attendedStudents,"-------------------------attenededstudents")
//         if (!attendedStudents.length) {
//             return res.status(404).json({ message: "No students attended the test" });
//         }

//         // Extract unique student names
//         const attendedStudentNames = attendedStudents.map(result => result.Student.name);

//         res.status(200).json({ attendedStudents: attendedStudentNames });
//     } catch (error) {
//         console.error("Error fetching attended students:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };



const getAttendedStudentsByBatch = async (req, res) => {
    try {
        const { batchId } = req.body;
        if (!batchId) {
            return res.status(400).json({ message: "Batch ID is required" });
        }

        // Fetch student IDs linked to the given batch
        const studentsInBatch = await Student_Batch.findAll({
            where: { batch_id: batchId },
            attributes: ["student_id"]
        });

        if (!studentsInBatch.length) {
            return res.status(404).json({ message: "No students found in this batch" });
        }

        const studentIds = studentsInBatch.map(student => student.student_id);

        // Fetch students who attended the test with their results
        const attendedStudents = await paperBasedTestResults.findAll({
            where: { studentId: { [Op.in]: studentIds } }, // Ensure Op.in is used for efficiency
            include: [{ model: Student, attributes: ["id", "name"] }]
        });

        if (!attendedStudents.length) {
            return res.status(404).json({ message: "No students attended the test" });
        }

        // Group results by student
        const studentResults = {};
        attendedStudents.forEach(result => {
            const studentId = result.Student.id;
            if (!studentResults[studentId]) {
                studentResults[studentId] = {
                    id: studentId,
                    name: result.Student.name,
                    totalTests: 0,
                    totalMarksObtained: 0,
                    totalMarks: 0
                };
            }
            // Ensure marks exist before adding
            const marksObtained = result.obtainedMarks || 0;
            const totalMarks = result.totalMarks || 0;

            studentResults[studentId].totalTests += 1;
            studentResults[studentId].totalMarksObtained += marksObtained;
            studentResults[studentId].totalMarks += totalMarks;
        });

        // Convert to array format and calculate percentage
        const response = Object.values(studentResults).map(student => ({
            id: student.id,
            name: student.name,
            totalTests: student.totalTests,
            totalMarksObtained: student.totalMarksObtained,
            totalMarks: student.totalMarks,
            percentage: student.totalMarks > 0 
                ? ((student.totalMarksObtained / student.totalMarks) * 100).toFixed(2) + "%" 
                : "0%" // Handle cases where total marks is zero
        }));
        console.log(response,"-------------------------response")
        res.status(200).json({ attendedStudents: response });
    } catch (error) {
        console.error("Error fetching attended students:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



   const getBatchResults = async (req, res) => {
  try {
    const { batchId } = req.body;
    
    if (!batchId) {
      return res.status(400).json({ message: "Batch ID is required" });
    }

    // Fetch students using the Student_Batch table
    const studentBatchRecords = await Student_Batch.findAll({
      where: { batch_id: batchId },
      attributes: ["student_id"],
    });

    if (!studentBatchRecords.length) {
      return res.status(404).json({ message: "No students found in this batch" });
    }

    const studentIds = studentBatchRecords.map((record) => record.student_id);
     
    // Fetch student details
    const students = await Student.findAll({
      where: { id: { [Op.in]: studentIds } },
      attributes: ["id", "name"],
    });

    // Fetch student results
    const studentResults = await Promise.all(
      students.map(async (student) => {
        const exams = await paperBasedTestResults.findAll({
          where: { studentId: student.id },
          attributes: ["obtainedMarks", "totalMarks"],
        });

        if (!exams.length) {
          return {
            id: student.id,
            name: student.name,
            totalTests: 0,
            totalMarksObtained: 0,
            totalMarks: 0,
            percentage: "0%",
          };
        }

        const totalMarksObtained = exams.reduce((sum, exam) => sum + exam.obtainedMarks, 0);
        const totalMarks = exams.reduce((sum, exam) => sum + exam.totalMarks, 0);
        const percentage = ((totalMarksObtained / totalMarks) * 100).toFixed(2) + "%";

        return {
          id: student.id,
          name: student.name,
          totalTests: exams.length,
          totalMarksObtained,
          totalMarks,
          percentage,
        };
      })
    );

    res.status(200).json({ attendedStudents: studentResults });
  } catch (error) {
    console.error("Error fetching batch results:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




module.exports = { uploadTestResults,
                  getAttendedStudentsByBatch,
                  getBatchResults,
                  
 };


// const XLSX = require("xlsx");
// const  { Student }  = require("../models"); 
// const db = require('../models');
// const { Op } = require("sequelize");
// const paperBasedTestResults = db.PaperBasedTestResults;


// // Email validation function
// const isValidEmail = (email) => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// };

// // Upload Excel File and Store Data
// const uploadTestResults = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: "No file uploaded!" });
//         }

//         // Read Excel file
//         const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
//         const sheetName = workbook.SheetNames[0];
//         const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//         const skippedRecords = [];

//         for (let row of data) {
//             try {
//                 const { email, obtainedMarks, totalMarks, subjectName, topicName } = row;
//                 console.log(row,"----------------------------------------")
//                 console.log(obtainedMarks,"--------------------obtained marks")
//                 if (!email || !isValidEmail(email) || !totalMarks || !subjectName || !topicName) {
//                     skippedRecords.push({ email: email || "N/A", reason: "Invalid data" });
//                     continue;
//                 }
              

//                 // Check if the student exists
//                 const student = await Student.findOne({ where: { email: email } });
//                 console.log(student.email,"--------------------studentemail")
//                 console.log(student.id, "--------------------------------studentid");
//                 console.log(email,"---------------emailrow")
//                 if (!student) {
//                     skippedRecords.push({ email : email, reason: "Student email not found in database" });
//                     continue;
//                 }
//                 else { // Store test result
//                     let results =  await paperBasedTestResults.create({
//                     studentId: student.id || 1,
//                     email: student.email || 'hello@gmail.com',
//                     obtainedMarks: obtainedMarks || 0,
//                     totalMarks: totalMarks || 12,
//                     subjectName: subjectName || 'core java',
//                     topicName:topicName || 'basics'
//                 });
//             }
//                 // console.log(results,"-----------------------fghjk")
//             } catch (err) {
//                 console.error("Skipping row due to error:", err.message);
//                 skippedRecords.push({ email: email, reason: err.message });
//             }
//         }

//         console.log(skippedRecords, "------------------------final");

//         res.status(200).json({
//             message: "Data processed successfully!",
//             skippedRecords
//         });

//     } catch (error) {
//         if(error == " ReferenceError: email is not defined"){
//             res.status(200).json({
//                 message: "Data processed successfully!",
//                 skippedRecords
//             });
//         }
//         else{
//         console.error("Error processing file:", error);
//         res.status(500).json({ message: "Internal server error", error });
//         }
//     }
// };

// module.exports = { uploadTestResults };
