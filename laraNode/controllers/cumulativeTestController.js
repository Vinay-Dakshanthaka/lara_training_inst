const db = require('../models')
const jwt = require('jsonwebtoken')
const multer = require('multer');
const { Sequelize } = require('sequelize');
const xlsx = require('xlsx');
const fs = require('fs');

const Subject = db.Subject;
const CumulativeQuestion = db.CumulativeQuestion;
const Topic = db.Topic;
const Student = db.Student;
const TestResults = db.TestResults;
const Option = db.Option;
const CorrectAnswer = db.CorrectAnswer;


const saveSubject = async (req, res) => {
    try {
        const studentId = req.studentId;
        const user = await Student.findByPk(studentId);
        const userRole = user.role;

        // Check if the user role is authorized
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN' && userRole !== 'TRAINER' && userRole !== 'RECRUITER') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Trim and retrieve subject_name from request body
        const subject_name = req.body.subject_name.trim();

        // Check if subject_name already exists in the database
        let subject = await Subject.findOne({ where: { name: subject_name } });

        if (subject) {
            // If subject exists, return appropriate message and status code
            return res.status(400).json({ error: 'Subject already exists' });
        } else {
            // If subject does not exist, create a new subject
            subject = await Subject.create({ name: subject_name });
            return res.status(200).send(subject);
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}


const updateSubject = async (req, res) => {
    try {
        // Fetch the user's role from the database using the user's ID
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role

        // Check if the user role is either "ADMIN" or "SUPER ADMIN" or "TRAINER"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN' && userRole !== 'TRAINER' && userRole !== 'RECRUITER') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Retrieve and trim the subject_name from the request body
        const { subject_id, subject_name } = req.body;
        const trimmedName = subject_name.trim();

        // Find the subject by ID
        let subject = await Subject.findByPk(subject_id);

        // If subject not found, return 404
        if (!subject) {
            return res.status(404).json({ error: 'No Subject found' });
        }

        // Check if the new subject name already exists in the database
        let existingSubject = await Subject.findOne({ where: { name: trimmedName } });

        // If a different subject with the same name exists, return an error
        if (existingSubject && existingSubject.id !== subject_id) {
            return res.status(400).json({ error: 'Subject name already exists' });
        }

        // Update the subject name
        subject.name = trimmedName;

        // Save the updated subject
        await subject.save();

        // Return the updated subject
        res.status(200).send(subject);

    } catch (error) {
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


const saveTopic = async (req, res) => {
    try {
        // Fetch the user's role from the database using the user's ID
        const studentId = req.studentId;
        const user = await Student.findByPk(studentId);
        const userRole = user.role;

        // Check if the user role is either "ADMIN", "SUPER ADMIN", or "TRAINER"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN' && userRole !== 'TRAINER' && userRole !== 'RECRUITER') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Retrieve and trim topic_name and subject_id from the request body
        const { topic_name, subject_id } = req.body;
        const trimmedTopicName = topic_name.trim();

        // Check if the subject_id exists
        const subject = await Subject.findByPk(subject_id);
        if (!subject) {
            return res.status(400).send({ message: "Subject not found." });
        }

        // Check if the topic already exists for the given subject_id
        let topic = await Topic.findOne({ where: { name: trimmedTopicName, subject_id } });
        if (topic) {
            return res.status(400).json({ error: 'Topic already exists for this subject.' });
        }

        // Create new topic if it doesn't exist
        topic = await Topic.create({ name: trimmedTopicName, subject_id });

        res.status(200).send(topic);
    } catch (error) {
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
        console.log("role :" + userRole);

        // Check if the user role is either "ADMIN", "SUPER ADMIN", or "TRAINER"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN' && userRole !== 'TRAINER' && userRole !== 'RECRUITER') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Ensure both topic_id and topic_name are provided
        if (!topic_id || !topic_name) {
            return res.status(400).send({ message: "Both topic_id and topic_name are required." });
        }

        // Fetch the topic by ID
        let topic = await Topic.findByPk(topic_id);

        // If topic not found, return 404
        if (!topic) {
            return res.status(404).send({ message: `No topic found with id ${topic_id}` });
        }

        // Trim the topic_name
        const trimmedTopicName = topic_name.trim();

        // Check if another topic with the same name exists under the same subject
        let existingTopic = await Topic.findOne({ where: { name: trimmedTopicName, subject_id: topic.subject_id } });

        // If a different topic with the same name exists, return an error
        if (existingTopic && existingTopic.id !== topic_id) {
            return res.status(400).json({ error: 'Topic name already exists for this subject.' });
        }

        // Update the topic name
        topic.name = trimmedTopicName;
        await topic.save();

        res.status(200).send({
            message: "Update Success!",
            topic: topic
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
         if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN' && userRole !== 'TRAINER' && userRole !== 'RECRUITER') {
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

// const getQuestionsByTopicIds = async (req, res) => {
//     try {
//         // Get topic_ids and number of questions from the request body
//         const { topic_ids, numberOfQuestions } = req.body;
//         console.log("topic ids ", topic_ids, "number of questions", numberOfQuestions);

//         if (!topic_ids || topic_ids.length === 0 || !numberOfQuestions) {
//             return res.status(400).send({ message: "Invalid input data" });
//         }

//         // Calculate the number of questions per topic
//         const questionsPerTopic = Math.floor(numberOfQuestions / topic_ids.length);
//         const remainderQuestions = numberOfQuestions % topic_ids.length;

//         let allQuestions = [];

//         for (let i = 0; i < topic_ids.length; i++) {
//             const topicId = topic_ids[i];
//             let questionsToFetch = questionsPerTopic;

//             // Distribute remainder questions
//             if (i < remainderQuestions) {
//                 questionsToFetch += 1;
//             }

//             const questions = await CumulativeQuestion.findAll({
//                 where: { topic_id: topicId },
//                 limit: questionsToFetch,
//                 order: Sequelize.literal('RAND()') // Fetch random questions
//             });

//             allQuestions = allQuestions.concat(questions);
//         }

//         if (allQuestions.length > 0) {
//             res.status(200).json(allQuestions);
//         } else {
//             res.status(404).send({ message: "Questions not found" });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({ message: error.message });
//     }
// };

const getQuestionsByTopicIds = async (req, res) => {
    try {
        const { topic_ids, numberOfQuestions } = req.body;
        console.log("topic ids ", topic_ids, "number of questions", numberOfQuestions);

        if (!topic_ids || topic_ids.length === 0 || !numberOfQuestions) {
            return res.status(400).send({ message: "Invalid input data" });
        }

        const questionsPerTopic = Math.floor(numberOfQuestions / topic_ids.length);
        const remainderQuestions = numberOfQuestions % topic_ids.length;

        let allQuestions = [];

        for (let i = 0; i < topic_ids.length; i++) {
            const topicId = topic_ids[i];
            let questionsToFetch = questionsPerTopic;

            if (i < remainderQuestions) {
                questionsToFetch += 1;
            }

            const questions = await CumulativeQuestion.findAll({
                where: { topic_id: topicId },
                limit: questionsToFetch,
                order: Sequelize.literal('RAND()'),
                include: [
                    {
                        model: Option,
                        as: 'QuestionOptions',
                        attributes: ['option_id', 'option_description']
                    },
                    {
                        model: CorrectAnswer,
                        as: 'CorrectAnswers',
                        attributes: ['correct_answer_id', 'answer_description']
                    }
                ]
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
 
const fetchQuestionsByTestId = async (req, res) => {
    try {
        const { placement_test_id } = req.body;
        console.log("Placement Test ID:", placement_test_id);

        if (!placement_test_id) {
            return res.status(400).send({ message: "Placement Test ID is required" });
        }

        // Fetch the number of questions from the PlacementTest table
        const placementTest = await db.PlacementTest.findByPk(placement_test_id, {
            attributes: ['number_of_questions']
        });

        if (!placementTest) {
            return res.status(404).send({ message: "Placement test not found" });
        }

        const numberOfQuestions = placementTest.number_of_questions;

        // Fetch cumulative_question_ids from CumulativeQuestionPlacementTest table
        const questionPlacements = await db.CumulativeQuestionPlacementTest.findAll({
            where: { placement_test_id },
            attributes: ['cumulative_question_id']
        });

        if (!questionPlacements.length) {
            return res.status(404).send({ message: "No questions found for this test" });
        }

        const questionIds = questionPlacements.map(q => q.cumulative_question_id);

        // Shuffle the question IDs and limit to the number of questions specified in the placement test
        const shuffledQuestionIds = questionIds.sort(() => 0.5 - Math.random());
        const limitedQuestionIds = shuffledQuestionIds.slice(0, Math.min(numberOfQuestions, questionIds.length));

        // Fetch questions based on the shuffled and limited question IDs
        const questions = await CumulativeQuestion.findAll({
            where: { cumulative_question_id: limitedQuestionIds },
            include: [
                {
                    model: Option,
                    as: 'QuestionOptions',
                    attributes: ['option_id', 'option_description']
                },
                {
                    model: CorrectAnswer,
                    as: 'CorrectAnswers',
                    attributes: ['correct_answer_id', 'answer_description']
                }
            ]
        });

        if (questions.length > 0) {
            res.status(200).json(questions);
        } else {
            res.status(404).send({ message: "No questions found for the given test ID" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};


// const getPracticeQuestionsByTopicIds = async (req, res) => {
//     try {
//         const { topic_ids, numberOfQuestions } = req.body;
//         if (!topic_ids || topic_ids.length === 0 || !numberOfQuestions) {
//             return res.status(400).send({ message: "Invalid input data" });
//         }

//         const questionsPerTopic = Math.floor(numberOfQuestions / topic_ids.length);
//         const remainderQuestions = numberOfQuestions % topic_ids.length;

//         let allQuestions = [];

//         for (let i = 0; i < topic_ids.length; i++) {
//             const topicId = topic_ids[i];
//             let questionsToFetch = questionsPerTopic;

//             if (i < remainderQuestions) {
//                 questionsToFetch += 1;
//             }

//             const questions = await CumulativeQuestion.findAll({
//                 where: { topic_id: topicId, test_id: null }, // test_id will be set as null for practice questions
//                 limit: questionsToFetch,
//                 order: Sequelize.literal('RAND()'),
//                 include: [
//                     {
//                         model: Option,
//                         as: 'QuestionOptions',
//                         attributes: ['option_id', 'option_description']
//                     },
//                     {
//                         model: CorrectAnswer,
//                         as: 'CorrectAnswers',
//                         attributes: ['correct_answer_id', 'answer_description']
//                     }
//                 ]
//             });

//             allQuestions = allQuestions.concat(questions);
//         }

//         if (allQuestions.length > 0) {
//             res.status(200).json(allQuestions);
//         } else {
//             res.status(404).send({ message: "Questions not found" });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({ message: error.message });
//     }
// };

// const updateQuestionById = async (req, res) => {
//     try {
//         const { cumulative_question_id, question_description, options, correct_answers } = req.body;
//         console.log("correct anwers ", correct_answers)
//         if (!cumulative_question_id) {
//             return res.status(400).send({ message: "Cumulative Question ID is required" });
//         }

//         // Find the question by ID
//         const question = await db.CumulativeQuestion.findByPk(cumulative_question_id);

//         if (!question) {
//             return res.status(404).send({ message: "Question not found" });
//         }

//         // Update the question description
//         question.question_description = question_description || question.question_description;
//         await question.save();

//         // Update options
//         if (options && options.length) {
//             // Delete existing options
//             await db.Option.destroy({
//                 where: { cumulative_question_id }
//             });

//             // Add new options
//             for (let option of options) {
//                 await db.Option.create({
//                     cumulative_question_id,
//                     option_description: option.option_description
//                 });
//             }
//         }

//         // Update correct answers
//      // Update correct answers
// // Update correct answers
// if (correct_answers && correct_answers.length) {
//     // Delete existing correct answers
//     await db.CorrectAnswer.destroy({
//         where: { cumulative_question_id }
//     });

//     // Filter out null or empty values
//     const validCorrectAnswers = correct_answers.filter(answer => answer);

//     // Add new correct answers
//     for (let answer of validCorrectAnswers) {
//         try {
//             await db.CorrectAnswer.create({
//                 cumulative_question_id,
//                 answer_description: answer // Ensure this is a valid string
//             });
//         } catch (error) {
//             console.error("Error creating correct answer:", error);
//             // Handle the error appropriately (logging, throwing, etc.)
//         }
        
//     }
// }



//         res.status(200).send({ message: "Question updated successfully" });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({ message: error.message });
//     }
// };

const getPracticeQuestionsByTopicIds = async (req, res) => {
    try {
        const { topic_ids, numberOfQuestions } = req.body;
        if (!topic_ids || topic_ids.length === 0 || !numberOfQuestions) {
            return res.status(400).send({ message: "Invalid input data" });
        }

        let allAvailableQuestions = [];
        const topicQuestionsMap = {};
        let totalQuestionsAvailable = 0;

        // Step 1: Fetch available questions for each topic
        for (const topicId of topic_ids) {
            const questions = await CumulativeQuestion.findAll({
                where: { topic_id: topicId, test_id: null },
                include: [
                    {
                        model: Option,
                        as: 'QuestionOptions',
                        attributes: ['option_id', 'option_description']
                    },
                    {
                        model: CorrectAnswer,
                        as: 'CorrectAnswers',
                        attributes: ['correct_answer_id', 'answer_description']
                    }
                ]
            });

            topicQuestionsMap[topicId] = questions;
            allAvailableQuestions = allAvailableQuestions.concat(questions);
            totalQuestionsAvailable += questions.length;

            // Log how many questions were fetched for each topic
            console.log(`Topic ID: ${topicId}, Questions Fetched: ${questions.length}`);
        }

        // Log total number of available questions across all topics
        console.log(`Total Questions Available: ${totalQuestionsAvailable}`);

        // Step 2: Check if total available questions are less than requested
        if (allAvailableQuestions.length <= numberOfQuestions) {
            // Return all available questions if they're less than or equal to the requested amount
            const randomQuestions = allAvailableQuestions.sort(() => 0.5 - Math.random());
            console.log(`Returning ${randomQuestions.length} questions as total available questions are less than or equal to the requested amount`);
            return res.status(200).json(randomQuestions);
        }

        // Step 3: Distribute questions equally across topics
        const questionsPerTopic = Math.floor(numberOfQuestions / topic_ids.length);
        const remainderQuestions = numberOfQuestions % topic_ids.length;

        let selectedQuestions = [];
        let remainingQuestionsNeeded = numberOfQuestions;

        // Step 4: Fetch questions topic by topic, and compensate if one topic has fewer questions
        for (let i = 0; i < topic_ids.length && remainingQuestionsNeeded > 0; i++) {
            const topicId = topic_ids[i];
            let questionsToFetch = questionsPerTopic;

            if (i < remainderQuestions) {
                questionsToFetch += 1;
            }

            // Fetch questions from the current topic
            const topicQuestions = topicQuestionsMap[topicId] || [];
            const randomQuestionsFromTopic = topicQuestions.sort(() => 0.5 - Math.random()).slice(0, questionsToFetch);

            selectedQuestions = selectedQuestions.concat(randomQuestionsFromTopic);
            remainingQuestionsNeeded -= randomQuestionsFromTopic.length;

            // Log how many questions were fetched for each topic during selection
            console.log(`Topic ID: ${topicId}, Random Questions Fetched: ${randomQuestionsFromTopic.length}`);
        }

        // If after distributing, still some questions are needed
        if (remainingQuestionsNeeded > 0) {
            // Get extra questions from any available topic
            const extraQuestions = allAvailableQuestions.filter(
                (question) => !selectedQuestions.includes(question)
            ).sort(() => 0.5 - Math.random()).slice(0, remainingQuestionsNeeded);

            selectedQuestions = selectedQuestions.concat(extraQuestions);

            // Log how many extra questions were fetched
            console.log(`Extra Questions Fetched: ${extraQuestions.length}`);
        }

        // Step 5: Log the total number of questions being returned
        console.log(`Total Questions Returned: ${selectedQuestions.length}`);

        // Step 6: Return the selected questions
        res.status(200).json(selectedQuestions);

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};



const updateQuestionById = async (req, res) => {
    try {
        const { cumulative_question_id, question_description, options, correct_answers } = req.body;

        if (!cumulative_question_id) {
            return res.status(400).send({ message: "Cumulative Question ID is required" });
        }

        // Find the question by ID
        const question = await db.CumulativeQuestion.findByPk(cumulative_question_id);

        if (!question) {
            return res.status(404).send({ message: "Question not found" });
        }

        // Update the question description
        question.question_description = question_description || question.question_description;
        await question.save();

        // Update options
        if (options && options.length) {
            // Delete existing options
            await db.Option.destroy({
                where: { cumulative_question_id }
            });

            // Add new options
            for (let option of options) {
                await db.Option.create({
                    cumulative_question_id,
                    option_description: option.option_description
                });
            }
        }

        // Filter correct answers to keep only those that match the available options
        const validCorrectAnswers = correct_answers.filter(answer => 
            options.some(option => option.option_description === answer)
        );

        // Update correct answers
        if (validCorrectAnswers && validCorrectAnswers.length) {
            // Delete existing correct answers
            await db.CorrectAnswer.destroy({
                where: { cumulative_question_id }
            });

            // Add new valid correct answers
            for (let answer of validCorrectAnswers) {
                await db.CorrectAnswer.create({
                    cumulative_question_id,
                    answer_description: answer
                });
            }
        }

        res.status(200).send({ message: "Question updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};


const deleteQuestionById = async (req, res) => {
    try {
        const { cumulative_question_id } = req.params;

        if (!cumulative_question_id) {
            return res.status(400).send({ message: "Cumulative Question ID is required" });
        }

        // Find the question by ID
        const question = await db.CumulativeQuestion.findByPk(cumulative_question_id);

        if (!question) {
            return res.status(404).send({ message: "Question not found" });
        }

        // Delete the question, its options, and correct answers
        await db.CorrectAnswer.destroy({
            where: { cumulative_question_id }
        });

        await db.Option.destroy({
            where: { cumulative_question_id }
        });

        await question.destroy();

        res.status(200).send({ message: "Question deleted successfully" });
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

// const addQuestion = async (req, res) => {
//     try {
//         // Extract required fields from the request body
//         const { topic_id, question_description, no_of_marks_allocated, difficulty_level, option_1, option_2, option_3, option_4, correct_option } = req.body;

//         // Create the cumulative question
//         const newQuestion = await CumulativeQuestion.create({
//             topic_id,
//             question_description,
//             no_of_marks_allocated,
//             difficulty_level,
//             option_1,
//             option_2,
//             option_3,
//             option_4,
//             correct_option
//         });

//         return res.status(201).send(newQuestion);
//     } catch (error) {
//         console.error('Error saving question:', error);
//         return res.status(500).send({ message: 'Failed to save question', error: error.message });
//     }
// };

// const addQuestion = async (req, res) => {
//     try {
//         // Extract required fields from the request body
//         const { topic_id, question_description, no_of_marks_allocated, difficulty_level, options, correct_options } = req.body;

//         // Create the cumulative question
//         const newQuestion = await CumulativeQuestion.create({
//             topic_id,
//             question_description,
//             no_of_marks_allocated,
//             difficulty_level,
//         });

//         // Extract the question ID
//         const questionId = newQuestion.cumulative_question_id;

//         // Create the options
//         const optionList = options.map((optionDescription) => ({
//             cumulative_question_id: questionId,
//             option_description: optionDescription.trim()
//         }));
        
//         await Option.bulkCreate(optionList);

//         // Create the correct answers
//         const correctOptionList = correct_options.map((correctOption) => ({
//             cumulative_question_id: questionId,
//             answer_description: correctOption.trim()
//         }));

//         await CorrectAnswer.bulkCreate(correctOptionList);

//         // Send the response with the newly created question details
//         return res.status(201).send({
//             message: 'Question created successfully',
//             question: newQuestion
//         });
//     } catch (error) {
//         console.error('Error saving question:', error);
//         return res.status(500).send({ message: 'Failed to save question', error: error.message });
//     }
// };

const addQuestion = async (req, res) => {
    try {
        // Extract required fields from the request body
        const { topic_id, question_description, no_of_marks_allocated, difficulty_level, options, correct_options, test_id } = req.body;

        // Create the cumulative question with an optional test_id
        const newQuestion = await CumulativeQuestion.create({
            topic_id,
            question_description,
            no_of_marks_allocated,
            difficulty_level,
        });

        // Extract the question ID
        const questionId = newQuestion.cumulative_question_id;

        // Create the options
        const optionList = options.map((optionDescription) => ({
            cumulative_question_id: questionId,
            option_description: optionDescription.trim()
        }));
        
        await Option.bulkCreate(optionList);

        // Create the correct answers
        const correctOptionList = correct_options.map((correctOption) => ({
            cumulative_question_id: questionId,
            answer_description: correctOption.trim()
        }));

        await CorrectAnswer.bulkCreate(correctOptionList);

        // Send the response with the newly created question details
        return res.status(201).send({
            message: 'Question created successfully',
            question: newQuestion
        });
    } catch (error) {
        console.error('Error saving question:', error);
        return res.status(500).send({ message: 'Failed to save question', error: error.message });
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

// const processExcel = async (filePath, topic_id) => {
//     const workbook = xlsx.readFile(filePath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rows = xlsx.utils.sheet_to_json(sheet);

//     const cleanString = (value) => (value != null ? String(value).trim().replace(/\s+/g, ' ') : '');

//     for (const row of rows) {
//         const [
//             questionText,
//             difficulty,
//             marks,
//             option1,
//             option2,
//             option3,
//             option4,
//             correctOptionValue
//         ] = [
//             cleanString(row["Question Text"]),
//             cleanString(row.Difficulty),
//             cleanString(row.Marks),
//             cleanString(row["Option 1"]),
//             cleanString(row["Option 2"]),
//             cleanString(row["Option 3"]),
//             cleanString(row["Option 4"]),
//             cleanString(row["Correct Option"])
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
//             correct_option: correctOptionValue
//         });
//     }
// };

// const processExcel = async (filePath, topic_id) => {
//     const workbook = xlsx.readFile(filePath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rows = xlsx.utils.sheet_to_json(sheet);

//     const cleanString = (value) => (value != null ? String(value).trim().replace(/\s+/g, ' ') : '');

//     for (const row of rows) {
//         const [
//             questionText,
//             difficulty,
//             marks,
//             option1,
//             option2,
//             option3,
//             option4,
//             correctOptionValue
//         ] = [
//             cleanString(row["Question Text"]),
//             cleanString(row.Difficulty),
//             cleanString(row.Marks),
//             cleanString(row["Option 1"]),
//             cleanString(row["Option 2"]),
//             cleanString(row["Option 3"]),
//             cleanString(row["Option 4"]),
//             cleanString(row["Correct Option"])
//         ];

//         // Create the cumulative question
//         const question = await CumulativeQuestion.create({
//             question_description: questionText,
//             topic_id: topic_id,
//             difficulty_level: difficulty,
//             no_of_marks_allocated: marks,
//         });

//         // Extracting the question ID
//         const questionId = question.cumulative_question_id;

//         // Creating the options
//         const options = [option1, option2, option3, option4];
//         for (const optionText of options) {
//             if (optionText) {
//                 await Option.create({
//                     cumulative_question_id: questionId,
//                     option_description: optionText
//                 });
//             }
//         }

//         // Creating the correct answers
//         const correctOptions = correctOptionValue.split(',').map(opt => opt.trim());
//         for (const correctOption of correctOptions) {
//             if (correctOption) {
//                 await CorrectAnswer.create({
//                     cumulative_question_id: questionId,
//                     answer_description: correctOption
//                 });
//             }
//         }
//     }
// }; 

const processExcel = async (filePath, topic_id, test_id = null) => {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    // Function to preserve text formatting (including line breaks and spaces)
    const preserveStringFormat = (value) => (value != null ? String(value) : '');

    // Function to clean other fields (removes excessive spaces but keeps valid ones)
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
            preserveStringFormat(row["Question Text"]), // Preserve original format (including line breaks)
            cleanString(row.Difficulty), // Clean extra spaces for difficulty
            cleanString(row.Marks), // Clean extra spaces for marks
            cleanString(row["Option 1"]),
            cleanString(row["Option 2"]),
            cleanString(row["Option 3"]),
            cleanString(row["Option 4"]),
            cleanString(row["Correct Option"])
        ];

        // Create the cumulative question with an optional test_id
        // const question = await CumulativeQuestion.create({
        //     question_description: questionText, // Preserve original formatting
        //     topic_id: topic_id,
        //     difficulty_level: difficulty,
        //     no_of_marks_allocated: marks,
        //     test_id // This will be null for practice questions
        // });

        const question = await CumulativeQuestion.create({
            question_description: JSON.stringify(questionText), // Store as JSON
            topic_id: topic_id,
            difficulty_level: difficulty,
            no_of_marks_allocated: marks,
            test_id // This will be null for practice questions
          });

        // Extract the question ID
        const questionId = question.cumulative_question_id;

        // Create the options
        const options = [option1, option2, option3, option4];
        for (const optionText of options) {
            if (optionText) {
                await Option.create({
                    cumulative_question_id: questionId,
                    option_description: optionText
                });
            }
        }

        // Create the correct answers
        const correctOptions = correctOptionValue.split(',').map(opt => opt.trim());
        for (const correctOption of correctOptions) {
            if (correctOption) {
                await CorrectAnswer.create({
                    cumulative_question_id: questionId,
                    answer_description: correctOption
                });
            }
        }
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
    updateQuestionById,
    deleteQuestionById,
    getPracticeQuestionsByTopicIds,
    getQuestionCountsByTopicIds,
    saveTestResults,
    getTestResultsByTestId,
    getTestResultsByStudentId,
    addQuestion,
    fetchQuestionsByTestId,
}