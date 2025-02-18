const express = require("express");
const multer = require("multer");
const paperBasedTestController = require('../controllers/paperBasedTestResultController');
const paperBasedTestrouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const verifyToken = require('../middleware/authMiddleware');

paperBasedTestrouter.post("/uploadTestResults", upload.single("file"), paperBasedTestController.uploadTestResults);
paperBasedTestrouter.post("/getAttendedStudentsByBatch",  paperBasedTestController.getAttendedStudentsByBatch);
// paperBasedTestrouter.post("/getStudentTestResults",  paperBasedTestController.getStudentTestResults);
paperBasedTestrouter.post("/getBatchResults",  paperBasedTestController.getBatchResults);
paperBasedTestrouter.get("/exam-results",verifyToken,  paperBasedTestController.getStudentExamResults);
paperBasedTestrouter.get("/getAllStudentsExamAttended",  paperBasedTestController.getAllStudentsExamAtteneded);


module.exports = paperBasedTestrouter;
