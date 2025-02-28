const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const searchController = require('../controllers/searchController');
const batchController = require('../controllers/batchController');
const reviewController = require('../controllers/reviewsController');
const assignmentController = require('../controllers/assignmentController')
const collegeController = require('../controllers/collegeController')
const attendanceController = require('../controllers/attendanceController')
const homeContentController = require('../controllers/homeContentController')
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({dest: 'Images/' });
const uploadQuestionImage = multer({dest: 'questionImages/' });

// Route to save a new student
router.post('/saveStudent', studentController.saveStudent);

router.post('/verifyByEmailAndPassword', studentController.verifyByEmailAndPassword);

router.post('/verifyByPhoneAndPassword', studentController.verifyByPhoneAndPassword);

// Get student details based on authenticated user's token
router.get('/getStudentDetails', verifyToken, studentController.getStudentDetails);

router.post('/getStudentDetailsById', verifyToken, studentController.getStudentDetailsById);

// Update student details based on authenticated user's token
router.put('/updateRole', verifyToken, studentController.updateRole);

// Save or update profile details based on authenticated user's token
router.post('/saveOrUpdateProfile', verifyToken, studentController.saveOrUpdateProfile);

// Get profile details based on authenticated user's token
router.get('/getProfileDetails', verifyToken, studentController.getProfileDetails);

router.post('/getProfileDetailsById', verifyToken, studentController.getProfileDetailsById);

router.post('/uploadProfileImage', verifyToken, upload.single('image'), studentController.uploadProfileImage);

router.get('/profile/image', verifyToken, studentController.getProfileImage);

router.post('/getProfileImageFor', studentController.getProfileImageFor);

// Get all student details
router.get('/getAllStudentDetails', verifyToken, studentController.getAllStudentDetails);

router.get('/getAllStudentProfileDetails', verifyToken, studentController.getAllStudentProfileDetails);

router.put('/updatePassword', verifyToken, studentController.updatePassword);

router.get('/searchByEmail', verifyToken, searchController.searchByEmail);

router.get('/searchByName', verifyToken, searchController.searchByName);

router.get('/searchByPhoneNumber', verifyToken, searchController.searchByPhoneNumber);

router.get('/profilePhoneNumber', verifyToken, searchController.profilePhoneNumberr);

router.post('/searchByQualification', verifyToken, searchController.searchByQualification);

router.post('/searchBySpecialization', verifyToken, searchController.searchBySpecialization);

router.post('/sendPasswordResetEmail', studentController.sendPasswordResetEmail);

router.post('/resetPassword', studentController.resetPassword);

router.post('/saveBatch',verifyToken, batchController.saveBatch)

router.post('/getBatchById',verifyToken, batchController.getBatchById)

router.post('/assignBatchesToStudent',verifyToken,batchController.assignBatchesToStudent)

router.get('/getStudentBatches',verifyToken,batchController.getStudentBatches)

router.get('/getAllStudentsWithBatches',verifyToken,batchController.getAllStudentsWithBatches)

router.get('/getAllBatches',verifyToken,batchController.getAllBatches)

router.post('/deassignBatchesFromStudent',verifyToken,batchController.deassignBatchesFromStudent)

router.post('/getStudentsByBatches',verifyToken,batchController.getStudentsByBatches)

router.delete('/deleteBatch',verifyToken,batchController.deleteBatch)

router.put('/updateBatch',verifyToken,batchController.updateBatch)

router.post('/assignTrainersToBatch',verifyToken,batchController.assignTrainersToBatch)

router.get('/fetchBatchesAssignedToTrainer',verifyToken,batchController.fetchBatchesAssignedToTrainer)

// router.get('/fetchTrainerDetailsFromBatch',verifyToken,batchController.fetchTrainerDetailsFromBatch)

router.get('/fetchTrainerAndBatchFromStudent',verifyToken,batchController.fetchTrainerAndBatchFromStudent)

router.post('/fetchTrainerAndBatchFromStudentId',verifyToken,batchController.fetchTrainerAndBatchFromStudentId)

router.get('/fetchAllTrainerAndBatch',verifyToken,batchController.fetchAllTrainerAndBatch)

router.post('/deassignBatchFromTrainer',verifyToken,batchController.deassignBatchFromTrainer)

router.get('/fetchBatchesAssignedToTrainer',verifyToken,batchController.fetchBatchesAssignedToTrainer)

router.post('/assignBatchesToTrainer',verifyToken,batchController.assignBatchesToTrainer)

router.post('/getStudentsByBatchId',verifyToken,batchController.getStudentsByBatchId)

router.post('/getBatchsByStudentId',verifyToken,batchController.getBatchsByStudentId);

router.post('/assignUniqueIdsToExistingStudents',batchController.assignUniqueIdsToExistingStudents);

router.post('/saveReview',verifyToken,reviewController.saveReview)

router.get('/getAllReviews',verifyToken,reviewController.getAllReviews)

router.post('/executeJavaCodeHandler',verifyToken,assignmentController.executeJavaCodeHandler)

router.post('/executeJavaCodeHandlerFree',verifyToken,assignmentController.executeJavaCodeHandlerFree)

router.post('/executeJavaCodeHandler2',assignmentController.executeJavaCodeHandler2)

router.post('/saveQuestion',verifyToken,uploadQuestionImage.single('image'),assignmentController.saveQuestion)

router.put('/updateQuestion',verifyToken,uploadQuestionImage.single('image'),assignmentController.updateQuestion)

router.post('/uploadQuestionImage',verifyToken,uploadQuestionImage.single('image'),assignmentController.uploadQuestionImage)

router.post('/getQuestionImage',verifyToken,assignmentController.getQuestionImage)

router.delete('/deleteQuestion',verifyToken,assignmentController.deleteQuestion)

router.post('/saveTestcases',verifyToken,assignmentController.saveTestcases)

router.post('/saveStudentSubmission',verifyToken,assignmentController.saveStudentSubmission)

router.post('/getQuestionsByBatchId',verifyToken,assignmentController.getQuestionsByBatchId)

router.post('/getQuestionById',verifyToken,assignmentController.getQuestionById)

router.post('/getStudentSubmissions',verifyToken,assignmentController.getStudentSubmissions)

router.post('/getStudentSubmissionsByBatchId',verifyToken,assignmentController.getStudentSubmissionsByBatchId)

router.post('/getStudentSubmissionsByStudentId',verifyToken,assignmentController.getStudentSubmissionsByStudentId)

router.post('/saveStudentMarks',verifyToken,assignmentController.saveStudentMarks)

router.post('/getSResults',verifyToken,assignmentController.getSResults);

router.post('/saveCollegeDetails',verifyToken,collegeController.saveCollegeDetails);

router.post('/assignPlacementOfficerToCollege',verifyToken,collegeController.assignPlacementOfficerToCollege);

router.get('/getAllCollegeDetails',verifyToken,collegeController.getAllCollegeDetails);

router.post('/assignStudentsToColleges',verifyToken,upload.single('file'),collegeController.assignStudentsToColleges);

router.post('/deleteCollegeDetails',verifyToken,collegeController.deleteCollegeDetails);

router.post('/updateCollegeDetails',verifyToken,collegeController.updateCollegeDetails);

router.post('/getAllStudentsByCollegeId',verifyToken,collegeController.getAllStudentsByCollegeId);

router.post('/deassignPlacementOfficerFromCollege',verifyToken,collegeController.deassignPlacementOfficerFromCollege);

router.get('/getAllCollegeDetailsForPlacemmentOfficer',verifyToken,collegeController.getAllCollegeDetailsForPlacemmentOfficer);

router.get('/getReviewsByStudentId/:studentId', verifyToken, reviewController.getReviewsByStudentId);

router.post('/saveAttendance', verifyToken, attendanceController.saveAttendance);

router.post('/getAttendanceByDate/:date', verifyToken, attendanceController.getAttendanceByDate);

router.get('/getAllAttendance', verifyToken, attendanceController.getAllAttendance);

router.post('/getAttendanceByYearAndMonth/:year/:month', attendanceController.getAttendanceByYearAndMonth);

router.post('/saveOrUpdateHomeContent', verifyToken, homeContentController.saveOrUpdateHomeContent);

router.get('/fetchHomeContent', homeContentController.fetchHomeContent);

router.post('/saveOrUpdateBestPerformer', verifyToken, homeContentController.saveOrUpdateBestPerformer);

router.get('/getBestPerformersByDate',  homeContentController.getBestPerformersByDate);

router.get('/nameSuggestions',  homeContentController.getStudentNameSuggestions)

router.post('/getStudentSubmissionByQuestion', verifyToken, assignmentController.getStudentSubmissionByQuestion)

module.exports = router;