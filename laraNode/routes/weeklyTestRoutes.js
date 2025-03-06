const express = require('express');
const weeklyTestRouter = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'weekly_test_questions/' });

const XLSX = require('xlsx'); // For parsing Excel files
const db = require('../models');

const weeklyTestController = require('../controllers/weeklyTestController');
const verifyToken = require('../middleware/authMiddleware');

weeklyTestRouter.post('/createWeeklyTestLink', weeklyTestController.createWeeklyTestLink);

weeklyTestRouter.get('/getWeeklyTestById/:wt_id', weeklyTestController.getWeeklyTestById);

weeklyTestRouter.put('/updateWeeklyTest/:wt_id', weeklyTestController.updateWeeklyTest);

weeklyTestRouter.get('/getAllWeeklyTests', weeklyTestController.getAllWeeklyTests);

weeklyTestRouter.post('/saveQuestionHandler', weeklyTestController.saveQuestionHandler);

weeklyTestRouter.get('/getQuestionsByWeeklyTestId/:wt_id', weeklyTestController.getQuestionsByWeeklyTestId);

weeklyTestRouter.get('/getQuestionsByTopicId/:topic_id', weeklyTestController.getQuestionsByTopicId);

weeklyTestRouter.get('/getQuestionById/:wt_question_id', weeklyTestController.getQuestionById);

weeklyTestRouter.delete('/deleteQuestionById/:wt_question_id', weeklyTestController.deleteQuestionById);

weeklyTestRouter.post('/updateQuestionById', weeklyTestController.updateQuestionById);

weeklyTestRouter.post('/assignQuestionsToTestHandler', weeklyTestController.assignQuestionsToTestHandler);

weeklyTestRouter.post('/saveStudentAnswer', verifyToken, weeklyTestController.saveStudentAnswer);

weeklyTestRouter.get('/getStudentAnswer/:wt_id/:question_id', verifyToken, weeklyTestController.getStudentAnswer);

weeklyTestRouter.post('/saveFinalSubmission', verifyToken, weeklyTestController.saveFinalSubmission);

weeklyTestRouter.put('/updateQuestionHandler/:question_id', weeklyTestController.updateQuestionHandler);

weeklyTestRouter.post('/saveAnswerFortheQuestion/:question_id', weeklyTestController.saveAnswerFortheQuestion);

weeklyTestRouter.get('/getCorrectAnswerForQuestion/:question_id', weeklyTestController.getCorrectAnswerForQuestion);

weeklyTestRouter.post('/getStudentAnswerAndQuestion', weeklyTestController.getStudentAnswerAndQuestion);

weeklyTestRouter.get('/getQuestionAnswerDataByStudentId/:wt_id/:student_id', weeklyTestController.getQuestionAnswerDataByStudentId);

weeklyTestRouter.get('/getStudentEvaluationStatusByWeeklyTestId/:wt_id', weeklyTestController.getStudentEvaluationStatusByWeeklyTestId);

weeklyTestRouter.get('/getStudentDetailsByWeeklyTestId/:wt_id', weeklyTestController.getStudentDetailsByWeeklyTestId);

weeklyTestRouter.get('/getUniqueStudentsByWeeklyTestId/:wt_id', weeklyTestController.getUniqueStudentsByWeeklyTestId);

weeklyTestRouter.put('/updateMarksAndCommentByStudentId/:wt_id/:student_id/:question_id', weeklyTestController.updateMarksAndCommentByStudentId);

weeklyTestRouter.get('/getStudentAndTestDetailsByStudentId/:wt_id/:student_id', weeklyTestController.getStudentAndTestDetailsByStudentId);

weeklyTestRouter.get('/getAllActiveWeeklyTests', weeklyTestController.getAllActiveWeeklyTests);

weeklyTestRouter.get('/getStudentAndActiveTestsWithAttendance', verifyToken, weeklyTestController.getStudentAndActiveTestsWithAttendance);

weeklyTestRouter.get('/getStudentAndActiveTestsWithAttendanceForAdmin/:studentId', weeklyTestController.getStudentAndActiveTestsWithAttendanceForAdmin);

weeklyTestRouter.get('/getStudentsWeeklyTestDetailedSummary/:wt_id', verifyToken, weeklyTestController.getStudentsWeeklyTestDetailedSummary);

weeklyTestRouter.get('/getAllStudentResultsForWeeklyTest/:wt_id',  weeklyTestController.getAllStudentResultsForWeeklyTest);

weeklyTestRouter.get('/getAllIndividualStudentResultsForTest/:wt_id',  weeklyTestController.getAllIndividualStudentResultsForTest);


weeklyTestRouter.delete('/deleteinternaltests/:wt_id', weeklyTestController.deleteinternaltests);


weeklyTestRouter.post('/checkAndSubmitTest/', weeklyTestController.checkAndSubmitTest);

weeklyTestRouter.put('/updateEvaluationStatus/', weeklyTestController.updateEvaluationStatus);


// weeklyTestRouter.post('/upload-questions', upload.single('file'), async (req, res) => {
//     const { wt_id, topic_id } = req.body;
//     const filePath = req.file.path;

//     if (!wt_id || !topic_id) {
//         return res.status(400).send({ message: "Test ID (wt_id) and Topic ID (topic_id) are required." });
//     }

//     try {
//         await weeklyTestController.saveAndAssignQuestionsFromExcel(filePath, wt_id, topic_id);
//         res.status(200).send({ message: "Excel data processed and questions assigned successfully." });
//     } catch (error) {
//         console.error("Error processing the Excel file:", error);
//         res.status(500).send({ message: "Error processing the Excel file." });
//     }
// });


weeklyTestRouter.post('/upload-questions', upload.single('file'), async (req, res) => {
    const { wt_id, topic_id } = req.body;
    const filePath = req.file.path;

    if (!wt_id || !topic_id) {
        return res.status(400).send({ message: "Test ID (wt_id) and Topic ID (topic_id) are required." });
    }

    try {
        
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(sheet); // Get data from the sheet as JSON

        if (data.length === 0) {
            return res.status(400).send({ message: "No data found in the uploaded file." });
        }

        for (const row of data) {
            const { wt_question_description, marks, minutes, keywords } = row;

            const wt_question = await db.WeeklyTestQuestion.create({
                wt_question_description: wt_question_description,
                marks: marks,
                minutes: minutes,
                topic_id: topic_id,
            });

           
            if (wt_question && keywords) {
             
                await db.WeeklyTestQuestionAnswer.create({
                    wt_question_id: wt_question.dataValues.wt_question_id,
                    keywords: keywords || "ntg", 
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
        }

        res.status(200).send({ message: "Excel data processed and questions assigned successfully." });
    } catch (error) {
        console.error("Error processing the Excel file:", error);
        res.status(500).send({ message: "Error processing the Excel file." });
    }
});


module.exports = weeklyTestRouter;