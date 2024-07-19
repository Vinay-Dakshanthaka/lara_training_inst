const express = require('express');
const placementTestRoute = express.Router();
// const verifyToken = require('../middleware/authMiddleware')
const placementTestContoller = require('../controllers/placementTestController')

placementTestRoute.post('/create-test-link', placementTestContoller.createPlacementTestLink); 

placementTestRoute.post('/save-placement-test-student', placementTestContoller.savePlacementTestStudent);

placementTestRoute.get('/get-all-placement-tests', placementTestContoller.getAllPlacementTests);

placementTestRoute.post('/fetchTestTopicIdsAndQnNums', placementTestContoller.fetchTestTopicIdsAndQnNums);

placementTestRoute.post('/savePlacementTestResults', placementTestContoller.savePlacementTestResults);

placementTestRoute.get('/getAllResults', placementTestContoller.getAllResults);

placementTestRoute.post('/getAllResultsByTestId', placementTestContoller.getAllResultsByTestId);

placementTestRoute.post('/disable-link', placementTestContoller.disableLink);


module.exports = placementTestRoute;
