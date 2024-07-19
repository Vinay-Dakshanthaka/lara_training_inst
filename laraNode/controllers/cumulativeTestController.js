const db = require('../models')
const jwt = require('jsonwebtoken')
const multer = require('multer');
const { Sequelize } = require('sequelize');
const xlsx = require('xlsx');

const Subject = db.Subject;
const CumulativeQuestion = db.CumulativeQuestion;
const Topic = db.Topic;
const Student = db.Student;
const TestResults = db.TestResults;


const saveSubject = async (req, res)=>{
    try{

        // Fetch the user's role from the database using the user's ID
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role
        console.log("role :"+userRole)
        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN' && userRole !== 'TRAINER') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

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

         // Fetch the user's role from the database using the user's ID
         const studentId = req.studentId; 
         const user = await Student.findByPk(studentId); // Fetch user from database
         const userRole = user.role; // Get the user's role
         console.log("role :"+userRole)
         // Check if the user role is either "ADMIN" or "SUPER ADMIN"
         if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN' && userRole !== 'TRAINER') {
             return res.status(403).json({ error: 'Access forbidden' });
         }

        const {subject_id,subject_name} = req.body

        let subject = await Subject.findByPk(subject_id);

        if (!subject) {
            return res.status(404).json({ error: 'No Subject found' });
        }

        // update the subject 
        subject.name = subject_name;

        await subject.save(subject)

        res.status(200).send(subject);

    }catch(error){
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

const deleteSubject = async (req, res)=>{
    try{

        //  // Fetch the user's role from the database using the user's ID
        //  const studentId = req.studentId; 
        //  const user = await Student.findByPk(studentId); // Fetch user from database
        //  const userRole = user.role; // Get the user's role
        //  console.log("role :"+userRole)
        //  // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        //  if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN' && userRole !== 'TRAINER') {
        //      return res.status(403).json({ error: 'Access forbidden' });
        //  }

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

         // Fetch the user's role from the database using the user's ID
         const studentId = req.studentId; 
         const user = await Student.findByPk(studentId); // Fetch user from database
         const userRole = user.role; // Get the user's role
         console.log("role :"+userRole)
         // Check if the user role is either "ADMIN" or "SUPER ADMIN"
         if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN' && userRole !== 'TRAINER') {
             return res.status(403).json({ error: 'Access forbidden' });
         }

        const {topic_name,subject_id} = req.body
         console.log(" topic name ", topic_name, " : subject id ", subject_id)
         // Check if the subject_id exists
         const subject = await Subject.findByPk(subject_id);
         if (!subject) {
             return res.status(400).send({ message: "Subject not found." });
         }

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

         // Fetch the user's role from the database using the user's ID
         const studentId = req.studentId; 
         const user = await Student.findByPk(studentId); // Fetch user from database
         const userRole = user.role; // Get the user's role
         console.log("role :"+userRole)
         // Check if the user role is either "ADMIN" or "SUPER ADMIN"
         if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN' && userRole !== 'TRAINER') {
             return res.status(403).json({ error: 'Access forbidden' });
         }

        if (!topic_id || !topic_name) {
            return res.status(400).send({ message: "Both topic_id and topic_name are required." });
        }

        let topic = await Topic.findByPk(topic_id);

        if (!topic) {
            return res.status(404).send({ message: `No topic found with id ${topic_id}` });
        }

        topic.name = topic_name;
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

         // Fetch the user's role from the database using the user's ID
         const studentId = req.studentId; 
         const user = await Student.findByPk(studentId); // Fetch user from database
         const userRole = user.role; // Get the user's role
         console.log("role :"+userRole)
         // Check if the user role is either "ADMIN" or "SUPER ADMIN"
         if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN' && userRole !== 'TRAINER') {
             return res.status(403).json({ error: 'Access forbidden' });
         }

        const {topic_id} = req.body

        let topic = await Topic.findByPk(topic_id);

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

const getAllSubjects = async (req, res) => {
    try {
        // Fetch all subjects from the database
        const subjects = await Subject.findAll();

        res.status(200).json(subjects);

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

const getSubjectById = async (req, res) => {
    try {
        // Get subject_id from query parameters
        const { subject_id } = req.query;
        console.log("subject id ", subject_id)

        // Fetch the subject from the database by its id
        const subject = await Subject.findByPk(subject_id);
        
        if (subject) {
            console.log("subject found", subject)
            res.status(200).json(subject);
        } else {
            res.status(404).send({ message: "Subject not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

const getTopicsBySubjectId = async (req, res) => {
    try {
        // Get subject_id from query parameters
        const { subject_id } = req.query;
        console.log("subject id ", subject_id)

        // Fetch the topics from the database by subject_id
        const topics = await Topic.findAll({ where: { subject_id } });
        
        if (topics.length > 0) {
            console.log("topics found", topics)
            res.status(200).json(topics);
        } else {
            res.status(404).send({ message: "No topics found for the given subject ID" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}


const getTopicById = async (req, res) => {
    try {
        // Get subject_id from query parameters
        const { topic_id } = req.query;
        console.log("topic id ", topic_id)

        // Fetch the subject from the database by its id
        const topic = await Topic.findByPk(topic_id);
        
        if (topic) {
            console.log("Topic found", topic)
            res.status(200).json(topic);
        } else {
            res.status(404).send({ message: "Topic not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

const getAllSubjectsAndTopics = async (req, res) => {
    try {
        // Fetch all subjects with their related topics from the database
        const subjects = await Subject.findAll({
            include: [
                {
                    model: Topic,
                    as: 'topics',
                },
            ],
        });

        res.status(200).json(subjects);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

const getQuestionsByTopicIds = async (req, res) => {
    try {
        // Get topic_ids and number of questions from the request body
        const { topic_ids, numberOfQuestions } = req.body;
        console.log("topic ids ", topic_ids, "number of questions", numberOfQuestions);

        if (!topic_ids || topic_ids.length === 0 || !numberOfQuestions) {
            return res.status(400).send({ message: "Invalid input data" });
        }

        // Calculate the number of questions per topic
        const questionsPerTopic = Math.floor(numberOfQuestions / topic_ids.length);
        const remainderQuestions = numberOfQuestions % topic_ids.length;

        let allQuestions = [];

        for (let i = 0; i < topic_ids.length; i++) {
            const topicId = topic_ids[i];
            let questionsToFetch = questionsPerTopic;

            // Distribute remainder questions
            if (i < remainderQuestions) {
                questionsToFetch += 1;
            }

            const questions = await CumulativeQuestion.findAll({
                where: { topic_id: topicId },
                limit: questionsToFetch,
                order: Sequelize.literal('RAND()') // Fetch random questions
            });

            allQuestions = allQuestions.concat(questions);
        }

        if (allQuestions.length > 0) {
            res.status(200).json(allQuestions);
        } else {
            res.status(404).send({ message: "Questions not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};


const getQuestionCountsByTopicIds = async (req, res) => {
    try {
        // Get topic_ids from the request body
        const { topic_ids } = req.body;
        console.log("topic ids ", topic_ids);

        if (!topic_ids || topic_ids.length === 0) {
            return res.status(400).send({ message: "Invalid input data" });
        }

        // Create an array to hold the counts for each topic
        let questionCounts = [];

        for (let topicId of topic_ids) {
            // Count the number of questions for the current topic
            const count = await CumulativeQuestion.count({
                where: { topic_id: topicId }
            });

            questionCounts.push({
                topic_id: topicId,
                question_count: count
            });
        }

        res.status(200).json(questionCounts);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};


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

// const processExcel = async (filePath, topic_id) => {
//     const workbook = xlsx.readFile(filePath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rows = xlsx.utils.sheet_to_json(sheet);

//     for (const row of rows) {
//         const [
//             questionText,
//             difficulty,
//             marks,
//             option1,
//             option2,
//             option3,
//             option4,
//             correctOptionIndex
//         ] = [
//             row["Question Text"],
//             row.Difficulty,
//             row.Marks,
//             row["Option 1"],
//             row["Option 2"],
//             row["Option 3"],
//             row["Option 4"],
//             row["Correct Option"]
//         ];

//         // Create the cumulative question
//         await CumulativeQuestion.create({
//             question_description: questionText,
//             topic_id: topic_id,
//             difficulty_level: difficulty,
//             no_of_marks_allocated: marks,
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

    const cleanString = (value) => (value != null ? String(value).trim().replace(/\s+/g, ' ') : '');

    for (const row of rows) {
        const [
            questionText,
            difficulty,
            marks,
            option1,
            option2,
            option3,
            option4,
            correctOptionValue
        ] = [
            cleanString(row["Question Text"]),
            cleanString(row.Difficulty),
            cleanString(row.Marks),
            cleanString(row["Option 1"]),
            cleanString(row["Option 2"]),
            cleanString(row["Option 3"]),
            cleanString(row["Option 4"]),
            cleanString(row["Correct Option"])
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
            correct_option: correctOptionValue
        });
    }
};

const saveTestResults = async (req, res) => {
    try {
        const studentId = req.studentId; 
        const { total_marks, completed_date_time, obtained_marks, question_ans_data } = req.body;

        // Check if the student exists (optional, depending on your application logic)
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).send({ message: "Student not found" });
        }

        // Save the test result
        const testResult = await TestResults.create({
            total_marks,
            completed_date_time,
            obtained_marks,
            question_ans_data,
            student_id:studentId
        });

        res.status(200).send(testResult);

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

const getTestResultsByTestId = async (req, res) => {
    try {
        // Get test_id from the request body
        const { test_id } = req.body;
        console.log("test id ", test_id);

        if (!test_id) {
            return res.status(400).send({ message: "Invalid input data" });
        }

        // Fetch the test result using the test_id
        const testResult = await TestResults.findOne({
            where: { testResult_id: test_id }
        });

        if (!testResult) {
            return res.status(404).send({ message: "Test result not found" });
        }

        // Extract the question_ans_data column
        const questionAnsData = testResult.question_ans_data;
        console.log("question_ans_data", questionAnsData);

        // Get the cumulative_question_ids from question_ans_data
        const cumulativeQuestionIds = Object.keys(questionAnsData);

        // Fetch the CumulativeQuestion data for all ids
        const cumulativeQuestions = await CumulativeQuestion.findAll({
            where: {
                cumulative_question_id: cumulativeQuestionIds
            }
        });

        // Create a response object with the test result and the related cumulative questions
        const response = {
            testResult_id: test_id,
            test_result: testResult,
            cumulativequestions: cumulativeQuestions
        };

        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

const getTestResultsByStudentId = async (req, res) => {
    try {
        const studentId = req.studentId;

        // Check if the student exists (optional, depending on your application logic)
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).send({ message: "Student not found" });
        }

        // Fetch all test results for the student
        const testResults = await TestResults.findAll({
            where: {
                student_id: studentId
            }
        });

        res.status(200).send(testResults);

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}


module.exports = {
    saveSubject,
    updateSubject,
    deleteSubject,
    saveTopic,
    updateTopic,
    deleteTopic,
    processExcel,
    getAllSubjects,
    getSubjectById,
    getTopicById,
    getTopicsBySubjectId,
    getAllSubjectsAndTopics,
    getQuestionsByTopicIds,
    getQuestionCountsByTopicIds,
    saveTestResults,
    getTestResultsByTestId,
    getTestResultsByStudentId,
}