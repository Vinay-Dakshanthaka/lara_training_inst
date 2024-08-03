const express = require('express');
const placementTestRoute = express.Router();
// const verifyToken = require('../middleware/authMiddleware')
const placementTestContoller = require('../controllers/placementTestController')
const multer = require('multer');
const { Student } = require('../models');
const upload = multer({ dest: 'cumulative_questions/' });
const verifyToken = require('../middleware/authMiddleware');

placementTestRoute.post('/create-test-link', placementTestContoller.createPlacementTestLink); 

placementTestRoute.post('/save-placement-test-student', placementTestContoller.savePlacementTestStudent);

placementTestRoute.get('/get-all-placement-tests', placementTestContoller.getAllPlacementTests);

placementTestRoute.post('/fetchTestTopicIdsAndQnNums', placementTestContoller.fetchTestTopicIdsAndQnNums);

placementTestRoute.post('/savePlacementTestResults', placementTestContoller.savePlacementTestResults);

placementTestRoute.get('/getAllResults', placementTestContoller.getAllResults);

placementTestRoute.post('/getAllResultsByTestId', placementTestContoller.getAllResultsByTestId);

placementTestRoute.post('/disable-link', placementTestContoller.disableLink);

placementTestRoute.post('/fetchQuestionsByTopicIds', placementTestContoller.fetchQuestionsByTopicIds);

placementTestRoute.post('/fetchQuestionsUsingTopicId', placementTestContoller.fetchQuestionsUsingTopicId);

placementTestRoute.post('/assignQuestionsToPlacementTest', placementTestContoller.assignQuestionsToPlacementTest);

placementTestRoute.post('/saveQuestionAndAddToLink', placementTestContoller.saveQuestionAndAddToLink);

placementTestRoute.post('/saveOneQuestionAndAddToLink', placementTestContoller.saveOneQuestionAndAddToLink);

placementTestRoute.post('/getTopicsByPlacementTestId', placementTestContoller.getTopicsByPlacementTestId);

placementTestRoute.post('/getPlacementTestById', placementTestContoller.getPlacementTestById);

placementTestRoute.post('/upload-questions-link', upload.single('file'), async (req, res) => {
    const topic_id = req.query.topic_id;
    const placement_test_id = req.query.placement_test_id; // Add placement_test_id if needed
    const filePath = req.file.path;

    if (!topic_id) {
        return res.status(400).send({ message: "topic_id query parameter is required." });
    }

    try {
        await placementTestContoller.uploadAndAssignQuestionsToLink(filePath, topic_id, placement_test_id);
        res.status(200).send({ message: "Excel data processed and questions assigned successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

placementTestRoute.post('/upload-questions-by-excel-topics', upload.single('file'), async (req, res) => {
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



module.exports = placementTestRoute;
