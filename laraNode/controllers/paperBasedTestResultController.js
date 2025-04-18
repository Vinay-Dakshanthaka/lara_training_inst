const XLSX = require("xlsx");
const { Student , Student_Batch} = require("../models");
const db = require("../models");
const { Op } = require("sequelize");
const paperBasedTestResults = db.PaperBasedTestResults;
const { Sequelize } = require('sequelize'); 

// const isValidEmail = (email) => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// };

const uploadTestResults = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded!" });
        }

        console.log("---------------------------------------");
        const conducted_date = req.body.conducted_date;

        if (!conducted_date) {
            return res.status(400).json({ message: "Conducted date is required!" });
        }

        // Read Excel file
        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log("--------------------------");

        const skippedRecords = [];
        const updatedRecords = [];
        const insertedRecords = [];

        console.log("------------------------------");

        for (let row of data) {
            try {
                const { studentId, obtainedMarks, totalMarks, subjectName, topicName, testName } = row;

                if (!studentId || !totalMarks || !subjectName || !topicName || !testName) {
                    skippedRecords.push({ studentId: studentId || "N/A", reason: "Invalid data format or missing fields" });
                    continue;
                }

                console.log(row.studentId, "------------------id");

                // Find student using uniqueStudentId
                const student = await Student.findOne({ where: { uniqueStudentId: studentId } });

                if (!student) {
                    skippedRecords.push({ studentId, reason: "Student with the provided ID not found" });
                    continue;
                }

                const uniqueStudentId = student.uniqueStudentId;

                // Check if the test result already exists
                const existingResult = await paperBasedTestResults.findOne({
                    where: {
                        uniqueStudentId: uniqueStudentId,
                        testName: testName,
                    }
                });

                console.log(existingResult, "-----------------------------yes");

                if (existingResult) {
                    // Update the existing test result
                    await existingResult.update({
                        obtainedMarks: obtainedMarks || existingResult.obtainedMarks,
                        totalMarks: totalMarks || existingResult.totalMarks,
                        subjectName: subjectName || existingResult.subjectName,
                        topicName: topicName || existingResult.topicName,
                        conducted_date: conducted_date || existingResult.conducted_date,
                        updatedAt: new Date(),
                    });

                    updatedRecords.push({ studentId, message: "Test result updated successfully" });
                } else {
                    // Insert a new test result
                    await paperBasedTestResults.create({
                        studentId: student.id,
                        uniqueStudentId: uniqueStudentId,
                        obtainedMarks: row.obtainedMarks || 0,
                        totalMarks: row.totalMarks || 12,
                        subjectName: row.subjectName || "core java",
                        topicName: row.topicName || "basics",
                        conducted_date: conducted_date,
                        testName: row.testName,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });

                    insertedRecords.push({ studentId, message: "Test result added successfully" });
                }

            } catch (err) {
                console.error("Skipping row due to error:", err.message);
                skippedRecords.push({ studentId: row.studentId || "Unknown", reason: err.message });
            }
        }

        res.status(200).json({
            message: "Data processed successfully!",
            updatedRecords,
            insertedRecords,
            skippedRecords,
        });

        console.log('---------------------------------------');
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};


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


const getStudentExamResults = async (req, res) => {
    try {
    
        const studentId = req.studentId; 
        console.log(studentId,"----------------studentid")

        if (!studentId) {
            return res.status(400).json({ message: "Student ID not found!" });
        }

        // Fetch all exam results for the given studentId
        const results = await paperBasedTestResults.findAll({
            where: { studentId: studentId },
            order: [["conducted_date", "DESC"]],  // Sort by conducted date (most recent first)
        });

        if (!results || results.length === 0) {
            return res.status(404).json({ message: "No exam results found for this student." });
        }

        res.status(200).json({
            message: "Exam results fetched successfully!",
            results,
        });
    } catch (error) {
        console.error("Error fetching exam results:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const getStudentIDExamResults = async (req, res) => {
    try {
    
        const { id } = req.params; 
        console.log(id, "----------------studentid");
        

        if (!id) {
            return res.status(400).json({ message: "Student ID not found!" });
        }

        // Fetch all exam results for the given studentId
        const results = await paperBasedTestResults.findAll({
            where: { studentId: id },
            order: [["conducted_date", "DESC"]],  
        });
          
        if (!results || results.length === 0) {
            return res.status(404).json({ message: "No exam results found for this student." });
        }

        res.status(200).json({
            message: "Exam results fetched successfully!",
            results,
        });
    } catch (error) {
        console.error("Error fetching exam results:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const getAllStudentsExamAtteneded = async (req, res) => {
    try {
        // Fetch unique student IDs from the test results
        const uniqueStudentIds = await paperBasedTestResults.findAll({
            attributes: ['studentId'],
            group: ['studentId']
        });
         
        const studentIds = uniqueStudentIds.map(record => record.studentId);

        // Fetch student details along with their exam stats
        const studentStats = await Promise.all(studentIds.map(async (studentId) => {
            const student = await Student.findOne({ where: { id: studentId } });
            if (!student) return null;

            const results = await paperBasedTestResults.findAll({
                where: { studentId },
                attributes: ['obtainedMarks', 'totalMarks'],
            });

            const totalExams = results.length;
            const totalObtainedMarks = results.reduce((sum, record) => sum + record.obtainedMarks, 0);
            const totalMarks = results.reduce((sum, record) => sum + record.totalMarks, 0);
            const percentage = totalMarks > 0 ? ((totalObtainedMarks / totalMarks) * 100).toFixed(2) : 0;

            return {
                id:studentId,
                name: student.name,
                totalTests :totalExams,
                totalMarksObtained:totalObtainedMarks,
                totalMarks,
                percentage: `${percentage}%`
            };
        }));

        res.status(200).json({ success: true, data: studentStats.filter(stat => stat !== null) });
    } catch (error) {
        console.error("Error fetching student exam stats:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getUniqueTestNames = async (req, res) => {
    try {
        const uniqueTestNames = await paperBasedTestResults.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('testName')), 'testName']], // Use DISTINCT to fetch unique test names
            raw: true // Raw ensures that we get the result directly as an array
        });
          
        if (uniqueTestNames.length === 0) {
            return res.status(404).json({ message: "No unique test names found." });
        }

        // Extracting the testNames from the returned array
        const testNames = uniqueTestNames.map(item => item.testName);

        return res.status(200).json({ uniqueTestNames: testNames });
    } catch (error) {
        console.error("Error fetching unique test names:", error);
        return res.status(500).json({ message: "Server error. Could not fetch unique test names." });
    }
};


const getStudentResultsByTestName = async (req, res) => {
    const { testName } = req.params;

    if (!testName) {
        return res.status(400).json({ message: "Test name is required." });
    }

    try {
      
        const results = await paperBasedTestResults.findAll({
            where: { testName },
            attributes: [
                'uniqueStudentId',
                'obtainedMarks',
                'totalMarks',
                'subjectName',
                'topicName',
                'conducted_date'
            ],
            include: [
                {
                    model: Student, 
                    attributes: ['name'], 
                }
            ]
        });

        if (results.length === 0) {
            return res.status(404).json({ message: `No results found for test: ${testName}` });
        }

        // Add percentage calculation
        const resultsWithPercentage = results.map(result => {
            const obtainedMarks = result.obtainedMarks || 0;
            const totalMarks = result.totalMarks || 0;
            const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

            return {
                studentName: result.Student.name, 
                uniqueStudentId: result.uniqueStudentId,
                obtainedMarks: result.obtainedMarks,
                totalMarks: result.totalMarks,
                subjectName: result.subjectName,
                topicName: result.topicName,
                conducted_date: result.conducted_date,
                percentage: percentage.toFixed(2),
            };
        });

        return res.status(200).json({ testName, results: resultsWithPercentage });

    } catch (error) {
        console.error("Error fetching student results:", error);
        return res.status(500).json({ message: "Server error. Could not fetch student results." });
    }
};


module.exports = { uploadTestResults,
                  getAttendedStudentsByBatch,
                  getBatchResults,
                  getStudentExamResults,
                  getAllStudentsExamAtteneded,
                  getUniqueTestNames,
                  getStudentResultsByTestName,
                  getStudentIDExamResults,
 };

