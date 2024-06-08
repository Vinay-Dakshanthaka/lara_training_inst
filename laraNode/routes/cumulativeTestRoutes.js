const express = require('express');
const cumulativeTestRouter = express.Router();
const multer = require('multer');
const verifyToken = require('../middleware/authMiddleware');
const cumulativeTestController = require('../controllers/cumulativeTestController')
const upload = multer({ dest: 'cumulative_questions/' });

cumulativeTestRouter.post('/saveSubject',cumulativeTestController.saveSubject );

cumulativeTestRouter.put('/updateSubject',cumulativeTestController.updateSubject );

cumulativeTestRouter.delete('/deleteSubject',cumulativeTestController.deleteSubject );

cumulativeTestRouter.post('/saveTopic',cumulativeTestController.saveTopic );

cumulativeTestRouter.post('/updateTopic',cumulativeTestController.updateTopic );



// cumulativeTestRouter.post('/upload-questions', upload.single('file'), async (req, res) => {
//     try {
//         await cumulativeTestController.processExcel(req.file.path);
//         res.status(200).send({ message: 'Questions uploaded successfully!' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: error.message });
//     }
// });

cumulativeTestRouter.post('/upload-questions',upload.single('file'), async (req, res) => {
    const topic_id = req.query.topic_id;
    const filePath = req.file.path; 

    if (!topic_id) {
        return res.status(400).send({ message: "topic_id query parameter is required." });
    }

    try {
        await cumulativeTestController.processExcel(filePath, topic_id);
        res.status(200).send({ message: "Excel data processed successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});


module.exports = cumulativeTestRouter