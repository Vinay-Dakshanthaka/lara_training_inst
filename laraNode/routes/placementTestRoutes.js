const fs = require("fs");
const path = require("path");
const multer = require('multer');
const storage = multer.memoryStorage();
const express = require('express');
const placementTestRoute = express.Router();
// const verifyToken = require('../middleware/authMiddleware')
const placementTestContoller = require('../controllers/placementTestController')
const { Student } = require('../models');
const upload = multer({ dest: 'cumulative_questions/' });
const uploadCertificate = multer({ storage });
const verifyToken = require('../middleware/authMiddleware');
const uploadQuestionImage = multer({ dest: 'cumulative_question_images/' });
const nodemailer = require('nodemailer');
const logoPath = path.join(__dirname, 'laralogo.png');
const XLSX = require('xlsx');
const db = require('../models');

placementTestRoute.post('/create-test-link', verifyToken,  placementTestContoller.createPlacementTestLink);

placementTestRoute.put('/updatePlacementTest/:placement_test_id', verifyToken,  placementTestContoller.updatePlacementTest);

placementTestRoute.post('/saveWhatsAppChannelLink', placementTestContoller.saveWhatsAppChannelLink);

placementTestRoute.post('/assignWhatsAppChannelToStudent', placementTestContoller.assignWhatsAppChannelToStudent);

placementTestRoute.get('/getAllStudentsWithWhatsAppChannelLinks', placementTestContoller.getAllStudentsWithWhatsAppChannelLinks);

placementTestRoute.get('/getStudentWithWhatsAppChannelLinks', verifyToken, placementTestContoller.getStudentWithWhatsAppChannelLinks);

placementTestRoute.get('/getAllWhatsAppChannelLinks', placementTestContoller.getAllWhatsAppChannelLinks);

placementTestRoute.put('/updateWhatsAppChannelLink/:id', placementTestContoller.updateWhatsAppChannelLink);

placementTestRoute.get('/getPlacementTestDetailsById/:placement_test_id', placementTestContoller.getPlacementTestDetailsById);

placementTestRoute.delete('/deleteWhatsAppChannelLink/:id', placementTestContoller.deleteWhatsAppChannelLink);

placementTestRoute.get('/fetchWhatsAppChannelLinks', placementTestContoller.fetchWhatsAppChannelLinks);

placementTestRoute.get('/fetchWhatsAppChannelLinkById/:channel_id', placementTestContoller.fetchWhatsAppChannelLinkById);

placementTestRoute.post('/save-placement-test-student', placementTestContoller.savePlacementTestStudent);

placementTestRoute.get('/get-all-placement-tests', placementTestContoller.getAllPlacementTests);

placementTestRoute.get('/get-all-placement-tests-descriptive', placementTestContoller.getAllPlacementTestsDescriptive);

placementTestRoute.get('/getAllPlacementTestsByCreator',verifyToken, placementTestContoller.getAllPlacementTestsByCreator);

placementTestRoute.post('/fetchTestTopicIdsAndQnNums', placementTestContoller.fetchTestTopicIdsAndQnNums);

placementTestRoute.post('/savePlacementTestResults', placementTestContoller.savePlacementTestResults);

placementTestRoute.get('/getPlacementTestResultsByEmail/:email', placementTestContoller.getPlacementTestResultsByEmail);
placementTestRoute.put('/updateEmail/:email', placementTestContoller.updateStudentEmail);

placementTestRoute.get('/getAllResults', placementTestContoller.getAllResults);

placementTestRoute.post('/getAllResultsByTestId', placementTestContoller.getAllResultsByTestId);

placementTestRoute.post('/disable-link', placementTestContoller.disableLink);

placementTestRoute.post('/updateNumberOfQuestions', placementTestContoller.updateNumberOfQuestions);

placementTestRoute.post('/updateIsMonitored', placementTestContoller.updateIsMonitored);

placementTestRoute.post('/fetchQuestionsByTopicIds', placementTestContoller.fetchQuestionsByTopicIds);

placementTestRoute.post('/fetchQuestionsUsingTopicId', placementTestContoller.fetchQuestionsUsingTopicId);

placementTestRoute.post('/assignQuestionsToPlacementTest', placementTestContoller.assignQuestionsToPlacementTest);

placementTestRoute.post('/saveQuestionAndAddToLink', placementTestContoller.saveQuestionAndAddToLink);

placementTestRoute.post('/saveOneQuestionAndAddToLink', placementTestContoller.saveOneQuestionAndAddToLink);

placementTestRoute.post('/getTopicsByPlacementTestId', placementTestContoller.getTopicsByPlacementTestId);

placementTestRoute.post('/getPlacementTestById', placementTestContoller.getPlacementTestById);

//-------- descriptive test for without registeration requirement in the app --------------

placementTestRoute.post('/createDescriptiveTestLink',verifyToken, placementTestContoller.createDescriptiveTestLink);


// placementTestRoute.post('/upload-questions-link', upload.single('file'), async (req, res) => {
//     const topic_id = req.query.topic_id;
//     const placement_test_id = req.query.placement_test_id; // Add placement_test_id if needed
//     const filePath = req.file.path;

//     if (!topic_id) {
//         return res.status(400).send({ message: "topic_id query parameter is required." });
//     }

//     try {
//         await placementTestContoller.uploadAndAssignQuestionsToLink(filePath, topic_id, placement_test_id);
//         res.status(200).send({ message: "Excel data processed and questions assigned successfully." });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({ message: error.message });
//     }
// });

placementTestRoute.post('/upload-questions-link', upload.single('file'), async (req, res) => {
    const topic_id = req.query.topic_id;
    const placement_test_id = req.query.placement_test_id; // Optional
    const filePath = req.file?.path;

    if (!topic_id) {
        return res.status(400).send({ 
            message: "The 'topic_id' query parameter is required." 
        });
    }

    if (!filePath) {
        return res.status(400).send({ 
            message: "No file uploaded. Please upload a valid Excel file." 
        });
    }

    try {
        // Call the controller method to process the file
        const response = await placementTestContoller.uploadAndAssignQuestionsToLink(filePath, topic_id, placement_test_id);

        res.status(200).send({
            message: "Excel data processed successfully.",
            summary: response.summary,
            skippedQuestions: response.skippedQuestions
        });
    } catch (error) {
        console.error('Error processing questions:', error);
        res.status(500).send({
            message: "An error occurred while processing the Excel file.",
            error: error.message
        });
    }
});


placementTestRoute.post('/upload-questions-by-excel-topics', uploadCertificate.single('file'), async (req, res) => {
    const { link_topic_ids } = req.body;
    const placement_test_id = req.body.placement_test_id;
    const filePath = req.file.path;

    try {
        const nonExistingTopics = [];
        const nonLinkedTopics = [];
        await placementTestContoller.uploadAndAssignQuestionsByExcelTopics(filePath, link_topic_ids, nonExistingTopics, nonLinkedTopics, placement_test_id);
        res.status(200).send({
            message: "Excel data processed. Some topics were skipped.",
            nonExistingTopics,
            nonLinkedTopics
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

let transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465, // or 465 for secure connection
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});




placementTestRoute.post(
    "/send-certificate-to-email",
    uploadCertificate.single("pdf"), // Use memory storage
    async (req, res) => {
        let tempFilePath;

        try {
            const { email, name } = req.body;
             console.log(req.body,"------------------------------------")
            console.log("Request Body:", req.body);
            console.log("Uploaded File:", req.file);

            // Validate required fields
            if (!email || !name || !req.file) {
                return res.status(400).json({ message: "Missing required fields." });
            }

            const pdfBuffer = req.file.buffer; // Access the buffer
            if (!pdfBuffer) {
                throw new Error("PDF buffer is undefined.");
            }
            console.log("PDF Buffer:", pdfBuffer);

            // Define temporary file path for backup
            const tempFolder = path.join(__dirname, "../temp");
            if (!fs.existsSync(tempFolder)) {
                fs.mkdirSync(tempFolder, { recursive: true });
            }

            tempFilePath = path.join(tempFolder, `${name}_Certificate_Test.pdf`);
            fs.writeFileSync(tempFilePath, pdfBuffer);
            console.log(`PDF saved to: ${tempFilePath}`);


            const mailOptions = {
                from: process.env.EMAIL_USERNAME,
                to: email,
                subject: "Your Certificate",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <img src="cid:logo" alt="Lara Technologies" style="max-width: 150px; height: auto;">
                        </div>
                        <h2 style="text-align: center; color: #333;">Congratulations, ${name}!</h2>
                        <p style="font-size: 16px; color: #555; text-align: center;">
                            Attached is your certificate for successfully completing the test.
                        </p>
                        <p style="font-size: 16px; color: #555; text-align: center;">
                            We appreciate your efforts and wish you all the best in your future endeavors.
                        </p>
                        <div style="text-align: center; margin-top: 20px;">
                            <p style="font-size: 14px; color: #888;">
                                - Lara Technologies Team
                            </p>
                        </div>
                    </div>
                `,
                attachments: [
                    {
                        filename: `${name}_Certificate.pdf`,
                        content: pdfBuffer, // Attach the certificate buffer
                    },
                    {
                        filename: 'laralogo.png', // Embed the logo image
                        path: logoPath,
                        cid: 'logo', // Content ID for embedding in the HTML
                    },
                ],
            };            
               console.log(mailOptions,"----------------mailoptions")
            await transporter.sendMail(mailOptions);

            // Clean up temporary file
            fs.unlinkSync(tempFilePath);
            console.log(`Temporary file deleted: ${tempFilePath}`);

            res.status(200).json({ message: "Email sent successfully." });
        } catch (error) {
            console.error("Error sending email:", error);

            if (tempFilePath && fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
                console.log(`Temporary file deleted after error: ${tempFilePath}`);
            }

            res.status(500).json({ message: "Failed to send email.", error: error.message });
        }
    }
);


// placementTestRoute.post('/upload-questions', upload.single('file'), async (req, res) => {
//     const {placement_test_id, topic_id } = req.body;
//     const filePath = req.file.path;

//     if (!placement_test_id || !topic_id) {
//         return res.status(400).send({ message: "Test ID (wt_id) and Topic ID (topic_id) are required." });
//     }

//     try {
        
//         const workbook = XLSX.readFile(filePath);
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];

//         const data = XLSX.utils.sheet_to_json(sheet); // Get data from the sheet as JSON

//         if (data.length === 0) {
//             return res.status(400).send({ message: "No data found in the uploaded file." });
//         }

//         for (const row of data) {
//             const { wt_question_description, marks, minutes} = row;

//             const wt_question = await db.WeeklyTestQuestion.create({
//                 wt_question_description: wt_question_description,
//                 marks: marks,
//                 minutes: minutes,
//                 topic_id: topic_id,
//             });

           
//             // if (wt_question && keywords) {
             
//             //     await db.WeeklyTestQuestionAnswer.create({
//             //         wt_question_id: wt_question.dataValues.wt_question_id,
//             //         keywords: keywords || "ntg", 
//             //         createdAt: new Date(),
//             //         updatedAt: new Date(),
//             //     });
//             // }


//         }

//         res.status(200).send({ message: "Excel data processed and questions assigned successfully." });
//     } catch (error) {
//         console.error("Error processing the Excel file:", error);
//         res.status(500).send({ message: "Error processing the Excel file." });
//     }
// });

placementTestRoute.post('/upload-questions', upload.single('file'), async (req, res) => {
    const { placement_test_id, topic_id } = req.body;
    const filePath = req.file.path;

    if (!placement_test_id || !topic_id) {
        return res.status(400).send({ message: "Test ID (placement_test_id) and Topic ID (topic_id) are required." });
    }

    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(sheet); // Convert sheet data to JSON

        if (data.length === 0) {
            return res.status(400).send({ message: "No data found in the uploaded file." });
        }

        const createdQuestions = []; // Store created question IDs

        for (const row of data) {
            const { wt_question_description, marks, minutes } = row;

            // Store question in WeeklyTestQuestion table
            const wt_question = await db.WeeklyTestQuestion.create({
                wt_question_description,
                marks,
                minutes,
                topic_id,
            });

            // Store question ID for mapping
            createdQuestions.push(wt_question.dataValues.wt_question_id);
        }

        // Insert mapping records in placementtestweeklyquestionmapping
        for (const question_id of createdQuestions) {
            await db.PlacementTestWeeklyQuestionMapping.create({
                placement_test_id,
                wt_question_id: question_id,
            });
        }

        res.status(200).send({ message: "Questions uploaded and mapped successfully." });
    } catch (error) {
        console.error("Error processing the Excel file:", error);
        res.status(500).send({ message: "Error processing the Excel file." });
    }
});


module.exports = placementTestRoute;
