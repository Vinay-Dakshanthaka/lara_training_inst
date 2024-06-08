const db = require('../models')
const jwt = require('jsonwebtoken')
const multer = require('multer');
const xlsx = require('xlsx');

const Subject = db.Subject;
const CumulativeQuestion = db.CumulativeQuestion;
const Topic = db.Topic;


const saveSubject = async (req, res)=>{
    try{

        const {subject_name} = req.body

        let subject = await Subject.findOne({ where: { name: subject_name } });
        if (!subject) {
            subject = await Subject.create({ name: subject_name });
        }

        // const subject = await Subject.create({
        //     subject_name
        // });



        res.status(200).send(subject);

    }catch(error){
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

const updateSubject = async (req, res)=>{
    try{

        const {subject_id,subject_name} = req.body

        let subject = await Subject.findByPk(subject_id);

        if (!subject) {
            return res.status(404).json({ error: 'No Subject found' });
        }

        // update the subject 
        subject.subject_name = subject_name;

        await subject.save(subject)

        res.status(200).send(subject);

    }catch(error){
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

const deleteSubject = async (req, res)=>{
    try{

        const {subject_id} = req.body

        let subject = await Subject.findByPk(subject_id);

        if (!subject) {
            return res.status(404).json({ error: 'No Subject found' });
        }

        await subject.destroy(subject)

        res.status(200).send({message : 'Subject Deleted Successfully!!!'});

    }catch(error){
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}


const saveTopic = async (req, res)=>{
    try{

        const {topic_name,subject_id} = req.body

         // Check if the subject_id exists
         const subject = await Subject.findByPk(subject_id);
         if (!subject) {
             return res.status(400).send({ message: "Subject not found." });
         }

       
        // // Check if topic_names is an array
        // if (!Array.isArray(topic_names)) {
        //     return res.status(400).send({ message: "Topic_names must be an array." });
        // }

        // // Create topics
        // const topics = await Promise.all(
        //     topic_names.map(topic_name => Topic.create({ topic_name, subject_id }))
        // );

         // Ensure the topic exists
         let topic = await Topic.findOne({ where: { name: topic_name, subject_id: subject.subject_id } });
         if (!topic) {
             topic = await Topic.create({ name: topic_name, subject_id: subject.subject_id });
         }

        res.status(200).send(topic);

    }catch(error){
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

const updateTopic = async (req, res) => {
    try {
        const { topic_id, topic_name } = req.body;

        if (!topic_id || !topic_name) {
            return res.status(400).send({ message: "Both topic_id and topic_name are required." });
        }

        let topic = await Topic.findByPk(topic_id);

        if (!topic) {
            return res.status(404).send({ message: `No topic found with id ${topic_id}` });
        }

        topic.topic_name = topic_name;
        await topic.save();

        res.status(200).send({
            message:"Update Success!!",
            topic:topic
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}



const deleteTopic = async (req, res)=>{
    try{

        const {topic_id} = req.body

        let topic = await Subject.findByPk(topic_id);

        if (!topic) {
            return res.status(404).json({ error: 'No Topic found' });
        }

        await topic.destroy(topic)

        res.status(200).send({message : 'Topic Deleted Successfully!!!'});

    }catch(error){
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}


// const processExcel = async (filePath) => {
//     const workbook = xlsx.readFile(filePath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rows = xlsx.utils.sheet_to_json(sheet);

//     for (const row of rows) {
//         const [
//             subjectName,
//             topicName,
//             questionText,
//             difficulty,
//             marks,
//             option1,
//             option2,
//             option3,
//             option4,
//             correctOptionIndex
//         ] = [
//             row.Subject,
//             row.Topic,
//             row["Question Text"],
//             row.Difficulty,
//             row.Marks,
//             row["Option 1"],
//             row["Option 2"],
//             row["Option 3"],
//             row["Option 4"],
//             row["Correct Option"]
//         ];

//         // Ensure the subject exists
//         let subject = await Subject.findOne({ where: { name: subjectName } });
//         if (!subject) {
//             subject = await Subject.create({ name: subjectName });
//         }

//         // Ensure the topic exists
//         let topic = await Topic.findOne({ where: { name: topicName, subject_id: subject.subject_id } });
//         if (!topic) {
//             topic = await Topic.create({ name: topicName, subject_id: subject.subject_id });
//         }

//         // Create the cumulative question
//         await CumulativeQuestion.create({
//             question_description: questionText,
//             topic_id: topic.topic_id,
//             difficulty_level: difficulty,
//             no_of_marks_allocated:marks,
//             option_1: option1,
//             option_2: option2,
//             option_3: option3,
//             option_4: option4,
//             correct_option: correctOptionIndex
//         });
//     }
// };

const processExcel = async (filePath, topic_id) => {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    for (const row of rows) {
        const [
            questionText,
            difficulty,
            marks,
            option1,
            option2,
            option3,
            option4,
            correctOptionIndex
        ] = [
            row["Question Text"],
            row.Difficulty,
            row.Marks,
            row["Option 1"],
            row["Option 2"],
            row["Option 3"],
            row["Option 4"],
            row["Correct Option"]
        ];

        // Create the cumulative question
        await CumulativeQuestion.create({
            question_description: questionText,
            topic_id: topic_id,
            difficulty_level: difficulty,
            no_of_marks_allocated: marks,
            option_1: option1,
            option_2: option2,
            option_3: option3,
            option_4: option4,
            correct_option: correctOptionIndex
        });
    }
};




module.exports = {
    saveSubject,
    updateSubject,
    deleteSubject,
    saveTopic,
    updateTopic,
    deleteTopic,
    processExcel,
}