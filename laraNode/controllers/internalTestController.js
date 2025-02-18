const db = require('../models');
const xlsx = require('xlsx');
const multer = require('multer');
const fs = require('fs');


const {Op, where} = require('sequelize');
const Student = db.Student;
const InternalTest = db.InternalTest;
const InternalTestTopic = db.InternalTestTopic;
const PlacementTestStudent = db.PlacementTestStudent;
const Student_Batch = db.Student_Batch;
const StudentTest = db.StudentTest;
const Topic = db.Topic;
const PlacementTestResult = db.PlacementTestResult;
const CumulativeQuestion = db.CumulativeQuestion;
const CumulativeQuestionPlacementTest = db.CumulativeQuestionPlacementTest;
const CumulativeQuestionInternalTest = db.CumulativeQuestionInternalTest;
const InternalTestResult = db.InternalTestResult;
const OptionsTable = db.Option;
const { baseURL } = require('./baseURLConfig')
const { Batch, BatchTestLinks,  WeeklyTest } = require('../models'); 

const createInternalTestLink = async (req, res) => {
    try {
        const { number_of_questions, show_result, is_active, is_monitored, topic_ids,test_description,test_date } = req.body;

        if (!number_of_questions || !Array.isArray(topic_ids) || topic_ids.length === 0 ) {
            return res.status(400).send({ message: 'Required fields are missing or invalid' });
        }

        // Validate that all provided topic_ids exist in the topics table
        const topics = await Topic.findAll({
            where: {
                topic_id: topic_ids
            }
        });

        if (topics.length !== topic_ids.length) {
            return res.status(400).send({ message: 'One or more topic IDs are invalid' });
        }
      
        // Create a new InternalTest
        const newTest = await InternalTest.create({
            internal_test_link: '', // Initially empty, will be updated later
            number_of_questions,
            test_description,
            test_date,
            show_result: show_result !== undefined ? show_result : true, // Default to true if not provided
            is_active: is_active !== undefined ? is_active : true, // Default to true if not provided
            is_monitored: is_monitored !== undefined ? is_monitored : false // Default to false if not provided
        });

        // Generate the internal test link with the internal_test_id
        const internal_test_link = `${baseURL}/internal-test/${newTest.internal_test_id}`;
        newTest.internal_test_link = internal_test_link;
        await newTest.save();

        // Save the topic IDs in the InternalTestTopic table
        const topicPromises = topic_ids.map(topic_id =>
            InternalTestTopic.create({
                internal_test_id: newTest.internal_test_id,
                topic_id
            })
        );

        await Promise.all(topicPromises);

        // Instead of distributing the questions here, the distribution can be done when fetching the questions
        // This provides more flexibility and avoids having to assign questions right away

        console.log("newly created internal test ", newTest);
        return res.status(200).send({ message: 'Internal test added successfully', newTest });
    } catch (error) {
        console.error('Error creating internal test link:', error.stack);
        return res.status(500).send({ message: error.message });
    }
};

const updateInternalTestLink = async (req, res) => {
    try {
        const { internal_test_id } = req.params; // Assuming the internal_test_id is passed in the URL
        const { number_of_questions, show_result, is_active, is_monitored, topic_ids, test_description } = req.body;

        // Validate if the internal_test_id exists
        const test = await InternalTest.findByPk(internal_test_id);
        if (!test) {
            return res.status(404).send({ message: 'Internal test not found' });
        }

        // Validate that topic_ids is an array if provided
        if (topic_ids && (!Array.isArray(topic_ids) || topic_ids.length === 0)) {
            return res.status(400).send({ message: 'Invalid topic IDs' });
        }

        // If topic_ids are provided, validate they exist in the topics table
        if (topic_ids) {
            const topics = await Topic.findAll({
                where: {
                    topic_id: topic_ids
                }
            });

            if (topics.length !== topic_ids.length) {
                return res.status(400).send({ message: 'One or more topic IDs are invalid' });
            }
        }

        // Update the InternalTest data
        await test.update({
            number_of_questions: number_of_questions !== undefined ? number_of_questions : test.number_of_questions,
            test_description: test_description !== undefined ? test_description : test.test_description,
            show_result: show_result !== undefined ? show_result : test.show_result,
            is_active: is_active !== undefined ? is_active : test.is_active,
            is_monitored: is_monitored !== undefined ? is_monitored : test.is_monitored
        });

        // If topic_ids are provided, update the InternalTestTopic associations
        if (topic_ids) {
            // Remove existing topics related to this test
            await InternalTestTopic.destroy({
                where: {
                    internal_test_id: test.internal_test_id
                }
            });

            // Re-add the updated topics
            const topicPromises = topic_ids.map(topic_id =>
                InternalTestTopic.create({
                    internal_test_id: test.internal_test_id,
                    topic_id
                })
            );

            await Promise.all(topicPromises);
        }

        console.log("updated internal test ", test);
        return res.status(200).send({ message: 'Internal test updated successfully', test });
    } catch (error) {
        console.error('Error updating internal test link:', error.stack);
        return res.status(500).send({ message: error.message });
    }
};

const getAllInternalTests = async (req, res) => {
    try {
        // Fetch all InternalTests including associated topics
        const internalTests = await InternalTest.findAll({
            include: [
                {
                    model: InternalTestTopic,
                    as: 'TestTopics',
                    include: [
                        {
                            model: Topic,
                            as: 'InternalTestTopic' // This alias should match the one defined in your association
                        }
                    ]
                }
            ]
        });

        // Check if there are no internal tests
        if (!internalTests || internalTests.length === 0) {
            return res.status(404).send({ message: 'No internal tests found' });
        }

        // Prepare response data to send back
        const formattedTests = internalTests.map(test => ({
            internal_test_id: test.internal_test_id,
            internal_test_link: test.internal_test_link,
            number_of_questions: test.number_of_questions,
            test_description: test.test_description,
            show_result: test.show_result,
            is_active: test.is_active,
            is_monitored: test.is_monitored,
            created_at: test.createdAt,
            updated_at: test.updatedAt,
            topics: test.TestTopics.map(topicData => ({
                topic_id: topicData.topic_id,
                topic_name: topicData.InternalTestTopic ? topicData.InternalTestTopic.name : null // Access the topic name correctly based on the alias
            }))
        }));

        return res.status(200).send({ message: 'Internal tests fetched successfully', internalTests: formattedTests });
    } catch (error) {
        console.error('Error fetching internal tests:', error.stack);
        return res.status(500).send({ message: error.message });
    }
};

const getInternalTestById = async (req, res) => {
    try {
        const { internal_test_id } = req.params;

        // Fetch the InternalTest by internal_test_id including associated topics
        const internalTest = await InternalTest.findOne({
            where: { internal_test_id },
            include: [
                {
                    model: InternalTestTopic,
                    as: 'TestTopics',
                    include: [
                        {
                            model: Topic,
                            as: 'InternalTestTopic' // Match the alias from the association
                        }
                    ]
                }
            ]
        });

        // Check if the internal test was found
        if (!internalTest) {
            return res.status(404).send({ message: 'Internal test not found' });
        }

        // Prepare response data to send back
        const formattedTest = {
            internal_test_id: internalTest.internal_test_id,
            internal_test_link: internalTest.internal_test_link,
            number_of_questions: internalTest.number_of_questions,
            test_description: internalTest.test_description,
            show_result: internalTest.show_result,
            is_active: internalTest.is_active,
            is_monitored: internalTest.is_monitored,
            created_at: internalTest.createdAt,
            updated_at: internalTest.updatedAt,
            topics: internalTest.TestTopics.map(topicData => ({
                topic_id: topicData.topic_id,
                topic_name: topicData.InternalTestTopic ? topicData.InternalTestTopic.name : null // Access the topic name correctly based on the alias
            }))
        };

        return res.status(200).send({ message: 'Internal test fetched successfully', internalTest: formattedTest });
    } catch (error) {
        console.error('Error fetching internal test by ID:', error.stack);
        return res.status(500).send({ message: error.message });
    }
};

const assignQuestionsToInternalTest = async (req, res) => {
    const { internal_test_id, question_ids } = req.body;

    try {
        // Validate if internal_test_id and question_ids are provided
        if (!internal_test_id || !question_ids || question_ids.length === 0) {
            return res.status(400).send({ message: 'Internal test ID and question IDs are required.' });
        }

        // Check if internal_test_id exists in InternalTest table
        const test = await InternalTest.findByPk(internal_test_id);
        if (!test) {
            return res.status(404).send({ message: `Internal test with ID ${internal_test_id} not found.` });
        }

        // Check which question_ids are already assigned to the internal test
        const existingAssignments = await InternalTestQuestion.findAll({
            where: { internal_test_id: internal_test_id },
            attributes: ['question_id'] // Adjust attribute name if needed
        });

        const assignedQuestionIds = existingAssignments.map(a => a.question_id);

        // Filter out already assigned question_ids
        const newQuestionIds = question_ids.filter(id => !assignedQuestionIds.includes(id));

        if (newQuestionIds.length === 0) {
            return res.status(200).send({ message: 'The selected questions already exist in this internal test.' });
        }

        // Create an array of objects to bulk create entries in InternalTestQuestion
        const assignments = newQuestionIds.map(question_id => ({
            question_id, // Adjust this if the key name is different in the association table
            internal_test_id: internal_test_id
        }));

        // Bulk create entries in the InternalTestQuestion table
        const createdAssignments = await CumulativeQuestion.bulkCreate(assignments);

        return res.status(200).send({
            message: 'Questions assigned to internal test successfully.',
            assignments: createdAssignments
        });
    } catch (error) {
        console.error('Error assigning questions to internal test:', error.stack);
        return res.status(500).send({ message: error.message });
    }
};

const uploadAndAssignQuestionsToLink = async (filePath, topic_id, internal_test_id) => {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    // Preserve line breaks and spaces inside the question text
    const preserveStringFormat = (value) => (value != null ? String(value).trim() : '');

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
            preserveStringFormat(row["Question Text"]),
            preserveStringFormat(row.Difficulty),
            preserveStringFormat(row.Marks),
            preserveStringFormat(row["Option 1"]),
            preserveStringFormat(row["Option 2"]),
            preserveStringFormat(row["Option 3"]),
            preserveStringFormat(row["Option 4"]),
            preserveStringFormat(row["Correct Option"])
        ];

        // Validate and convert marks to an integer
        const noOfMarksAllocated = parseInt(marks, 10);
        if (isNaN(noOfMarksAllocated)) {
            console.warn(`Invalid marks value for question "${questionText}":`, marks);
            continue; // Skip this row if marks are invalid
        }

        // Define options and correct answers
        const options = [option1, option2, option3, option4];
        const correctOptions = correctOptionValue.split(',').map(opt => opt.trim());

        // Call saveQuestionAndAddToInternalTest with an object of the necessary fields
        await saveQuestionAndAddToInternalTest({
            topic_id,
            question_description: questionText, // This will now preserve format
            no_of_marks_allocated: noOfMarksAllocated,
            difficulty_level: difficulty,
            options,
            correct_options: correctOptions,
            internal_test_id // Use internal_test_id instead of placement_test_id
        });
    }
};


const saveQuestionAndAddToInternalTest = async ({
    topic_id,
    question_description,
    no_of_marks_allocated,
    difficulty_level,
    options,
    correct_options,
    internal_test_id
}) => {
    try {
        console.log("Received internal_test_id:", internal_test_id);

        // Create the cumulative question
        const newQuestion = await CumulativeQuestion.create({
            topic_id,
            question_description,
            no_of_marks_allocated,
            difficulty_level,
        });

        const questionId = newQuestion.cumulative_question_id;

        console.log('New question created with ID:', questionId);

        // Create the options
        const optionList = options.map((optionDescription) => ({
            cumulative_question_id: questionId,
            option_description: optionDescription.trim()
        }));

        await OptionsTable.bulkCreate(optionList);
        console.log('Options created for question ID:', questionId);

        // Create the correct answers
        const correctOptionList = correct_options.map((correctOption) => ({
            cumulative_question_id: questionId,
            answer_description: correctOption.trim()
        }));

        await db.CorrectAnswer.bulkCreate(correctOptionList);
        console.log('Correct answers created for question ID:', questionId);

        // Create the association with internal test
        if (internal_test_id) {
            await CumulativeQuestionInternalTest.create({
                cumulative_question_id: questionId,
                internal_test_id
            });
            console.log('Association with internal test created successfully');
        }

        return {
            message: 'Question created and added to internal test successfully',
            question: newQuestion
        };
    } catch (error) {
        console.error('Error saving question and adding to internal test:', error);
        throw new Error('Failed to save question and add to internal test');
    }
};


const saveQuestionAndAddToLinkTopic = async (req, res) => {
    try {
        const { topic_id, question_description, no_of_marks_allocated, difficulty_level, options, correct_options, internal_test_id } = req.body;

        // Log the received internal_test_id
        console.log("Received internal_test_id:", internal_test_id);

        // Create the cumulative question
        const newQuestion = await CumulativeQuestion.create({
            topic_id,
            question_description,
            no_of_marks_allocated,
            difficulty_level,
        });

        const questionId = newQuestion.cumulative_question_id;

        // Log the created question ID
        console.log('New question created with ID:', questionId);

        // Create the options
        const optionList = options.map((optionDescription) => ({
            cumulative_question_id: questionId,
            option_description: optionDescription.trim()
        }));

        await OptionsTable.bulkCreate(optionList);
        console.log('Options created for question ID:', questionId);

        // Create the correct answers
        const correctOptionList = correct_options.map((correctOption) => ({
            cumulative_question_id: questionId,
            answer_description: correctOption.trim()
        }));

        await db.CorrectAnswer.bulkCreate(correctOptionList);
        console.log('Correct answers created for question ID:', questionId);

        // Create the association with internal test if provided
        if (internal_test_id) {
            try {
                const association = await CumulativeQuestionInternalTest.create({
                    cumulative_question_id: questionId,
                    internal_test_id
                });

                if (!association) {
                    console.error('Failed to create association with internal test.');
                } else {
                    console.log('Association with internal test created successfully:', association);
                }
            } catch (assocError) {
                console.error('Error creating association with internal test:', assocError);
            }
        }

        // Send response
        res.status(200).send({
            message: 'Question created and added to internal test successfully',
            question: newQuestion
        });
    } catch (error) {
        console.error('Error saving question and adding to internal test link:', error);
        res.status(500).send({
            message: 'Failed to save question and add to internal test link',
            error: error.message
        });
    }
};

const assignQuestionsToInternalTestLink = async (req, res) => {
    const { internal_test_id, question_ids } = req.body;

    try {
        // Validate if internal_test_id and question_ids are provided
        if (!internal_test_id || !question_ids || question_ids.length === 0) {
            return res.status(400).send({ message: 'Internal test ID and question IDs are required.' });
        }

        // Check if internal_test_id exists in InternalTest table
        const test = await InternalTest.findByPk(internal_test_id);
        if (!test) {
            return res.status(404).send({ message: `Internal test with ID ${internal_test_id} not found.` });
        }

        // Check which question_ids are already assigned to the internal test
        const existingAssignments = await CumulativeQuestionInternalTest.findAll({
            where: { internal_test_id: internal_test_id },
            attributes: ['cumulative_question_id']
        });

        const assignedQuestionIds = existingAssignments.map(a => a.cumulative_question_id);

        // Filter out already assigned question_ids
        const newQuestionIds = question_ids.filter(id => !assignedQuestionIds.includes(id));

        if (newQuestionIds.length === 0) {
            return res.status(200).send({ message: 'The selected questions already exist in this internal test.' });
        }

        // Create an array of objects to bulk create entries in CumulativeQuestionInternalTest
        const assignments = newQuestionIds.map(question_id => ({
            cumulative_question_id: question_id,
            internal_test_id: internal_test_id
        }));

        // Bulk create entries in the CumulativeQuestionInternalTest table
        const createdAssignments = await CumulativeQuestionInternalTest.bulkCreate(assignments);

        return res.status(200).send({ 
            message: 'Questions assigned to internal test successfully.', 
            assignments: createdAssignments 
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const fetchQuestionsByInternalTestId = async (req, res) => {
    try {
        const student_id = req.studentId;
        const { internal_test_id } = req.body;
        console.log("Internal Test ID:", internal_test_id);

        if (!internal_test_id) {
            return res.status(400).send({ message: "Internal Test ID is required" });
        }

        // Fetch details from InternalTest table including is_monitored, show_result, and number_of_questions
        const internalTest = await db.InternalTest.findByPk(internal_test_id, {
            attributes: ['number_of_questions', 'is_monitored', 'show_result']
        });

        if (!internalTest) {
            return res.status(404).send({ message: "Internal test not found" });
        }

        const { number_of_questions, is_monitored, show_result } = internalTest;

        // Check if the student has already attended this test
        const existingResult = await InternalTestResult.findOne({
            where: {
                internal_test_id,
                student_id,
            },
        });

        if (existingResult) {
            return res.status(400).send({ message: "You have already attended this test" });
        }

        // Fetch cumulative_question_ids from CumulativeQuestionInternalTest table
        const questionInternals = await db.CumulativeQuestionInternalTest.findAll({
            where: { internal_test_id },
            attributes: ['cumulative_question_id']
        });

        if (!questionInternals.length) {
            return res.status(404).send({ message: "No questions found for this test" });
        }

        const questionIds = questionInternals.map(q => q.cumulative_question_id);

        // Shuffle the question IDs and limit to the number of questions specified in the internal test
        const shuffledQuestionIds = questionIds.sort(() => 0.5 - Math.random());
        const limitedQuestionIds = shuffledQuestionIds.slice(0, Math.min(number_of_questions, questionIds.length));

        // Fetch questions based on the shuffled and limited question IDs
        const questions = await db.CumulativeQuestion.findAll({
            where: { cumulative_question_id: limitedQuestionIds },
            include: [
                {
                    model: db.Option,
                    as: 'QuestionOptions',
                    attributes: ['option_id', 'option_description']
                },
                {
                    model: db.CorrectAnswer,
                    as: 'CorrectAnswers',
                    attributes: ['correct_answer_id', 'answer_description']
                }
            ]
        });

        if (questions.length > 0) {
            res.status(200).send({
                questions: questions,
                is_monitored: is_monitored,
                show_result: show_result
            });
        } else {
            res.status(404).send({ message: "No questions found for the given internal test ID" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

const fetchQuestionsByInternalTestIdForEdit = async (req, res) => {
    try {
        const student_id = req.studentId;
        const { internal_test_id } = req.body;
        console.log("Internal Test ID:", internal_test_id);

        if (!internal_test_id) {
            return res.status(400).send({ message: "Internal Test ID is required" });
        }

        // Fetch details from InternalTest table including is_monitored, show_result, and number_of_questions
        const internalTest = await db.InternalTest.findByPk(internal_test_id, {
            attributes: ['number_of_questions', 'is_monitored', 'show_result']
        });

        if (!internalTest) {
            return res.status(404).send({ message: "Internal test not found" });
        }

        const { number_of_questions, is_monitored, show_result } = internalTest;

        // // Check if the student has already attended this test
        // const existingResult = await InternalTestResult.findOne({
        //     where: {
        //         internal_test_id,
        //         student_id,
        //     },
        // });

        // if (existingResult) {
        //     return res.status(400).send({ message: "You have already attended this test" });
        // }

        // Fetch cumulative_question_ids from CumulativeQuestionInternalTest table
        const questionInternals = await db.CumulativeQuestionInternalTest.findAll({
            where: { internal_test_id },
            attributes: ['cumulative_question_id']
        });

        if (!questionInternals.length) {
            return res.status(404).send({ message: "No questions found for this test" });
        }

        const questionIds = questionInternals.map(q => q.cumulative_question_id);

        // Shuffle the question IDs and limit to the number of questions specified in the internal test
        const shuffledQuestionIds = questionIds.sort(() => 0.5 - Math.random());
        const limitedQuestionIds = shuffledQuestionIds.slice(0, Math.min(number_of_questions, questionIds.length));

        // Fetch questions based on the shuffled and limited question IDs
        const questions = await db.CumulativeQuestion.findAll({
            where: { cumulative_question_id: limitedQuestionIds },
            include: [
                {
                    model: db.Option,
                    as: 'QuestionOptions',
                    attributes: ['option_id', 'option_description']
                },
                {
                    model: db.CorrectAnswer,
                    as: 'CorrectAnswers',
                    attributes: ['correct_answer_id', 'answer_description']
                }
            ]
        });

        if (questions.length > 0) {
            res.status(200).send({
                questions: questions,
                is_monitored: is_monitored,
                show_result: show_result
            });
        } else {
            res.status(404).send({ message: "No questions found for the given internal test ID" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};


const saveInternalTestResults = async (req, res) => {
    try {
        const student_id = req.studentId;
        const {
            internal_test_id,
            marks_obtained,
            total_marks,
            detailed_results // array of objects
        } = req.body;

        // Check if there is already a result for this combination
        const existingResult = await InternalTestResult.findOne({
            where: {
                internal_test_id,
                student_id,
            },
        });

        if (existingResult) {
            return res.status(400).send({ message: "You have already attended this test." });
        }

        // Check if the student exists
        const student = await Student.findByPk(student_id);
        if (!student) {
            return res.status(404).send({ message: "Student Not Available" });
        }

        // Save the test results
        const testResults = await InternalTestResult.create({
            internal_test_id,
            student_id,
            marks_obtained,
            total_marks,
            detailed_results: JSON.stringify(detailed_results) // Directly use the received detailed_results
        });

        return res.status(200).send(testResults);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const fetchInternalTestResults = async (req, res) => {
    try {
        const student_id = req.studentId; 
        const { internal_test_id } = req.params; 

        // Fetch the saved test results for the specific student and test ID
        const result = await InternalTestResult.findOne({
            where: {
                internal_test_id,
                student_id,
            }
        });

        if (!result) {
            return res.status(404).send({ message: "No results found for this test." });
        }

        // Parse the detailed results from JSON
        const detailedResults = JSON.parse(result.detailed_results);

        // Extract cumulative_question_ids from the detailed results
        const cumulativeQuestionIds = detailedResults.map(result => result.cumulative_question_id);

        // Fetch questions and options based on the extracted IDs
        const questions = await db.CumulativeQuestion.findAll({
            where: { cumulative_question_id: cumulativeQuestionIds },
            include: [
                {
                    model: db.Option,
                    as: 'QuestionOptions',
                    attributes: ['option_id', 'option_description']
                },
                {
                    model: db.CorrectAnswer,
                    as: 'CorrectAnswers',
                    attributes: ['correct_answer_id', 'answer_description']
                }
            ]
        });

        // Combine the fetched questions with the detailed results
        const resultsWithQuestions = detailedResults.map(detail => {
            const question = questions.find(q => q.cumulative_question_id === detail.cumulative_question_id);
            return {
                cumulative_question_id: detail.cumulative_question_id,
                question_description: question ? question.question_description : null,
                options: question ? question.QuestionOptions : [],
                correct_options: detail.correct_options,
                selected_options: detail.selected_options,
            };
        });

        return res.status(200).send({
            marks_obtained: result.marks_obtained,
            total_marks: result.total_marks,
            questions: resultsWithQuestions,
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// const getStudentInternalTestDetails = async (req, res) => {
//     try {
//         // Fetch all InternalTests including associated topics in descending order by internal_test_id
//         const internalTests = await InternalTest.findAll({
//             include: [
//                 {
//                     model: InternalTestTopic,
//                     as: 'TestTopics',
//                     include: [
//                         {
//                             model: Topic,
//                             as: 'InternalTestTopic' // This alias should match the one defined in your association
//                         }
//                     ]
//                 }
//             ],
//             order: [['internal_test_id', 'DESC']], // Order by internal_test_id descending
//         });

//         // Check if there are no internal tests
//         if (!internalTests || internalTests.length === 0) {
//             return res.status(404).send({ message: 'No internal tests found' });
//         }

//         // Get student_id from the request
//         const student_id = req.studentId;

//         // Fetch attended tests for the student
//         const attendedTests = await InternalTestResult.findAll({
//             where: { student_id },
//             attributes: ['internal_test_id'], // Only fetch internal_test_id
//         });

//         // Convert attendedTests to a Set for easier lookup
//         const attendedTestIds = new Set(attendedTests.map(result => result.internal_test_id));

//         // Prepare response data to send back
//         const formattedTests = internalTests.map(test => ({
//             internal_test_id: test.internal_test_id,
//             internal_test_link: test.internal_test_link,
//             number_of_questions: test.number_of_questions,
//             test_description: test.test_description,
//             show_result: test.show_result,
//             is_active: test.is_active,
//             is_monitored: test.is_monitored,
//             created_at: test.createdAt,
//             updated_at: test.updatedAt,
//             topics: test.TestTopics.map(topicData => ({
//                 topic_id: topicData.topic_id,
//                 topic_name: topicData.InternalTestTopic ? topicData.InternalTestTopic.name : null // Access the topic name correctly based on the alias
//             })),
//             attended: attendedTestIds.has(test.internal_test_id) // Set the attended flag based on presence in attendedTestIds
//         }));

//         return res.status(200).send({ message: 'Internal tests fetched successfully', internalTests: formattedTests });
//     } catch (error) {
//         console.error('Error fetching internal tests:', error.stack);
//         return res.status(500).send({ message: error.message });
//     }
// };

const getStudentInternalTestDetails = async (req, res) => {
    try {
        const student_id = req.studentId;

        // Step 1: Find the batch(es) the student belongs to
        const studentBatches = await db.Student_Batch.findAll({
            where: { student_id },
            attributes: ['batch_id']
        });

        if (!studentBatches || studentBatches.length === 0) {
            return res.status(404).send({ message: 'Student is not assigned to any batch' });
        }

        const batchIds = studentBatches.map(batch => batch.batch_id);

        // Step 2: Fetch internal test IDs linked to the student's batch(es)
        const batchTestLinks = await BatchTestLinks.findAll({
            where: { batch_id: batchIds },
            attributes: ['internal_test_id']
        });

        if (!batchTestLinks || batchTestLinks.length === 0) {
            return res.status(404).send({ message: 'No internal tests linked to student batches' });
        }

        const internalTestIds = batchTestLinks.map(link => link.internal_test_id);

        // Step 3: Fetch internal tests that belong to those internal test IDs
        const internalTests = await InternalTest.findAll({
            where: { internal_test_id: internalTestIds },
            include: [
                {
                    model: InternalTestTopic,
                    as: 'TestTopics',
                    include: [
                        {
                            model: Topic,
                            as: 'InternalTestTopic'
                        }
                    ]
                }
            ],
            order: [['internal_test_id', 'DESC']],
        });

        if (!internalTests || internalTests.length === 0) {
            return res.status(404).send({ message: 'No internal tests found' });
        }

        // Step 4: Fetch attended tests for the student
        const attendedTests = await InternalTestResult.findAll({
            where: { student_id },
            attributes: ['internal_test_id', 'marks_obtained', 'total_marks'],
        });

        const attendedTestMap = new Map(attendedTests.map(result => [result.internal_test_id, result]));

        // Step 5: Format response
        const formattedTests = internalTests
            .filter(test => test.number_of_questions > 0 && test.TestTopics.length > 0)
            .map(test => ({
                internal_test_id: test.internal_test_id,
                internal_test_link: test.internal_test_link,
                number_of_questions: test.number_of_questions,
                test_description: test.test_description,
                show_result: test.show_result,
                is_active: test.is_active,
                is_monitored: test.is_monitored,
                test_date: test.test_date,
                created_at: test.createdAt,
                updated_at: test.updatedAt,
                topics: test.TestTopics.map(topicData => ({
                    topic_id: topicData.topic_id,
                    topic_name: topicData.InternalTestTopic ? topicData.InternalTestTopic.name : null
                })),
                attended: attendedTestMap.has(test.internal_test_id) ? {
                    marks_obtained: attendedTestMap.get(test.internal_test_id).marks_obtained,
                    total_marks: attendedTestMap.get(test.internal_test_id).total_marks
                } : null
            }));

        return res.status(200).send({ message: 'Internal tests fetched successfully', internalTests: formattedTests });

    } catch (error) {
        console.error('Error fetching internal tests:', error.stack);
        return res.status(500).send({ message: error.message });
    }
};

// const getStudentInternalTestDetails = async (req, res) => {
//     try {
//         // Fetch all InternalTests including associated topics in descending order by internal_test_id
//         const internalTests = await InternalTest.findAll({
//             include: [
//                 {
//                     model: InternalTestTopic,
//                     as: 'TestTopics',
//                     include: [
//                         {
//                             model: Topic,
//                             as: 'InternalTestTopic' // This alias should match the one defined in your association
//                         }
//                     ]
//                 }
//             ],
//             order: [['internal_test_id', 'DESC']], // Order by internal_test_id descending
//         });

//         // Check if there are no internal tests
//         if (!internalTests || internalTests.length === 0) {
//             return res.status(404).send({ message: 'No internal tests found' });
//         }

//         // Get student_id from the request
//         const student_id = req.studentId;

//         // Fetch attended tests for the student including marks obtained and total marks
//         const attendedTests = await InternalTestResult.findAll({
//             where: { student_id },
//             attributes: ['internal_test_id', 'marks_obtained', 'total_marks'], 
//         });

//         // Convert attendedTests to a Map for easier lookup
//         const attendedTestMap = new Map(attendedTests.map(result => [result.internal_test_id, result]));

//         // Prepare response data to send back, filtering out tests with 0 questions or no assigned topics
//         const formattedTests = internalTests
//             .filter(test => test.number_of_questions > 0 && test.TestTopics.length > 0) // Exclude tests with no questions or no associated topics
//             .map(test => ({
//                 internal_test_id: test.internal_test_id,
//                 internal_test_link: test.internal_test_link,
//                 number_of_questions: test.number_of_questions,
//                 test_description: test.test_description,
//                 show_result: test.show_result,
//                 is_active: test.is_active,
//                 is_monitored: test.is_monitored,
//                 test_date: test.test_date,
//                 created_at: test.createdAt,
//                 updated_at: test.updatedAt,
//                 topics: test.TestTopics.map(topicData => ({
//                     topic_id: topicData.topic_id,
//                     topic_name: topicData.InternalTestTopic ? topicData.InternalTestTopic.name : null // Access the topic name correctly based on the alias
//                 })),
//                 attended: attendedTestMap.has(test.internal_test_id) ? {
//                     marks_obtained: attendedTestMap.get(test.internal_test_id).marks_obtained,
//                     total_marks: attendedTestMap.get(test.internal_test_id).total_marks
//                 } : null // Set the attended details based on presence in attendedTestMap
//             }));

//         return res.status(200).send({ message: 'Internal tests fetched successfully', internalTests: formattedTests });
//     } catch (error) {
//         console.error('Error fetching internal tests:', error.stack);
//         return res.status(500).send({ message: error.message });
//     }
// };


const getStudentInternalTestDetailsBySdId = async (req, res) => {
    try {
        // Fetch all InternalTests including associated topics in descending order by internal_test_id
        const internalTests = await InternalTest.findAll({
            include: [
                {
                    model: InternalTestTopic,
                    as: 'TestTopics',
                    include: [
                        {
                            model: Topic,
                            as: 'InternalTestTopic' // This alias should match the one defined in your association
                        }
                    ]
                }
            ],
            order: [['internal_test_id', 'DESC']], // Order by internal_test_id descending
        });

        // Check if there are no internal tests
        if (!internalTests || internalTests.length === 0) {
            return res.status(404).send({ message: 'No internal tests found' });
        }

        // Get student_id from the request
        const student_id = req.studentId;

        // Fetch attended tests for the student
        const attendedTests = await InternalTestResult.findAll({
            where: { student_id },
            attributes: ['internal_test_id','marks_obtained', 'total_marks'], 
        });

        // Convert attendedTests to a Set for easier lookup
        const attendedTestIds = new Set(attendedTests.map(result => result.internal_test_id));

        // Prepare response data to send back, filtering out tests with 0 questions or no assigned topics
        const formattedTests = internalTests
            .filter(test => test.number_of_questions > 0 && test.TestTopics.length > 0) // Exclude tests with no questions or no associated topics
            .map(test => ({
                internal_test_id: test.internal_test_id,
                internal_test_link: test.internal_test_link,
                number_of_questions: test.number_of_questions,
                test_description: test.test_description,
                show_result: test.show_result,
                is_active: test.is_active,
                is_monitored: test.is_monitored,
                test_date:test.test_date,
                created_at: test.createdAt,
                updated_at: test.updatedAt,
                topics: test.TestTopics.map(topicData => ({
                    topic_id: topicData.topic_id,
                    topic_name: topicData.InternalTestTopic ? topicData.InternalTestTopic.name : null // Access the topic name correctly based on the alias
                })),
                attended: attendedTestIds.has(test.internal_test_id) // Set the attended flag based on presence in attendedTestIds
            }));

        return res.status(200).send({ message: 'Internal tests fetched successfully', internalTests: formattedTests });
    } catch (error) {
        console.error('Error fetching internal tests:', error.stack);
        return res.status(500).send({ message: error.message });
    }
};

const getStudentPerformance = async (req, res) => {
    try {
        // Get student_id from JWT or request body
        const studentIdFromJWT = req.studentId; // Assumed to be set by middleware
        const { student_id } = req.body; // Get student_id from request body

        // Use student_id from body if provided; otherwise, fallback to JWT
        const studentId = student_id || studentIdFromJWT;

        if (!studentId) {
            return res.status(400).send({ message: 'Student ID is required' });
        }

        // Fetch all InternalTestResults for the student including related InternalTest details
        const testResults = await InternalTestResult.findAll({
            where: { student_id: studentId },
            include: [
                {
                    model: InternalTest,
                    as: 'InternalTest', // Ensure this alias matches your model association
                    attributes: ['internal_test_id', 'number_of_questions', 'test_description'],
                }
            ],
            attributes: ['marks_obtained', 'total_marks', 'createdAt']
        });

        // Check if the student has attended any tests
        if (!testResults || testResults.length === 0) {
            return res.status(404).send({ message: 'No test results found for the student' });
        }

        // Initialize variables to calculate performance
        let totalMarksObtained = 0;
        let totalPossibleMarks = 0;
        const totalTestsAttended = testResults.length;

        // Prepare response data to send back
        const formattedResults = testResults.map(result => {
            const test = result.InternalTest; // Access associated InternalTest details

            // Aggregate marks
            totalMarksObtained += result.marks_obtained;
            totalPossibleMarks += result.total_marks || 0; // Safely access total_marks

            return {
                internal_test_id: test.internal_test_id,
                test_description: test.test_description,
                number_of_questions: test.number_of_questions,
                total_marks: result.total_marks, // total_marks from InternalTestResult
                marks_obtained: result.marks_obtained,
                test_date: result.createdAt, // Assuming test date is the created date of the result
            };
        });

        // Calculate average score per test, handling division by zero
        const averageScore = totalTestsAttended ? (totalMarksObtained / totalTestsAttended) : 0;

        // Prepare final performance summary
        const performanceSummary = {
            total_tests_attended: totalTestsAttended,
            total_marks_obtained: totalMarksObtained,
            total_possible_marks: totalPossibleMarks,
            average_score_per_test: averageScore.toFixed(2), // Rounding off to 2 decimal points
            test_results: formattedResults, // Detailed test results for the student
        };

        return res.status(200).send({ message: 'Student performance fetched successfully', performance: performanceSummary });
    } catch (error) {
        console.error('Error fetching student performance:', error.message); // More concise error logging
        return res.status(500).send({ message: 'Internal server error' });
    }
};



const getAllStudentDetailsForPerformance = async (req, res) => {
    try {
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role
        console.log("role :"+userRole)

        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN' && userRole !== 'TRAINER') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        const allStudents = await Student.findAll();

        // Wrap the response in an object
        res.json({ students: allStudents });
    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getAllStudentsPerformance = async (req, res) => {
    try {
        // Fetch all InternalTestResults for all students including related InternalTest and Student details
        const testResults = await InternalTestResult.findAll({
            include: [
                {
                    model: InternalTest,
                    as: 'InternalTest',
                    attributes: ['internal_test_id', 'number_of_questions', 'test_description'],
                },
                {
                    model: Student,
                    as: 'TestResultStudent', // Ensure this alias matches your model association
                    attributes: ['id', 'name', 'email'],
                }
            ],
            attributes: ['marks_obtained', 'total_marks', 'student_id', 'createdAt']
        });

        // Log the testResults to see what data we have
        // console.log('Test Results:', JSON.stringify(testResults, null, 2));

        // Check if any test results are found
        if (!testResults || testResults.length === 0) {
            return res.status(404).send({ message: 'No test results found for any students' });
        }

        // Map to store aggregated performance per student
        const studentPerformanceMap = {};

        // Loop through each test result and aggregate the performance for each student
        testResults.forEach(result => {
            const student = result.TestResultStudent;
            const test = result.InternalTest;

            if (!student) {
                console.warn('No student found for result:', result);
                return; // Skip if no student data
            }

            // Initialize student's performance data if not already present
            if (!studentPerformanceMap[student.id]) {
                studentPerformanceMap[student.id] = {
                    student_id: student.id,
                    student_name: student.name,
                    email: student.email,
                    total_tests_attended: 0,
                    total_marks_obtained: 0,
                    total_possible_marks: 0,
                    test_results: [] // Store individual test results
                };
            }

            // Aggregate data for the current student
            studentPerformanceMap[student.id].total_tests_attended += 1;
            studentPerformanceMap[student.id].total_marks_obtained += result.marks_obtained;
            studentPerformanceMap[student.id].total_possible_marks += result.total_marks;

            // Add the individual test result to the student's record
            studentPerformanceMap[student.id].test_results.push({
                internal_test_id: test.internal_test_id,
                test_description: test.test_description,
                number_of_questions: test.number_of_questions,
                total_marks: result.total_marks,
                marks_obtained: result.marks_obtained,
                test_date: result.createdAt,
            });
        });

        // Format the final data and calculate averages
        const allStudentsPerformance = Object.values(studentPerformanceMap).map(studentData => {
            const averageScorePerTest = studentData.total_marks_obtained / studentData.total_tests_attended;
            return {
                ...studentData,
                average_score_per_test: averageScorePerTest.toFixed(2), // Round to 2 decimal places
            };
        });

        // Prepare final summary for all students
        const performanceSummary = {
            total_students: allStudentsPerformance.length,
            student_performance: allStudentsPerformance,
        };

        return res.status(200).send({
            message: 'All students performance fetched successfully',
            performance: performanceSummary,
        });
    } catch (error) {
        console.error('Error fetching all students performance:', error.stack);
        return res.status(500).send({ message: error.message });
    }
};


const getStudentPerformanceForAdmin = async (req, res) => {
    try {
        // Get student_id from JWT or request body
        const { student_id } = req.body; // Get student_id from request body
        console.log("student Id ", student_id)
        if (!student_id) {
            return res.status(400).send({ message: 'Student ID is required.....' });
        }

        // Fetch all InternalTestResults for the student including related InternalTest details
        const testResults = await InternalTestResult.findAll({
            where: { student_id: student_id },
            include: [
                {
                    model: InternalTest,
                    as: 'InternalTest', // Ensure this alias matches your model association
                    attributes: ['internal_test_id', 'number_of_questions', 'test_description'],
                }
            ],
            attributes: ['marks_obtained', 'total_marks', 'createdAt']
        });

        // Check if the student has attended any tests
        if (!testResults || testResults.length === 0) {
            return res.status(404).send({ message: 'No test results found for the student' });
        }

        // Initialize variables to calculate performance
        let totalMarksObtained = 0;
        let totalPossibleMarks = 0;
        const totalTestsAttended = testResults.length;

        // Prepare response data to send back
        const formattedResults = testResults.map(result => {
            const test = result.InternalTest; // Access associated InternalTest details

            // Aggregate marks
            totalMarksObtained += result.marks_obtained;
            totalPossibleMarks += result.total_marks || 0; // Safely access total_marks

            return {
                internal_test_id: test.internal_test_id,
                test_description: test.test_description,
                number_of_questions: test.number_of_questions,
                total_marks: result.total_marks, // total_marks from InternalTestResult
                marks_obtained: result.marks_obtained,
                test_date: result.createdAt, // Assuming test date is the created date of the result
            };
        });

        // Calculate average score per test, handling division by zero
        const averageScore = totalTestsAttended ? (totalMarksObtained / totalTestsAttended) : 0;

        // Prepare final performance summary
        const performanceSummary = {
            total_tests_attended: totalTestsAttended,
            total_marks_obtained: totalMarksObtained,
            total_possible_marks: totalPossibleMarks,
            average_score_per_test: averageScore.toFixed(2), // Rounding off to 2 decimal points
            test_results: formattedResults, // Detailed test results for the student
        };

        return res.status(200).send({ message: 'Student performance fetched successfully', performance: performanceSummary });
    } catch (error) {
        console.error('Error fetching student performance:', error.message); // More concise error logging
        return res.status(500).send({ message: 'Internal server error' });
    }
};

const getAllInternalTestResultsByTestId = async (req, res) => {
    try {
        const { internal_test_id } = req.body;

        if (!internal_test_id) {
            return res.status(400).send({ message: 'internal_test_id is required' });
        }

        // Step 1: Fetch all results from InternalTestResult table by internal_test_id
        const results = await InternalTestResult.findAll({
            where: { internal_test_id },
            attributes: ['student_id', 'marks_obtained', 'total_marks']
        });

        // Step 2: Extract all unique internal_test_student_id values
        const studentIds = results.map(result => result.student_id);

        if (studentIds.length === 0) {
            return res.status(404).send({ message: 'No results found for the provided internal_test_id' });
        }

        // Step 3: Fetch student details from Student table
        const students = await Student.findAll({
            where: {
                id: studentIds
            },
            attributes: ['id', 'name', 'email', 'phoneNumber'] // Ensure attributes match your Sequelize model
        });

        // Step 4: Fetch assigned topic_id from InternalTestTopic table
        const assignedTopics = await InternalTestTopic.findAll({
            where: { internal_test_id },
            attributes: ['topic_id']
        });

        const topicIds = assignedTopics.map(topic => topic.topic_id);

        // Step 5: Fetch topic names from Topic table using the topic_id
        const topics = await Topic.findAll({
            where: { topic_id: topicIds }, // Adjust as per your Topic model definition
            attributes: ['topic_id', 'name'] // Make sure 'name' is the correct column name for the topic
        });

        const topicNames = topics.map(topic => topic.name); // Extract topic names

        // Step 6: Combine results with student details (no need to include topics here for each result)
        const combinedResults = results.map(result => {
            const student = students.find(student => student.id === result.student_id); // Adjust as per your Student model primary key
            return {
                internal_test_student_id: result.student_id,
                marks_obtained: result.marks_obtained,
                total_marks: result.total_marks,
                student_details: student ? {
                    student_name: student.name,
                    email: student.email,
                    phone_number: student.phoneNumber
                } : null
            };
        });

        // Send the combined results along with the topics separately
        return res.status(200).send({
            students: combinedResults,
            topics: topicNames 
        });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};



const deleteinternaltests = async (req, res) => {
    try {
        const { internal_test_id } = req.params;
        const batchTestLinks = await db.BatchTestLinks.findAll({
            where: {
                internal_test_id: internal_test_id
            }
        });

        if (batchTestLinks.length > 0) {
            await db.BatchTestLinks.destroy({
                where: {
                    internal_test_id: internal_test_id
                }
            });
            console.log(`Deleted associated BatchTestLinks for internal_test_id: ${internal_test_id}`);
        }
        const test = await InternalTest.findByPk(internal_test_id);

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        await test.destroy();

        return res.status(200).json({ message: 'Test and associated BatchTestLinks deleted successfully' });

    } catch (error) {
        console.error('Error deleting internal test:', error);
        return res.status(500).json({ message: 'Something went wrong while deleting the test' });
    }
};

const assignBatchToInternalTest = async (req, res) => {
    const { internal_test_id, batch_ids } = req.body; // Destructure batch_ids as an array
      console.log(req.body,"---------------------------req.body")
    try {
      // Ensure batch_ids is an array and contains at least one batch_id
      if (!Array.isArray(batch_ids) || batch_ids.length === 0) {
        return res.status(400).json({ message: 'Invalid batch_ids array provided.' });
      }
  
      // Initialize an array to store results of each assignment attempt
      const assignmentResults = [];
  
      // Loop through each batch_id and attempt the assignment
      for (let batch_id of batch_ids) {
        // Check if the batch is already assigned to the internal_test_id
        const existingLink = await db.BatchTestLinks.findOne({
          where: { internal_test_id, batch_id }
        });
  
        if (existingLink) {
          assignmentResults.push({ batch_id, message: 'Batch is already assigned to this internal test.' });
          continue; // Skip to the next batch_id if already assigned
        }
  
        // Check if the batch exists in the Batch table
        const batch = await db.Batch.findByPk(batch_id);
        if (!batch) {
          assignmentResults.push({ batch_id, message: 'Batch not found.' });
          continue; // Skip to the next batch_id if batch does not exist
        }
  
        // Create the new BatchTestLinks entry to assign the batch to the internal test
        const newBatchTestLink = await db.BatchTestLinks.create({
          internal_test_id,
          batch_id
        });
  
        assignmentResults.push({ batch_id, message: 'Batch successfully assigned.', data: newBatchTestLink });
      }
  
      // Return a response with the results of all batch assignments
      return res.status(200).json({
        message: 'Batch assignment process completed.',
        results: assignmentResults
      });
  
    } catch (error) {
      // Catch any errors and log them
      console.error('Error assigning batches to internal test:', error);
      return res.status(500).json({ message: 'Error assigning batches to internal test.' });
    }
  };

  const getBatchesByInternalTestId = async (req, res) => {
    const { internal_test_id } = req.params; // Assuming internal_test_id is passed as a parameter in the route

    try {
        // Fetch assigned batches linked to the InternalTest
        const assignedBatches = await db.Batch.findAll({
            include: [{
                model: BatchTestLinks,
                where: { internal_test_id },
                required: true,  // Only fetch batches that are assigned
            }]
        });
        console.log(assignedBatches, "-------------------assignedBatches");

        // Fetch unassigned batches (those not linked to this internal_test_id)
        const unassignedBatches = await Batch.findAll({
            where: {
                batch_id: {
                    [Op.notIn]: assignedBatches.map(batch => batch.batch_id) // Exclude assigned batches
                }
            }
        });
        console.log(unassignedBatches, "--------------------unassignedBatches");

        return res.status(200).json({
            assignedBatches,
            unassignedBatches
        });
    } catch (error) {
        console.error('Error fetching batches:', error);
        return res.status(500).send({ message: 'Error fetching batch details' });
    }
};

const getBatchesByWeeklyTestId = async (req, res) => {
    const { wt_id } = req.params; // Assuming internal_test_id is passed as a parameter in the route

    try {
        // Fetch assigned batches linked to the WeeklyTest
        const assignedBatches = await Batch.findAll({
            include: [{
                model: BatchTestLinks,
                where: { wt_id },
                required: true,  // Only fetch batches that are assigned
            }]
        });
        console.log(assignedBatches, "-------------------assignedBatches");

        // Fetch unassigned batches (those not linked to this internal_test_id)
        const unassignedBatches = await Batch.findAll({
            where: {
                batch_id: {
                    [Op.notIn]: assignedBatches.map(batch => batch.batch_id) // Exclude assigned batches
                }
            }
        });
        console.log(unassignedBatches, "--------------------unassignedBatches");

        return res.status(200).json({
            assignedBatches,
            unassignedBatches
        });
    } catch (error) {
        console.error('Error fetching batches:', error);
        return res.status(500).send({ message: 'Error fetching batch details' });
    }
};

// Method to assign an unassigned batch to a given internal_test_id
const assignBatchToWeeklyTest = async (req, res) => {
    const { wt_id, batch_ids } = req.body; // Destructure batch_ids as an array
  
    try {
      // Ensure batch_ids is an array and contains at least one batch_id
      if (!Array.isArray(batch_ids) || batch_ids.length === 0) {
        return res.status(400).json({ message: 'Invalid batch_ids array provided.' });
      }
  
      // Initialize an array to store results of each assignment attempt
      const assignmentResults = [];
  
      // Loop through each batch_id and attempt the assignment
      for (let batch_id of batch_ids) {
        // Check if the batch is already assigned to the weekly test (wt_id)
        const existingLink = await BatchTestLinks.findOne({
          where: { wt_id, batch_id }
        });
  
        if (existingLink) {
          assignmentResults.push({ batch_id, message: 'Batch is already assigned to this weekly test.' });
          continue; // Skip to the next batch_id if already assigned
        }
  
        // Check if the batch exists in the Batch table
        const batch = await Batch.findByPk(batch_id);
        if (!batch) {
          assignmentResults.push({ batch_id, message: 'Batch not found.' });
          continue; // Skip to the next batch_id if batch does not exist
        }
  
        // Create the new BatchTestLinks entry to assign the batch to the weekly test
        const newBatchTestLink = await BatchTestLinks.create({
          wt_id,
          batch_id
        });
  
        assignmentResults.push({ batch_id, message: 'Batch successfully assigned to weekly test.', data: newBatchTestLink });
      }
  
      // Return a response with the results of all batch assignments
      return res.status(200).json({
        message: 'Batch assignment process completed.',
        results: assignmentResults
      });
  
    } catch (error) {
      // Catch any errors and log them
      console.error('Error assigning batches to weekly test:', error);
      return res.status(500).json({ message: 'Error assigning batches to weekly test.' });
    }
  };
  

module.exports = {
    createInternalTestLink,
    updateInternalTestLink,
    getAllInternalTests,
    getInternalTestById,
    assignQuestionsToInternalTest,
    uploadAndAssignQuestionsToLink,
    saveQuestionAndAddToLinkTopic,
    assignQuestionsToInternalTestLink,
    fetchQuestionsByInternalTestId,
    fetchQuestionsByInternalTestIdForEdit,
    saveInternalTestResults,
    fetchInternalTestResults,
    getStudentInternalTestDetails,
    getStudentInternalTestDetailsBySdId,
    getStudentPerformance,
    getAllStudentDetailsForPerformance,
    getAllStudentsPerformance,
    getStudentPerformanceForAdmin,
    getAllInternalTestResultsByTestId,
}