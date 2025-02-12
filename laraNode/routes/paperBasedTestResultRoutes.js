const express = require("express");
const multer = require("multer");
const paperBasedTestController = require('../controllers/paperBasedTestResultController');
const paperBasedTestrouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

paperBasedTestrouter.post("/uploadTestResults", upload.single("file"), paperBasedTestController.uploadTestResults);
paperBasedTestrouter.post("/getAttendedStudentsByBatch",  paperBasedTestController.getAttendedStudentsByBatch);
// paperBasedTestrouter.post("/getStudentTestResults",  paperBasedTestController.getStudentTestResults);
paperBasedTestrouter.post("/getBatchResults",  paperBasedTestController.getBatchResults);


module.exports = paperBasedTestrouter;
