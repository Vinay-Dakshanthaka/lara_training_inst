const express = require('express');
const internalTestRoute = express.Router();
// const verifyToken = require('../middleware/authMiddleware')
const internalTestController = require('../controllers/internalTestController')
const multer = require('multer');
const { Student } = require('../models');
const upload = multer({ dest: 'cumulative_questions/' });
const verifyToken = require('../middleware/authMiddleware');

internalTestRoute.post('/createInternalTestLink', internalTestController.createInternalTestLink); 

internalTestRoute.put('/updateInternalTestLink/:internal_test_id', internalTestController.updateInternalTestLink); 

internalTestRoute.get('/getAllInternalTests', internalTestController.getAllInternalTests); 

internalTestRoute.get('/getInternalTestById/:internal_test_id', internalTestController.getInternalTestById); 

internalTestRoute.post('/saveQuestionAndAddToLinkTopic', internalTestController.saveQuestionAndAddToLinkTopic); 

internalTestRoute.post('/assignQuestionsToInternalTestLink', internalTestController.assignQuestionsToInternalTestLink); 

internalTestRoute.post('/fetchQuestionsByInternalTestId', verifyToken, internalTestController.fetchQuestionsByInternalTestId); 

internalTestRoute.post('/saveInternalTestResults',verifyToken, internalTestController.saveInternalTestResults); 

internalTestRoute.get('/results/:internal_test_id',verifyToken, internalTestController.fetchInternalTestResults); 

internalTestRoute.get('/getStudentInternalTestDetails',verifyToken, internalTestController.getStudentInternalTestDetails);

internalTestRoute.get('/getStudentPerformance',verifyToken, internalTestController.getStudentPerformance); 

internalTestRoute.post('/getStudentPerformanceForAdmin', internalTestController.getStudentPerformanceForAdmin); 

internalTestRoute.get('/getAllStudentDetailsForPerformance',verifyToken, internalTestController.getAllStudentDetailsForPerformance); 

internalTestRoute.get('/getAllStudentsPerformance',verifyToken, internalTestController.getAllStudentsPerformance); 

internalTestRoute.post('/getAllInternalTestResultsByTestId',verifyToken, internalTestController.getAllInternalTestResultsByTestId); 

internalTestRoute.post('/upload-questions-link', upload.single('file'), async (req, res) => {
    const topic_id = req.query.topic_id;
    const internal_test_id = req.query.internal_test_id;
    const filePath = req.file.path;

    if (!topic_id || !internal_test_id) {
        return res.status(400).send({ message: "topic_id and internal_test_id query parameters are required." });
    }

    try {
        await internalTestController.uploadAndAssignQuestionsToLink(filePath, topic_id, internal_test_id);
        res.status(200).send({ message: "Excel data processed and questions assigned successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});



module.exports = internalTestRoute;