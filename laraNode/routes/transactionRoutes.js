const express = require('express');
const transcationrouter = express.Router();
const multer = require('multer');
const {saveTransaction } = require('../controllers/transactionController'); 
const transcationcontroller = require('../controllers/transactionController')
 // Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

transcationrouter.post('/save', upload.single('transactionslip_img'), saveTransaction);
transcationrouter.get('/get', transcationcontroller.getAllTransactions);

module.exports = transcationrouter;
