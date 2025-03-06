const db = require('../models');
const weeklyTestQuestionAnswer = require('../models/weeklyTestQuestionAnswer');
const { baseURL } = require('./baseURLConfig');
const xlsx = require('xlsx');

const WeeklyTest = db.WeeklyTest;
const WeeklyTestQuestion = db.WeeklyTestQuestion;
const WeeklyTestQuestionAnswer = db.WeeklyTestQuestionAnswer;
const Topic = db.Topic;
const WeeklyTestTopics = db.WeeklyTestTopics;
const WeeklyTestQuestionMapping = db.WeeklyTestQuestionMapping;
const Student = db.Student;
const StudentAnswer = db.StudentAnswer;
const WeeklyTestFinalSubmission = db.WeeklyTestFinalSubmission;
const {  BatchTestLinks } = require('../models'); 

const createWeeklyTestLink = async (req, res) => {
    try {
        const { no_of_questions, test_date, is_active, is_monitored, topic_ids, wt_description } = req.body;

        if (!no_of_questions || !Array.isArray(topic_ids) || topic_ids.length === 0 || !test_date) {
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

        // Create a new WeeklyTest
        const newTest = await WeeklyTest.create({
            wt_link: '', // Initially empty, will be updated later
            no_of_questions,
            test_date,
            wt_description,
            is_active: is_active !== undefined ? is_active : true, // Default to true if not provided
            is_monitored: is_monitored !== undefined ? is_monitored : false // Default to false if not provided
        });

        // Generate the weekly test link with the wt_id
        const weekly_test_link = `${baseURL}/weekly-test/${newTest.wt_id}`;
        newTest.wt_link = weekly_test_link;
        await newTest.save();

        // Save the topic IDs in the WeeklyTestTopics table
        const topicPromises = topic_ids.map(topic_id =>
            WeeklyTestTopics.create({
                wt_id: newTest.wt_id,
                topic_id
            })
        );

        await Promise.all(topicPromises);

        // console.log("Newly created weekly test", newTest);
        return res.status(200).send({ message: 'Weekly test added successfully', newTest });
    } catch (error) {
        console.error('Error creating weekly test link:', error.stack);
        return res.status(500).send({ message: error.message });
    }
};


const updateWeeklyTest = async (req, res) => {
    try {
        const { wt_id } = req.params; // Test ID from the request parameters
        const { is_active, test_date, is_monitored, no_of_questions, wt_description } = req.body; // Fields to be updated

        // Find the test by ID
        const test = await WeeklyTest.findByPk(wt_id);

        if (!test) {
            return res.status(404).send({ message: 'Weekly test not found' });
        }

        // Update the fields only if they are provided in the request body
        if (is_active !== undefined) {
            test.is_active = is_active;
        }
        if (test_date !== undefined) {
            test.test_date = test_date;
        }
        if (is_monitored !== undefined) {
            test.is_monitored = is_monitored;
        }
        if (no_of_questions !== undefined) {
            test.no_of_questions = no_of_questions;
        }
        if (wt_description !== undefined) {
            test.wt_description = wt_description;
        }

        // Save the updated test
        await test.save();

        // console.log("Weekly test updated", test);
        return res.status(200).send({ message: 'Weekly test updated successfully', test });
    } catch (error) {
        console.error('Error updating weekly test:', error);
        return res.status(500).send({ message: error.message });
    }
};

const getWeeklyTestById = async (req, res) => {
    try {
        const { wt_id } = req.params;

        // Find the test by its primary key (wt_id), including associated topics
        const test = await WeeklyTest.findByPk(wt_id, {
            include: [
                {
                    model: WeeklyTestTopics,
                    as: 'TestWeekly',  // Use the alias 'TestWeekly'
                    include: [
                        {
                            model: Topic,
                            as: 'TopicAssociation'  // Ensure the alias matches the one defined in WeeklyTestTopics
                        }
                    ]
                },
                // {
                //     model: WeeklyTestQuestion,
                //     as: 'TestDetails'  // Alias for the WeeklyTestQuestion association
                // }
            ]
        });

        if (!test) {
            return res.status(404).send({ message: 'Weekly test not found' });
        }

        console.log("Weekly test fetched", test);
        return res.status(200).send({ message: 'Weekly test fetched successfully', test });
    } catch (error) {
        console.error('Error fetching weekly test:', error);
        return res.status(500).send({ message: error.message });
    }
};

const getAllWeeklyTests = async (req, res) => {
    try {
        // Find all tests, including associated topics
        const tests = await WeeklyTest.findAll({
            include: [
                {
                    model: WeeklyTestTopics,
                    as: 'TestWeekly',  // Use the alias 'TestWeekly'
                    include: [
                        {
                            model: Topic,
                            as: 'TopicAssociation'  // Ensure the alias matches the one defined in WeeklyTestTopics
                        }
                    ]
                },
                // {
                //     model: WeeklyTestQuestion,
                //     as: 'TestDetails'  // Alias for the WeeklyTestQuestion association, if needed
                // }
            ]
        });

        if (!tests || tests.length === 0) {
            return res.status(404).send({ message: 'No weekly tests found' });
        }

        console.log("All weekly tests fetched", tests);
        return res.status(200).send({ message: 'Weekly tests fetched successfully', tests });
    } catch (error) {
        console.error('Error fetching weekly tests:', error);
        return res.status(500).send({ message: error.message });
    }
};

const saveQuestionHandler = async (req, res) => {
    try {
        const { questionData, wt_id } = req.body;
      
            console.log(req.body,"----------------------------body")
        // Extract necessary fields
        const { wt_question_keywords } = questionData;
         console.log(questionData,"-----------------------------questiondata")
        // Save the question and mapping
        const result = await saveWeeklyTestQuestionWithMapping(questionData, wt_id);
       
        if (result.success) {
            const wt_question_id = result.newQuestion?.dataValues?.wt_question_id;
           
            if (wt_question_id && wt_question_keywords) { 
                console.log("🔍 Inserting keywords:", wt_question_keywords);

                const keywords = await db.WeeklyTestQuestionAnswer.create({
                    wt_question_id: wt_question_id,
                    keywords: wt_question_keywords?.toString() ,
                }, { 
                    fields: ["wt_question_id", "keywords"]  
                });

                console.log("✅ Answer saved successfully.", keywords);
            } else {
                return res.status(404).send({ message:"Skipping answer saving as no question ID is available" });
                // console.log("⚠ Skipping answer saving as no question ID is available.");
            }

            return res.status(200).send({ 
                message: result.message, 
                question: result.newQuestion 
            });
        } else {
            return res.status(500).send({ message: result.message, error: result.error });
        }
    } catch (error) {
        console.error("❌ Error saving question:", error);
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
};





// const saveQuestionHandler = async (req, res) => {
//     const { questionData, wt_id } = req.body;
//       console.log(questionData,"----------------------------questiondata");
//     // Call the service function to save the question and mapping
//     const result = await saveWeeklyTestQuestionWithMapping(questionData, wt_id);
   
//     // Return the appropriate response based on the result
//     if (result.success) {
//         return res.status(201).send({ message: result.message, question: result.newQuestion });
//     } else {
//         return res.status(500).send({ message: result.message, error: result.error });
//     }
// };

const saveWeeklyTestQuestionWithMapping = async (questionData, wt_id) => {
    const { wt_question_description, marks, minutes, topic_id } = questionData;

    try {
        // Step 1: Save the question to the WeeklyTestQuestion table
        const newQuestion = await WeeklyTestQuestion.create({
            wt_question_description,
            marks,
            minutes,
            topic_id
        });

        // Step 2: Save the mapping to WeeklyTestQuestionMapping table
        await WeeklyTestQuestionMapping.create({
            wt_id,  // The test ID passed to the function
            wt_question_id: newQuestion.wt_question_id  // The ID of the newly created question
        });

        return { success: true, message: 'Question  saved and assigned to the test link successfully', newQuestion };
    } catch (error) {
        console.error('Error saving question and mapping:', error);
        return { success: false, message: 'Error saving question or mapping', error };
    }
};

// const getQuestionsByWeeklyTestId = async (req, res) => {
//     const { wt_id } = req.params;

//     try {
//         // Step 1: Get all the question IDs from the WeeklyTestQuestionMapping table
//         const questionMappings = await WeeklyTestQuestionMapping.findAll({
//             where: { wt_id },
//             attributes: ['wt_question_id']  // Only select the question IDs
//         });

//         // Check if any questions are associated with the test
//         if (!questionMappings || questionMappings.length === 0) {
//             return res.status(404).send({ message: 'No questions found for this test' });
//         }

//         // Extract the question IDs from the mappings
//         const questionIds = questionMappings.map(mapping => mapping.wt_question_id);

//         // Step 2: Fetch the questions from the WeeklyTestQuestion table using the IDs
//         const questions = await WeeklyTestQuestion.findAll({
//             where: {
//                 wt_question_id: questionIds
//             },
//             include: [
//                 {
//                     model: Topic,  // Include the Topic details
//                     as: 'TopicDetails',
//                     attributes: ['name']
//                 }
//             ]
//         });

//         return res.status(200).send({
//             message: 'Questions fetched successfully',
//             questions
//         });

//     } catch (error) {
//         console.error('Error fetching questions by weekly test ID:', error);
//         return res.status(500).send({
//             message: 'Error fetching questions',
//             error: error.message
//         });
//     }

// };



const getQuestionsByWeeklyTestId = async (req, res) => {
    const { wt_id } = req.params;

    try {
        // Step 1: Get all the question IDs from the WeeklyTestQuestionMapping table
        const questionMappings = await WeeklyTestQuestionMapping.findAll({
            where: { wt_id },
            attributes: ['wt_question_id']  // Only select the question IDs
        });

        console.log(questionMappings,"--------------------------questionmapping")

        // Check if any questions are associated with the test
        if (!questionMappings || questionMappings.length === 0) {
            return res.status(404).send({ message: 'No questions found for this test' });
        }

        // Extract the question IDs from the mappings
        // const questionIds = questionMappings.map(mapping => mapping.wt_question_id);
        const questionIds = questionMappings.map(mapping => mapping.dataValues.wt_question_id);

        console.log(questionIds,"----------------------questionids")


        // Step 2: Fetch the questions from the WeeklyTestQuestion table using the IDs
        const questions = await WeeklyTestQuestion.findAll({
            where: {
                wt_question_id: questionIds
            },
            include: [
                {
                    model: Topic,  // Include the Topic details
                    as: 'TopicDetails',
                    attributes: ['name']
                },
                {
                    model: WeeklyTestQuestionAnswer,  
                    as: 'TestQuestionAnswerDetails',  // Updated alias
                    attributes: ['keywords']  // Fetch only keywords
                }
            ],
        
        });
               
           
           console.log(questions,"----------------------------------questions")
        // Calculate total marks
        const totalMarks = questions.reduce((total, question) => total + question.marks, 0);

        return res.status(200).send({
            message: 'Questions fetched successfully',
            totalMarks,
            questions
        });

    } catch (error) {
        console.error('Error fetching questions by weekly test ID:', error);
        return res.status(500).send({
            message: 'Error fetching questions',
            error: error.message
        });
    }
};


// const getQuestionsByWeeklyTestId = async (req, res) => {
//     const { wt_id } = req.params;

//     try {
//         // Step 1: Get all the question IDs from the WeeklyTestQuestionMapping table
//         const questionMappings = await WeeklyTestQuestionMapping.findAll({
//             where: { wt_id },
//             attributes: ['wt_question_id']  // Only select the question IDs
//         });

//         // Check if any questions are associated with the test
//         if (!questionMappings || questionMappings.length === 0) {
//             return res.status(404).send({ message: 'No questions found for this test' });
//         }

//         // Extract the question IDs from the mappings
//         const questionIds = questionMappings.map(mapping => mapping.wt_question_id);

//         // Step 2: Fetch the questions from the WeeklyTestQuestion table using the IDs
//         const questions = await WeeklyTestQuestion.findAll({
//             where: {
//                 wt_question_id: questionIds
//             },
//             include: [
//                 {
//                     model: Topic,  // Include the Topic details
//                     as: 'TopicDetails',
//                     attributes: ['name']
//                 }
//             ]
//         });
//         // console.log("Type of questions ===",typeof questions)

//         // Calculate total marks
//         const totalMarks = questions.reduce((total, question) => total + question.marks, 0);
//         console.log("type of returen ==-=-===>>>>", typeof totalMarks )
//         return res.status(200).send({
//             message: 'Questions fetched successfully',
//             totalMarks,
//             questions
//         });

//     } catch (error) {
//         console.error('Error fetching questions by weekly test ID:', error);
//         return res.status(500).send({
//             message: 'Error fetching questions',
//             error: error.message
//         });
//     }

// };


const getQuestionById = async (req, res) => {
    const { wt_question_id } = req.params;
    console.log("question id ", wt_question_id)
    try {
        // Step 1: Fetch the question from the WeeklyTestQuestion table by question ID
        const question = await WeeklyTestQuestion.findOne({
            where: {
                wt_question_id
            },
            include: [
                {
                    model: Topic,  // Include the Topic details
                    as: 'TopicDetails',
                    attributes: ['name']
                },{
                    model: WeeklyTestQuestionAnswer,  
                    as: 'TestQuestionAnswerDetails',  
                    attributes: ['keywords']
                }
            ]
        });

        // Check if the question exists
        if (!question) {
            return res.status(404).send({ message: 'Question not found' });
        }

        // Step 2: Send the question details as the response
        return res.status(200).send({
            message: 'Question fetched successfully',
            question
        });

    } catch (error) {
        console.error('Error fetching question by ID:', error);
        return res.status(500).send({
            message: 'Error fetching question',
            error: error.message
        });
    }
};

const updateQuestionById = async (req, res) => {
    const { wt_question_id } = req.body;
    const { wt_question_description, marks, minutes } = req.body;

    try {
        // Step 1: Fetch the question from the WeeklyTestQuestion table by question ID
        const question = await WeeklyTestQuestion.findOne({
            where: {
                wt_question_id
            }
        });

        // Check if the question exists
        if (!question) {
            return res.status(404).send({ message: 'Question not found' });
        }

        // Step 2: Update the question details
        question.wt_question_description = wt_question_description;
        question.marks = marks;
        question.minutes = minutes;

        // Step 3: Save the updated question
        await question.save();

        // Step 4: Send the updated question as the response
        return res.status(200).send({
            message: 'Question updated successfully',
            question
        });

    } catch (error) {
        console.error('Error updating question:', error);
        return res.status(500).send({
            message: 'Error updating question',
            error: error.message
        });
    }
};

const deleteQuestionById = async (req, res) => {
    const { wt_question_id } = req.params; // Get the question ID from the request parameters
    console.log("question id : ", wt_question_id)
    try {
        // Step 1: Find the question in the WeeklyTestQuestion table
        const question = await WeeklyTestQuestion.findByPk(wt_question_id);

        // If the question does not exist, return a 404 error
        if (!question) {
            return res.status(404).send({ message: 'Question not found' });
        }

        // Step 2: Delete all the mappings for the question from WeeklyTestQuestionMapping table
        await WeeklyTestQuestionMapping.destroy({
            where: { wt_question_id }
        });
        
        await StudentAnswer.destroy({
            where : {question_id : wt_question_id}
        })
        // Step 3: Delete the question from WeeklyTestQuestion table
        await WeeklyTestQuestion.destroy({
            where: { wt_question_id}
        });

        // Return success message after deletion
        return res.status(200).send({ message: 'Question and associated mapping deleted successfully' });

    } catch (error) {
        console.error('Error deleting question by ID:', error);
        return res.status(500).send({
            message: 'Error deleting question',
            error: error.message
        });
    }
};


const getQuestionsByTopicId = async (req, res) => {
    const { topic_id } = req.params;

    try {
        const questions = await WeeklyTestQuestion.findAll({
            where: { topic_id },
            include: [
                {
                    model: WeeklyTestQuestionMapping,  
                    as: 'TestMappings',  
                    include: [
                        {
                            model: WeeklyTest,  
                            as: 'WeeklyTest', 
                            attributes: ['wt_id', 'wt_description', 'test_date']
                        }
                    ]
                },
                {
                    model: Topic,  
                    as: 'TopicDetails',  
                    attributes: ['name']
                }
            ]
        });

        if (!questions || questions.length === 0) {
            return res.status(404).send({ message: 'No questions found for this topic' });
        }

        return res.status(200).send({
            message: 'Questions fetched successfully',
            questions
        });

    } catch (error) {
        console.error('Error fetching questions by topic ID:', error);
        return res.status(500).send({
            message: 'Error fetching questions',
            error: error.message
        });
    }
};

const assignQuestionsToTest = async (questionIds, wt_id) => {
    try {
        // Step 1: Check if the provided question IDs exist in WeeklyTestQuestions
        const existingQuestions = await WeeklyTestQuestion.findAll({
            where: {
                wt_question_id: questionIds
            },
            attributes: ['wt_question_id']
        });

        // Extract the question IDs that actually exist in the database
        const validQuestionIds = existingQuestions.map(q => q.wt_question_id);

        if (validQuestionIds.length === 0) {
            return { success: false, message: 'None of the provided questions exist.' };
        }

        // Step 2: Fetch already assigned questions for this test
        const alreadyAssignedQuestions = await WeeklyTestQuestionMapping.findAll({
            where: {
                wt_id,
                wt_question_id: validQuestionIds  // Only consider valid question IDs
            },
            attributes: ['wt_question_id']
        });

        const assignedQuestionIds = alreadyAssignedQuestions.map(mapping => mapping.wt_question_id);

        // Step 3: Filter out already assigned questions
        const questionsToAssign = validQuestionIds.filter(id => !assignedQuestionIds.includes(id));

        if (questionsToAssign.length === 0) {
            return { success: false, message: 'All provided questions are already assigned to this test.' };
        }

        // Step 4: Create the mappings for the questions that aren't already assigned
        const newMappings = await WeeklyTestQuestionMapping.bulkCreate(
            questionsToAssign.map(qid => ({
                wt_id,
                wt_question_id: qid
            }))
        );

        return {
            success: true,
            message: `${newMappings.length} question(s) assigned to the test successfully.`,
            newMappings
        };
    } catch (error) {
        console.error('Error assigning questions to test:', error);
        return { success: false, message: 'Error assigning questions to test', error };
    }
};


const assignQuestionsToTestHandler = async (req, res) => {
    const { questionIds, wt_id } = req.body;

    // Call the service function to assign questions to the test
    const result = await assignQuestionsToTest(questionIds, wt_id);

    // Return the appropriate response based on the result
    if (result.success) {
        return res.status(201).send({ message: result.message, assignedQuestions: result.newMappings });
    } else {
        return res.status(400).send({ message: result.message, error: result.error });
    }
};

// const saveAndAssignQuestionsFromExcel = async (filePath, wt_id, topic_id) => {
//     const workbook = xlsx.readFile(filePath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rows = xlsx.utils.sheet_to_json(sheet);

//     // Helper function to preserve string format (e.g., trimming white spaces)
//     const preserveStringFormat = (value) => (value != null ? String(value).trim() : '');

//     for (const row of rows) {
//         const [
//             wt_question_description,
//             marks,
//             minutes
//         ] = [
//             preserveStringFormat(row["Question Description"]),
//             preserveStringFormat(row.Marks),
//             preserveStringFormat(row.Minutes)
//         ];

//         // Validate and convert marks and minutes to integers
//         const questionMarks = parseInt(marks, 10);
//         const questionMinutes = parseInt(minutes, 10);
        
//         if (isNaN(questionMarks) || isNaN(questionMinutes)) {
//             console.warn(`Invalid marks or minutes value for question "${wt_question_description}":`, marks, minutes);
//             continue; // Skip this row if marks or minutes are invalid
//         }

//         try {
//             // Step 1: Save the question to the WeeklyTestQuestion table
//             const newQuestion = await WeeklyTestQuestion.create({
//                 wt_question_description,
//                 marks: questionMarks,
//                 minutes: questionMinutes,
//                 topic_id  // The topic_id passed in the request body
//             });

//             // Step 2: Save the mapping to WeeklyTestQuestionMapping table
//             await WeeklyTestQuestionMapping.create({
//                 wt_id,  // The test ID passed to the function
//                 wt_question_id: newQuestion.wt_question_id  // The ID of the newly created question
//             });

//         } catch (error) {
//             console.error(`Error saving question "${wt_question_description}" and mapping:`, error);
//         }
//     }
// };

const saveAndAssignQuestionsFromExcel = async (filePath, wt_id, topic_id) => {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const preserveStringFormat = (value) => (value != null ? String(value).trim() : '');

    const notSavedMessages = [];

    // Check if the provided topic_id exists
    const topicExists = await checkTopicExists(topic_id); // Assuming this function checks for a valid topic_id
    if (!topicExists) {
        console.warn(`Topic ID ${topic_id} does not exist. Please verify the topic_id.`);
        return;
    }

    for (const row of rows) {
        const wt_question_description = preserveStringFormat(row["Question Description"]);
        const marks = preserveStringFormat(row.Marks);
        const minutes = preserveStringFormat(row.Minutes);

        const questionMarks = parseInt(marks, 10);
        const questionMinutes = parseInt(minutes, 10);

        if (isNaN(questionMarks) || isNaN(questionMinutes)) {
            const errorMessage = `Invalid marks or minutes value for question "${wt_question_description}": ${marks}, ${minutes}`;
            console.warn(errorMessage);
            notSavedMessages.push(errorMessage);
            continue;
        }

        try {
            const newQuestion = await WeeklyTestQuestion.create({
                wt_question_description,
                marks: questionMarks,
                minutes: questionMinutes,
                topic_id // Use the passed topic_id directly
            });

            await WeeklyTestQuestionMapping.create({
                wt_id,
                wt_question_id: newQuestion.wt_question_id
            });

        } catch (error) {
            console.error(`Error saving question "${wt_question_description}" and mapping:`, error);
        }
    }

    if (notSavedMessages.length > 0) {
        console.log("Questions not saved due to missing marks or minutes:");
        notSavedMessages.forEach(message => console.log(message));
    }
};

// Helper function to check if the topic_id exists in the topics table
const checkTopicExists = async (topic_id) => {
    const topic = await Topic.findOne({ where: { topic_id } });
    return topic ? true : false;
};


// const saveStudentAnswer = async (req, res) => {
//     try {
//         const student_id = req.studentId;
//         const { wt_id, answers } = req.body;
//         console.log('student id ', student_id)
//         // Validate the input fields
//         if (!wt_id || !student_id || !Array.isArray(answers) || answers.length === 0) {
//             return res.status(400).send({ message: 'Required fields are missing or invalid' });
//         }
//         console.log("inside save answer -------")
//         // Validate that the weekly test and student exist
//         const weeklyTest = await WeeklyTest.findByPk(wt_id);
//         if (!weeklyTest) {
//             return res.status(404).send({ message: 'Weekly test not found' });
//         }

//         const student = await Student.findByPk(student_id);
//         if (!student) {
//             return res.status(404).send({ message: 'Student not found' });
//         }

//         // Process each answer provided by the student
//         const answerPromises = answers.map(async (answerObj) => {
//             const { question_id, answer, marks, comment } = answerObj;

//             // Validate that the question is associated with this weekly test using the mapping table
//             const mapping = await WeeklyTestQuestionMapping.findOne({
//                 where: {
//                     wt_question_id: question_id,
//                     wt_id
//                 }
//             });

//             if (!mapping) {
//                 throw new Error(`Question with ID ${question_id} is not associated with the weekly test ${wt_id}`);
//             }

//             // Check if a StudentAnswer already exists for the given student_id, wt_id, and question_id
//             const existingAnswer = await StudentAnswer.findOne({
//                 where: {
//                     wt_id,
//                     student_id,
//                     question_id
//                 }
//             });

//             if (existingAnswer) {
//                 throw new Error(`Answer for student ${student_id}, question ${question_id}, and test ${wt_id} already exists`);
//             }

//             // Create a new StudentAnswer entry
//             return StudentAnswer.create({
//                 wt_id,
//                 student_id,
//                 question_id,
//                 answer,
//                 marks: marks || null,  // Marks can be optional
//                 comment: comment || null  // Comments can also be optional
//             });
//         });

//         // Wait for all the answers to be saved
//         await Promise.all(answerPromises);

//         return res.status(200).send({ message: 'Answers saved successfully' });
//     } catch (error) {
//         console.error('Error saving student answers:', error.stack);
//         return res.status(500).send({ message: error.message });
//     }
// };

const saveStudentAnswer = async (req, res) => {
    try {
        const student_id = req.studentId;
        const { wt_id, answers } = req.body;
        console.log('student id ', student_id);

        // Validate the input fields
        if (!wt_id || !student_id || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).send({ message: 'Required fields are missing or invalid' });
        }

        console.log("inside save answer -------");

        // Validate that the weekly test and student exist
        const weeklyTest = await WeeklyTest.findByPk(wt_id);
        if (!weeklyTest) {
            return res.status(404).send({ message: 'Weekly test not found' });
        }

        const student = await Student.findByPk(student_id);
        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }

        // Check if the student has made the final submission for this test
        const finalSubmission = await WeeklyTestFinalSubmission.findOne({
            where: {
                wt_id,
                student_id
            }
        });

        if (finalSubmission && finalSubmission.final_submission) {
            return res.status(403).send({
                message: 'You have already made the final submission for this test. No further updates are allowed.'
            });
        }

        // Process each answer provided by the student
        const answerPromises = answers.map(async (answerObj) => {
            const { question_id, answer, marks, comment } = answerObj;

            // Validate that the question is associated with this weekly test using the mapping table
            const mapping = await WeeklyTestQuestionMapping.findOne({
                where: {
                    wt_question_id: question_id,
                    wt_id
                }
            });

            if (!mapping) {
                throw new Error(`Question with ID ${question_id} is not associated with the weekly test ${wt_id}`);
            }

            // Check if a StudentAnswer already exists for the given student_id, wt_id, and question_id
            const existingAnswer = await StudentAnswer.findOne({
                where: {
                    wt_id,
                    student_id,
                    question_id
                }
            });

            if (existingAnswer) {
                // Update the existing answer with the new answer, marks, and comment
                return existingAnswer.update({
                    answer,
                    marks: marks || null,  // Marks can be optional
                    comment: comment || null  // Comments can also be optional
                });
            }

            // Create a new StudentAnswer entry if no existing answer is found
            return StudentAnswer.create({
                wt_id,
                student_id,
                question_id,
                answer,
                marks: marks || null,  // Marks can be optional
                comment: comment || null  // Comments can also be optional
            });
        });

        // Wait for all the answers to be saved or updated
        await Promise.all(answerPromises);

        return res.status(200).send({ message: 'Answers saved/updated successfully' });
    } catch (error) {
        console.error('Error saving student answers:', error.stack);
        return res.status(500).send({ message: error.message });
    }
};

// const saveFinalSubmission = async (req, res) => {
//     try {
//         const student_id = req.studentId; // Get the student ID from the request (assume it's part of the JWT)
//         const { wt_id } = req.body;

//         // Validate input fields
//         if (!wt_id || !student_id) {
//             return res.status(400).send({ message: 'Weekly test ID and student ID are required' });
//         }

//         // Validate that the weekly test exists
//         const weeklyTest = await WeeklyTest.findByPk(wt_id);
//         if (!weeklyTest) {
//             return res.status(404).send({ message: 'Weekly test not found' });
//         }

//         // Check if there's already a final submission for this student and weekly test
//         const finalSubmission = await WeeklyTestFinalSubmission.findOne({
//             where: {
//                 wt_id,
//                 student_id
//             }
//         });

//         if (finalSubmission) {
//             // If final submission already exists and is set to true, don't allow further submissions
//             if (finalSubmission.final_submission) {
//                 return res.status(403).send({ message: 'Final submission has already been made. No changes allowed.' });
//             }

//             // Update the existing record to set final_submission to true
//             await finalSubmission.update({ final_submission: true });
//         } else {
//             // Create a new final submission entry
//             await WeeklyTestFinalSubmission.create({
//                 wt_id,
//                 student_id,
//                 final_submission: true
//             });
//         }

//         return res.status(200).send({ message: 'Final submission saved successfully' });
//     } catch (error) {
//         console.error('Error saving final submission:', error.stack);
//         return res.status(500).send({ message: 'An error occurred while saving the final submission' });
//     }
// };


const saveFinalSubmission = async (req, res) => {
    try {
        const student_id = req.studentId; // Get the student ID from JWT
        const { wt_id, latitude, longitude } = req.body;

        // Validate input fields
        if (!wt_id || !student_id) {
            return res.status(400).send({ message: 'Weekly test ID and student ID are required' });
        }

        // Validate that the weekly test exists
        const weeklyTest = await WeeklyTest.findByPk(wt_id);
        if (!weeklyTest) {
            return res.status(404).send({ message: 'Weekly test not found' });
        }

        // Check if there's already a final submission for this student and weekly test
        const finalSubmission = await WeeklyTestFinalSubmission.findOne({
            where: {
                wt_id,
                student_id
            }
        });

        // Default values for location tracking
        let attended_in_institute = false;

        // If location is shared, validate it
        if (latitude && longitude) {
            const instituteLatitude = 12.916758;  // Lara Institute coordinates
            const instituteLongitude = 77.611898;
            const allowedRangeMeters = 200; // Allow 200m range for institute attendance

            // Round latitude and longitude to 3 decimal places for comparison
            const roundedLatitude = parseFloat(latitude).toFixed(3);
            const roundedLongitude = parseFloat(longitude).toFixed(3);
            const roundedInstituteLatitude = instituteLatitude.toFixed(3);
            const roundedInstituteLongitude = instituteLongitude.toFixed(3);

            console.log(`Received Location: ${roundedLatitude}, ${roundedLongitude}`);
            console.log(`Institute Location: ${roundedInstituteLatitude}, ${roundedInstituteLongitude}`);

            // Compare rounded values
            attended_in_institute =
                roundedLatitude === roundedInstituteLatitude &&
                roundedLongitude === roundedInstituteLongitude;
        }

        if (finalSubmission) {
            // If final submission already exists and is set to true, don't allow further submissions
            if (finalSubmission.final_submission) {
                return res.status(403).send({ message: 'Final submission has already been made. No changes allowed.' });
            }

            // Update the existing record to set final_submission to true and store location (if provided)
            await finalSubmission.update({ 
                final_submission: true, 
                latitude: latitude || finalSubmission.latitude, 
                longitude: longitude || finalSubmission.longitude, 
                attended_in_institute 
            });
        } else {
            // Create a new final submission entry
            await WeeklyTestFinalSubmission.create({
                wt_id,
                student_id,
                final_submission: true,
                latitude: latitude || null,
                longitude: longitude || null,
                attended_in_institute
            });
        }

        return res.status(200).send({ message: 'Final submission saved successfully', attended_in_institute });
    } catch (error) {
        console.error('Error saving final submission:', error.stack);
        return res.status(500).send({ message: 'An error occurred while saving the final submission' });
    }
};

/**
 * Function to check if a location is within a certain range of the institute.
 * Uses the Haversine formula to calculate the distance between two coordinates.
 */
const isWithinRange = (lat1, lon1, lat2, lon2, maxDistanceMeters) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371000; // Earth's radius in meters

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters

    console.log(`Calculated Distance: ${distance} meters`); // Debugging distance calculation

    return distance <= maxDistanceMeters;
};



const getStudentAnswer = async (req, res) => {
    try {
        const student_id = req.studentId; // Assuming the student ID is part of the request, e.g., from JWT
        const { wt_id, question_id } = req.params; // Assuming wt_id and question_id are passed as params

        // Validate input fields
        if (!wt_id || !student_id || !question_id) {
            return res.status(400).send({ message: 'Required fields are missing or invalid' });
        }

        // Check if the weekly test exists
        const weeklyTest = await WeeklyTest.findByPk(wt_id);
        if (!weeklyTest) {
            return res.status(404).send({ message: 'Weekly test not found' });
        }

        // Check if the question is associated with this weekly test using the mapping table
        const mapping = await WeeklyTestQuestionMapping.findOne({
            where: {
                wt_question_id: question_id,
                wt_id
            }
        });

        if (!mapping) {
            return res.status(404).send({ message: `Question with ID ${question_id} is not associated with the weekly test ${wt_id}` });
        }

        // Fetch the student's answer for the particular question
        const studentAnswer = await StudentAnswer.findOne({
            where: {
                wt_id,
                student_id,
                question_id
            }
        });

        if (!studentAnswer) {
            // If no answer exists, return null (meaning the student has not answered the question yet)
            return res.status(200).send({
                message: 'No answer provided yet',
                answer: null
            });
        }

        // Return the student's answer along with optional marks and comment
        return res.status(200).send({
            message: 'Answer fetched successfully',
            answer: studentAnswer.answer,
            marks: studentAnswer.marks || null,
            comment: studentAnswer.comment || null
        });
    } catch (error) {
        console.error('Error fetching student answer:', error.stack);
        return res.status(500).send({ message: 'An error occurred while fetching the answer' });
    }
};


// const updateQuestionHandler = async (req, res) => {
//     const { question_id } = req.params;  
//     const questionData = req.body;  

//     // Call the service function to update the question
//     const result = await updateWeeklyTestQuestion(question_id, questionData);

//     // Return the appropriate response based on the result
//     if (result.success) {
//         return res.status(200).send({ message: result.message, updatedQuestion: result.updatedQuestion });
//     } else {
//         return res.status(400).send({ message: result.message, error: result.error });
//     }
// };

const updateQuestionHandler = async (req, res) => {
    const { question_id } = req.params;  
    const { wt_question_description, marks, minutes, keywords } = req.body;

    try {
        // Ensure keywords are processed correctly as a string
        const keywordsString = Array.isArray(keywords) ? keywords.join(", ") : keywords;

        // Update the main WeeklyTestQuestion fields
        await WeeklyTestQuestion.update(
            { wt_question_description, marks, minutes },
            { where: { wt_question_id: question_id } }
        );

        // Update or insert keywords in WeeklyTestQuestionAnswer (assuming one row per question)
        const existingRecord = await WeeklyTestQuestionAnswer.findOne({
            where: { wt_question_id: question_id }
        });

        if (existingRecord) {
            // Update existing keywords entry
            await WeeklyTestQuestionAnswer.update(
                { keywords: keywordsString },
                { where: { wt_question_id: question_id } }
            );
        } else {
            // Insert new record if no existing entry
            await WeeklyTestQuestionAnswer.create({
                wt_question_id: question_id,
                keywords: keywordsString
            });
        }

        return res.status(200).json({
            message: 'Question and keywords updated successfully!',
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Error updating question',
            error: error.message
        });
    }
};



const updateWeeklyTestQuestion = async (question_id, questionData) => {
    const { wt_question_description, marks, minutes } = questionData;  // Data to update

    try {
        // Step 1: Find the existing question by ID
        const existingQuestion = await WeeklyTestQuestion.findByPk(question_id);

        // Check if the question exists
        if (!existingQuestion) {
            return { success: false, message: 'Question not found' };
        }

        // Step 2: Update the question data (except topic_id)
        existingQuestion.wt_question_description = wt_question_description || existingQuestion.wt_question_description;
        existingQuestion.marks = marks || existingQuestion.marks;
        existingQuestion.minutes = minutes || existingQuestion.minutes;

        // Save the updated question to the database
        await existingQuestion.save();

        return { success: true, message: 'Question updated successfully', updatedQuestion: existingQuestion };
    } catch (error) {
        console.error('Error updating question:', error);
        return { success: false, message: 'Error updating question', error };
    }
};

const saveAnswerFortheQuestion = async (req, res) => {
    try {
        const { question_id } = req.params; // The question ID is passed as a param
        const { answer } = req.body; // The correct answer is expected in the request body

        // Validate input fields
        if (!question_id || !answer) {
            return res.status(400).send({ message: 'Required fields are missing or invalid' });
        }

        // Check if the question exists in the database
        const question = await WeeklyTestQuestion.findByPk(question_id);
        if (!question) {
            return res.status(404).send({ message: 'Question not found' });
        }

        // Check if the correct answer already exists for this question
        const existingAnswer = await WeeklyTestQuestionAnswer.findOne({
            where: {
                wt_question_id: question_id
            }
        });

        if (existingAnswer) {
            // If the correct answer already exists, update it
            await existingAnswer.update({
                answer: answer
            });
            return res.status(200).send({ message: 'Correct answer updated successfully' });
        } else {
            // If no correct answer exists, create a new one
            const newAnswer = await WeeklyTestQuestionAnswer.create({
                wt_question_id: question_id, // Foreign key for the question
                answer: answer // The correct answer for the question
            });
            return res.status(201).send({ message: 'Correct answer saved successfully', answer: newAnswer });
        }
    } catch (error) {
        console.error('Error saving correct answer:', error.stack);
        return res.status(500).send({ message: 'An error occurred while saving the correct answer' });
    }
};

const getCorrectAnswerForQuestion = async (req, res) => {
    try {
        const { question_id } = req.params; // The question ID is passed as a param

        // Validate input fields
        if (!question_id) {
            return res.status(400).send({ message: 'Question ID is required' });
        }

        // Check if the question exists in the database
        const question = await WeeklyTestQuestion.findByPk(question_id);
        if (!question) {
            return res.status(404).send({ message: 'Question not found' });
        }

        // Fetch the correct answer for the question from WeeklyTestQuestionAnswer
        const correctAnswer = await WeeklyTestQuestionAnswer.findOne({
            where: {
                wt_question_id: question_id
            }
        });

        if (correctAnswer) {
            // If the correct answer exists, return it
            return res.status(200).send({
                message: 'Correct answer fetched successfully',
                answer: correctAnswer.answer,
                keywords: correctAnswer.keywords
            });
        } else {
            // If no correct answer exists, return null
            return res.status(200).send({
                message: 'No correct answer available for this question',
                answer: null
            });
        }
    } catch (error) {
        console.error('Error fetching correct answer:', error.stack);
        return res.status(500).send({ message: 'An error occurred while fetching the correct answer' });
    }
};

const getQuestionDetailsById = async (wt_question_id) => {
    try {
        // Step 1: Fetch the question from the WeeklyTestQuestion table by question ID
        const question = await WeeklyTestQuestion.findOne({
            where: {
                wt_question_id
            },
            include: [
                {
                    model: Topic,  // Include the Topic details
                    as: 'TopicDetails',
                    attributes: ['name']
                }
            ]
        });

        // Check if the question exists
        if (!question) {
            return { message: 'Question not found', question: null };
        }

        // Return the question details
        return {
            message: 'Question fetched successfully',
            question
        };

    } catch (error) {
        console.error('Error fetching question by ID:', error);
        return { message: 'Error fetching question', error: error.message };
    }
};

const getStudentAnswerAndQuestion = async (req, res) => {
    try {
        const { student_id, wt_id, question_id } = req.body; // Receive student_id in the request body

        // Validate input fields
        if (!student_id || !wt_id || !question_id) {
            return res.status(400).send({ message: 'Required fields are missing or invalid' });
        }

        // Check if the weekly test exists
        const weeklyTest = await WeeklyTest.findByPk(wt_id);
        if (!weeklyTest) {
            return res.status(404).send({ message: 'Weekly test not found' });
        }

        // Check if the question is associated with this weekly test using the mapping table
        const mapping = await WeeklyTestQuestionMapping.findOne({
            where: {
                wt_question_id: question_id,
                wt_id
            }
        });

        if (!mapping) {
            return res.status(404).send({ message: `Question with ID ${question_id} is not associated with the weekly test ${wt_id}` });
        }

        // Fetch the student's answer for the particular question
        const studentAnswer = await StudentAnswer.findOne({
            where: {
                wt_id,
                student_id,
                question_id
            }
        });

        // If no answer exists, return null (meaning the student has not answered the question yet)
        const answerData = studentAnswer
            ? {
                answer: studentAnswer.answer,
                marks: studentAnswer.marks || null,
                comment: studentAnswer.comment || null,
            }
            : {
                answer: null,
                marks: null,
                comment: null
            };

        // Fetch the question details using the refactored getQuestionById method
        const questionDetails = await getQuestionDetailsById(question_id);

        // Return the student's answer along with optional marks, comment, and the question details
        return res.status(200).send({
            message: 'Data fetched successfully',
            answer: answerData,
            question: questionDetails.question // Send the question details in the response
        });
    } catch (error) {
        console.error('Error fetching student answer and question:', error.stack);
        return res.status(500).send({ message: 'An error occurred while fetching the data' });
    }
};


const getQuestionAnswerDataByStudentId = async (req, res) => {
    const { wt_id, student_id } = req.params;  // Receive wt_id and student_id from the request

    try {
        // Step 1: Get all the question IDs associated with the provided wt_id
        const questionMappings = await WeeklyTestQuestionMapping.findAll({
            where: { wt_id },
            attributes: ['wt_question_id']  // Only select the question IDs
        });

        // If no question mappings found
        if (!questionMappings || questionMappings.length === 0) {
            return res.status(404).send({ message: 'No questions found for this test' });
        }

        // Extract question IDs
        const questionIds = questionMappings.map(mapping => mapping.wt_question_id);

        // Step 2: Fetch questions along with associated topic details
        const questions = await WeeklyTestQuestion.findAll({
            where: {
                wt_question_id: questionIds
            },
            include: [
                {
                    model: Topic,  // Include topic details in the query
                    as: 'TopicDetails',  // Alias used in associations
                    attributes: ['name']  // Include topic name
                }
            ]
        });

        // Step 3: For each question, get the answer provided by the given student
        const questionsWithAnswers = await Promise.all(questions.map(async (question) => {
            const questionId = question.wt_question_id;

            // Get the student's answer for this particular question
            const studentAnswer = await StudentAnswer.findOne({
                where: {
                    wt_id,
                    question_id: questionId,
                    student_id
                },
                attributes: ['answer', 'marks', 'comment']
            });

            // If no answer exists for this question by this student, mark it as "Not Attempted"
            const answerData = studentAnswer ? {
                student_id,
                answer: studentAnswer.answer,
                marks: studentAnswer.marks,
                comment: studentAnswer.comment
            } : {
                student_id,
                answer: "Not Attempted",
                marks: null,
                comment: null
            };

            return {
                question_id: questionId,
                question_text: question.wt_question_description,  
                marks: question.marks,
                minutes: question.minutes,
                topic: question.TopicDetails ? question.TopicDetails.name : null,  // Include topic details
                studentAnswer: answerData  // Send only the student's answer for this question
            };
        }));

        return res.status(200).send({
            message: 'Questions and answers fetched successfully',
            questions: questionsWithAnswers
        });

    } catch (error) {
        console.error('Error fetching questions and answers:', error);
        return res.status(500).send({
            message: 'Error fetching questions and answers',
            error: error.message
        });
    }
};

// const updateMarksAndCommentByStudentId = async (req, res) => {
//     const { wt_id, student_id, question_id } = req.params;  // Receive wt_id, student_id, and wt_question_id from the request
//     const { marks, comment } = req.body;  // Receive marks and comment from the request body

//     try {
//         // Step 1: Check if the student has already answered the question
//         const studentAnswer = await StudentAnswer.findOne({
//             where: {
//                 wt_id,
//                 student_id,
//                 question_id
//             }
//         });

//         // If the student has not answered the question, return an error
//         if (!studentAnswer) {
//             return res.status(404).send({
//                 message: 'Student has not attempted this question yet'
//             });
//         }

//         // Step 2: Set default value for comment if it's empty or undefined
//         const updatedComment = comment && comment.trim() !== '' ? comment : 'N/A';
//             const checkevalution = await WeeklyTestFinalSubmission.findOne({
//                 where : {
//                     wt_id,
//                 student_id
//                 }
//             })
//         // Step 3: Update the marks and comment for the question
//         await StudentAnswer.update(
//             {
//                 marks,  // New marks
//                 comment: updatedComment  // New comment with default if needed
//             },
//             {
//                 where: {
//                     wt_id,
//                     student_id,
//                     question_id
//                 }
//             }
//         );

//         return res.status(200).send({
//             message: 'Marks and comment updated successfully'
//         });

//     } catch (error) {
//         console.error('Error updating marks and comment:', error);
//         return res.status(500).send({
//             message: 'Error updating marks and comment',
//             error: error.message
//         });
//     }
// };



const updateMarksAndCommentByStudentId = async (req, res) => {
    const { wt_id, student_id, question_id } = req.params;  // Receive wt_id, student_id, and question_id from the request
    const { marks, comment } = req.body;  // Receive marks and comment from the request body
     console.log(req.body ,"-------------------------body");
     console.log(req.params ,"-------------------------[params]");
    try {
        // Step 1: Check if final evaluation is already done
        const checkEvaluation = await WeeklyTestFinalSubmission.findOne({
            where: {
                wt_id,
                student_id
            }
        });
           
        console.log(checkEvaluation,"------------------------evalutin")
        if (checkEvaluation && checkEvaluation.evaluation === true) {
            // If final evaluation is done, prevent further updates
            return res.status(403).send({
                message: 'Final evaluation is already done. Marks and comment cannot be updated.'
            });
        }
            console.log("------------------------------------------")
        // Step 2: Check if the student has already answered the question
        const studentAnswer = await StudentAnswer.findOne({
            where: {
                wt_id,
                student_id,
                question_id
            }
        });
          
        // If the student has not answered the question, return an error
        if (!studentAnswer) {
            return res.status(404).send({
                message: 'Student has not attempted this question yet'
            });
        }

        // Step 3: Set default value for comment if it's empty or undefined
        const updatedComment = comment && comment.trim() !== '' ? comment : 'N/A';
        console.log("------------------------------------------------")
        // Step 4: Update the marks and comment for the question
        await StudentAnswer.update(
            {
                marks,  // New marks
                comment: updatedComment  // New comment with default if needed
            },
            {
                where: {
                    wt_id,
                    student_id,
                    question_id
                }
            }
        );

        return res.status(200).send({
            message: 'Marks and comment updated successfully'
        });

    } catch (error) {
        console.error('Error updating marks and comment:', error);
        return res.status(500).send({
            message: 'Error updating marks and comment',
            error: error.message
        });
    }
};


const getStudentDetailsByWeeklyTestId = async (req, res) => {
    const { wt_id } = req.params;  // Receive wt_id from the request

    try {
        // Step 1: Get all unique student IDs who attended the weekly test
        const studentIds = await StudentAnswer.findAll({
            where: { wt_id },
            attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('student_id')), 'student_id']]
        });

        // If no student answers found for this test
        if (!studentIds || studentIds.length === 0) {
            return res.status(404).send({ message: 'No students found for this test' });
        }

        // Extract student IDs
        const studentIdsArray = studentIds.map(student => student.student_id);

        // Step 2: Fetch student details from Students table
        const students = await Student.findAll({
            where: {
                id: studentIdsArray
            },
            attributes: ['id', 'name', 'email', 'phoneNumber']  // Adjust attributes as per your Student model
        });

        // Step 3: Fetch student answers and question details for each student
        const studentsWithAnswers = await Promise.all(students.map(async (student) => {
            // Get all answers for this student in this weekly test
            const studentAnswers = await StudentAnswer.findAll({
                where: {
                    wt_id,
                    student_id: student.id  // Use the correct student.id for filtering
                },
                attributes: ['wt_question_id', 'answer', 'marks', 'comment']
            });

            // Fetch and format question details for each answer
            const formattedAnswers = await Promise.all(studentAnswers.map(async (answer) => {
                // Fetch question details using the handler function
                let questionDetails;
                try {
                    questionDetails = await getQuestionDetailsByIdHandler(answer.wt_question_id);
                    console.log("ilakjdfkjfdljsdfjasdfadsjlf========")
                } catch (error) {
                    questionDetails = {
                        question_id: answer.wt_question_id,
                        question_text: "Question not found",
                        marks: null,
                        minutes: null,
                        topic: "Topic not found"
                    };
                }

                return {
                    question_id: answer.wt_question_id,
                    question_text: questionDetails.question_text,
                    marks: questionDetails.marks,
                    minutes: questionDetails.minutes,
                    topic: questionDetails.topic,
                    answer: answer.answer,
                    marks_received: answer.marks,
                    comment: answer.comment
                };
            }));

            return {
                student_id: student.id,
                student_name: student.name,
                student_email: student.email,
                student_phone: student.phoneNumber,
                answers: formattedAnswers
            };
        }));

        return res.status(200).send({
            message: 'Student details and answers fetched successfully',
            students: studentsWithAnswers
        });

    } catch (error) {
        console.error('Error fetching student details and answers:', error);
        return res.status(500).send({
            message: 'Error fetching student details and answers',
            error: error.message
        });
    }
};

// const getStudentEvaluationStatusByWeeklyTestId = async (req, res) => {
//     const { wt_id } = req.params;  // Receive wt_id from the request

//     try {
//         // Step 1: Get all unique student IDs who attended the weekly test
//         const studentIds = await StudentAnswer.findAll({
//             where: { wt_id },
//             attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('student_id')), 'student_id']]
//         });

//         // If no student answers found for this test
//         if (!studentIds || studentIds.length === 0) {
//             return res.status(404).send({ message: 'No students found for this test' });
//         }

//         // Extract student IDs
//         const studentIdsArray = studentIds.map(student => student.student_id);

//         // Step 2: Fetch student details from Students table
//         const students = await Student.findAll({
//             where: {
//                 id: studentIdsArray
//             },
//             attributes: ['id', 'name', 'email', 'phoneNumber']  // Adjust attributes as per your Student model
//         });

//         // Step 3: For each student, check if all attended questions have marks and comments
//         const studentsWithEvaluationStatus = await Promise.all(students.map(async (student) => {
//             // Get all answers for this student in this weekly test
//             const studentAnswers = await StudentAnswer.findAll({
//                 where: {
//                     wt_id,
//                     student_id: student.id
//                 },
//                 attributes: ['marks', 'comment']
//             });

//             // Check if any answer is missing marks or comment
//             const isEvaluationDone = studentAnswers.every(answer => answer.marks !== null && answer.comment !== null);

//             return {
//                 student_id: student.id,
//                 student_name: student.name,
//                 student_email: student.email,
//                 student_phone: student.phoneNumber,
//                 is_evaluation_done: isEvaluationDone
//             };
//         }));

//         return res.status(200).send({
//             message: 'Student evaluation status fetched successfully',
//             students: studentsWithEvaluationStatus
//         });

//     } catch (error) {
//         console.error('Error fetching student evaluation status:', error);
//         return res.status(500).send({
//             message: 'Error fetching student evaluation status',
//             error: error.message
//         });
//     }
// };


const getStudentEvaluationStatusByWeeklyTestId = async (req, res) => {
    const { wt_id } = req.params; // Receive wt_id from the request

    try {
        // Step 1: Get all unique student IDs who attended and finalized the weekly test
        const finalSubmissions = await WeeklyTestFinalSubmission.findAll({
            where: { wt_id, final_submission: true },
            attributes: ['student_id', 'latitude', 'longitude', 'attended_in_institute']
        });

        // Extract student IDs who have finalized their submission
        const studentIdsArray = finalSubmissions.map(sub => sub.student_id);

        // If no final submissions found for this test
        if (!studentIdsArray.length) {
            return res.status(404).send({ message: 'No students with final submission found for this test' });
        }

        // Step 2: Fetch student details
        const students = await Student.findAll({
            where: { id: studentIdsArray },
            attributes: ['id', 'name', 'email', 'phoneNumber']
        });

        // Step 3: Fetch all student answers for this test in one go
        const studentAnswers = await StudentAnswer.findAll({
            where: { wt_id, student_id: studentIdsArray },
            attributes: ['student_id', 'marks', 'comment']
        });

        // Step 4: Process student data
        const studentsWithEvaluationStatus = students.map(student => {
            // Get all answers for the student
            const answers = studentAnswers.filter(ans => ans.student_id === student.id);

            // Check if all answers have marks and comments
            const isEvaluationDone = answers.every(ans => ans.marks !== null && ans.comment !== null);

            // Find final submission details for location info
            const finalSubmission = finalSubmissions.find(sub => sub.student_id === student.id);

            return {
                student_id: student.id,
                student_name: student.name,
                student_email: student.email,
                student_phone: student.phoneNumber,
                is_evaluation_done: isEvaluationDone,
                attended_in_institute: finalSubmission?.attended_in_institute || false,
                latitude: finalSubmission?.latitude || null,
                longitude: finalSubmission?.longitude || null
            };
        });

        return res.status(200).send({
            message: 'Student evaluation status fetched successfully',
            students: studentsWithEvaluationStatus
        });

    } catch (error) {
        console.error('Error fetching student evaluation status:', error);
        return res.status(500).send({
            message: 'Error fetching student evaluation status',
            error: error.message
        });
    }
};


const getUniqueStudentsByWeeklyTestId = async (req, res) => {
    const { wt_id } = req.params;  // Receive wt_id from the request

    try {
        // Step 1: Get all unique student IDs who attended the weekly test
        const studentIds = await StudentAnswer.findAll({
            where: { wt_id },
            attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('student_id')), 'student_id']]
        });

        // If no student answers found for this test
        if (!studentIds || studentIds.length === 0) {
            return res.status(404).send({ message: 'No students found for this test' });
        }

        // Extract unique student IDs
        const uniqueStudentIdsArray = studentIds.map(student => student.student_id);

        // Step 2: Fetch student details from Students table
        const students = await Student.findAll({
            where: {
                id: uniqueStudentIdsArray
            },
            attributes: ['id', 'name', 'email', 'phoneNumber']  // Adjust attributes as per your Student model
        });

        return res.status(200).send({
            message: 'Unique student details fetched successfully',
            students: students  // Returning the array of student details
        });

    } catch (error) {
        console.error('Error fetching unique student details:', error);
        return res.status(500).send({
            message: 'Error fetching unique student details',
            error: error.message
        });
    }
};


const getQuestionDetailsByIdHandler = async (wt_question_id) => {
    try {
        const question = await WeeklyTestQuestion.findOne({
            where: {
                wt_question_id
            },
            include: [
                {
                    model: Topic,  // Include the Topic details
                    as: 'TopicDetails',  // Ensure alias matches the association
                    attributes: ['name']
                }
            ]
        });

        if (!question) {
            throw new Error('Question not found');
        }

        // Format the question details and return them
        return {
            question_id: question.wt_question_id,
            question_text: question.wt_question_description,
            marks: question.marks,
            minutes: question.minutes,
            topic: question.TopicDetails ? question.TopicDetails.name : "Topic not found"
        };

    } catch (error) {
        console.error('Error fetching question details:', error);
        throw error;  // Propagate error for handling in the calling method
    }
};

const getStudentAndTestDetailsByStudentId = async (req, res) => {
    const { wt_id, student_id } = req.params;  // Receive wt_id and student_id from the request

    try {
        // Step 1: Fetch student details from Students table
        const student = await Student.findOne({
            where: {
                id: student_id
            },
            attributes: ['id', 'name', 'email', 'phoneNumber']  // Adjust attributes as per your Student model
        });

        // If no student is found
        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }

        // Step 2: Fetch test details from WeeklyTest table
        const test = await WeeklyTest.findOne({
            where: {
                wt_id: wt_id
            },
            attributes: ['wt_id', 'wt_link', 'test_date', 'wt_description']  // Adjust attributes as per your WeeklyTest model
        });

        // If no test is found
        if (!test) {
            return res.status(404).send({ message: 'Test not found' });
        }

        // Step 3: Send student details and test details in the response
        return res.status(200).send({
            message: 'Student and test details fetched successfully',
            student: {
                student_id: student.id,
                student_name: student.name,
                student_email: student.email,
                student_phone: student.phoneNumber
            },
            test: {
                test_id: test.wt_id,
                test_link: test.wt_link,
                test_date: test.test_date,
                test_date: test.test_date,
                wt_description: test.wt_description
            }
        });

    } catch (error) {
        console.error('Error fetching student and test details:', error);
        return res.status(500).send({
            message: 'Error fetching student and test details',
            error: error.message
        });
    }
};

const getAllActiveWeeklyTests = async (req, res) => {
    try {
        // Find all active weekly tests, including associated topics
        const activeTests = await WeeklyTest.findAll({
            where: {
                is_active: true  // Only fetch active tests
            },
            include: [
                {
                    model: WeeklyTestTopics,
                    as: 'TestWeekly',  // Use the alias 'TestWeekly'
                    include: [
                        {
                            model: Topic,
                            as: 'TopicAssociation'  // Ensure the alias matches the one defined in WeeklyTestTopics
                        }
                    ]
                },
                // {
                //     model: WeeklyTestQuestion,
                //     as: 'TestDetails'  // Alias for the WeeklyTestQuestion association, if needed
                // }
            ]
        });

        if (!activeTests || activeTests.length === 0) {
            return res.status(404).send({ message: 'No active weekly tests found' });
        }

        console.log("All active weekly tests fetched", activeTests);
        return res.status(200).send({ message: 'Active weekly tests fetched successfully', tests: activeTests });
    } catch (error) {
        console.error('Error fetching active weekly tests:', error);
        return res.status(500).send({ message: error.message });
    }
};




const getStudentAndActiveTestsWithAttendance = async (req, res) => {
    const studentId = req.studentId;  

    try {
        // Step 1: Fetch student's batch
        const studentBatch = await db.Student_Batch.findOne({
            where: { student_id: studentId },
            attributes: ['batch_id']
        });

        if (!studentBatch) {
            return res.status(404).send({ message: 'Student batch not found' });
        }

        const batchId = studentBatch.batch_id;

        // Step 2: Fetch active weekly tests related to the student's batch
        const activeTests = await WeeklyTest.findAll({
            where: { is_active: true },
            include: [
                {
                    model: WeeklyTestTopics,
                    as: 'TestWeekly',
                    include: [{ model: Topic, as: 'TopicAssociation' }]
                },
                {
                    model: BatchTestLinks,
                    required: true,  // Ensures only linked batch tests are included
                    where: { batch_id: batchId }  // Filters tests for the student's batch
                }
            ]
        });
        

        if (!activeTests || activeTests.length === 0) {
            return res.status(404).send({ message: 'No active weekly tests found for this batch' });
        }

        // Step 3: Process each test for student attendance & marks
        const testsWithAttendance = await Promise.all(activeTests.map(async (test) => {
            const studentAttendance = await StudentAnswer.findOne({
                where: { wt_id: test.wt_id, student_id: studentId },
                attributes: ['student_id']
            });

            // Fetch student answers for this test
            const studentAnswers = await StudentAnswer.findAll({
                where: { wt_id: test.wt_id, student_id: studentId },
                attributes: ['question_id', 'answer', 'marks']
            });

            let obtainedMarks = 0;
            let totalAvailableMarks = 0;

            if (studentAnswers.length > 0) {
                const existingMarks = studentAnswers.some(answer => answer.marks !== null);

                if (existingMarks) {
                    obtainedMarks = studentAnswers.reduce((total, answer) => total + (Number(answer.marks) || 0), 0);
                } else {
                    // Auto-calculate marks if marks are not present
                    const questionIds = studentAnswers.map(answer => answer.question_id);
                    const studentResponses = studentAnswers.map(answer => answer.answer.toLowerCase());

                    // Fetch questions and their marks
                    const questions = await WeeklyTestQuestion.findAll({
                        where: { wt_question_id: questionIds },
                        attributes: ['wt_question_id', 'marks']
                    });
                    console.log(questions,"-------------------------questions")
                    // Fetch keywords for each question
                    const keywordsData = await WeeklyTestQuestionAnswer.findAll({
                        where: { wt_question_id: questionIds },
                        attributes: ['wt_question_id', 'keywords']
                    });

                    // // Map keywords
                    const keywordsMap = {};
                    keywordsData.forEach(({ wt_question_id, keywords }) => {
                        keywordsMap[wt_question_id] = keywords.toLowerCase().split(',').map(k => k.trim());
                    });

                    // Strip HTML tags and extra spaces
                    const cleanText = (text) => text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

                    // Calculate marks based on keyword matching
                    studentAnswers.forEach(({ question_id, answer }) => {
                        const studentResponse = cleanText(answer.toLowerCase());
                        const keywords = keywordsMap[question_id] || [];

                        // Check if any keyword exists in student response
                        const isCorrect = keywords.some(keyword => studentResponse.includes(keyword));

                        if (isCorrect) {
                            const question = questions.find(q => q.wt_question_id === question_id);
                            obtainedMarks += question ? question.marks : 0;
                        }
                    });
                }
            }

            // Fetch total marks available for this test
            totalAvailableMarks = await WeeklyTestQuestion.sum('marks', {
                where: { wt_question_id: studentAnswers.map(a => a.question_id) }
            });

            return {
                test_id: test.wt_id,
                test_link: test.wt_link,
                test_date: new Date(test.test_date).toLocaleDateString(),
                test_description: test.wt_description,
                has_attended: !!studentAttendance,
                // obtained_marks: studentAttendance ? obtainedMarks : null,
                // total_available_marks: totalAvailableMarks
            };
        }));

        // Step 4: Fetch student details
        const student = await Student.findOne({
            where: { id: studentId },
            attributes: ['id', 'name', 'email', 'phoneNumber']
        });

        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }

        // Count number of tests attended
        const attendedTestsCount = testsWithAttendance.filter(test => test.has_attended).length;

        return res.status(200).send({
            message: 'Student and active test details fetched successfully',
            student: {
                student_id: student.id,
                student_name: student.name,
                student_email: student.email,
                student_phone: student.phoneNumber,
                attended_tests_count: attendedTestsCount
            },
            active_tests: testsWithAttendance
        });

    } catch (error) {
        console.error('Error fetching student and active test details:', error);
        return res.status(500).send({ message: 'Error fetching details', error: error.message });
    }
};



const getStudentsWeeklyTestDetailedSummary = async (req, res) => {
    const { wt_id} = req.params;  // Receive wt_id 
    const student_id = req.studentId;
    try {
        // Step 1: Get all the question IDs associated with the provided wt_id
        const questionMappings = await WeeklyTestQuestionMapping.findAll({
            where: { wt_id },
            attributes: ['wt_question_id']  // Only select the question IDs
        });

        // If no question mappings found
        if (!questionMappings || questionMappings.length === 0) {
            return res.status(404).send({ message: 'No questions found for this test' });
        }

        // Extract question IDs
        const questionIds = questionMappings.map(mapping => mapping.wt_question_id);

        // Step 2: Fetch questions along with associated topic details
        const questions = await WeeklyTestQuestion.findAll({
            where: {
                wt_question_id: questionIds
            },
            include: [
                {
                    model: Topic,  // Include topic details in the query
                    as: 'TopicDetails',  // Alias used in associations
                    attributes: ['name']  // Include topic name
                }
            ]
        });

        // Step 3: For each question, get the answer provided by the given student
        const questionsWithAnswers = await Promise.all(questions.map(async (question) => {
            const questionId = question.wt_question_id;

            // Get the student's answer for this particular question
            const studentAnswer = await StudentAnswer.findOne({
                where: {
                    wt_id,
                    question_id: questionId,
                    student_id
                },
                attributes: ['answer', 'marks', 'comment']
            });

            // If no answer exists for this question by this student, mark it as "Not Attempted"
            const answerData = studentAnswer ? {
                student_id,
                answer: studentAnswer.answer,
                marks: studentAnswer.marks,
                comment: studentAnswer.comment
            } : {
                student_id,
                answer: "Not Attempted",
                marks: null,
                comment: null
            };

            return {
                question_id: questionId,
                question_text: question.wt_question_description,  // Assuming the question description is stored in this field
                marks: question.marks,
                minutes: question.minutes,
                topic: question.TopicDetails ? question.TopicDetails.name : null,  // Include topic details
                studentAnswer: answerData  // Send only the student's answer for this question
            };
        }));

        return res.status(200).send({
            message: 'Questions and answers fetched successfully',
            questions: questionsWithAnswers
        });

    } catch (error) {
        console.error('Error fetching questions and answers:', error);
        return res.status(500).send({
            message: 'Error fetching questions and answers',
            error: error.message
        });
    }
};

const getAllStudentResultsForWeeklyTest = async (req, res) => {
    const { wt_id } = req.params;  // Assuming wt_id is passed as a route parameter

    try {
        // Step 1: Fetch the details of the weekly test
        const weeklyTest = await WeeklyTest.findByPk(wt_id);
        
        if (!weeklyTest) {
            return res.status(404).send({ message: 'Weekly test not found' });
        }

        // Step 2: Fetch all student results for the specified weekly test
        const studentResults = await StudentAnswer.findAll({
            where: {
                wt_id: wt_id
            },
            include: [
                {
                    model: Student,
                    as:'Student',
                    attributes: ['id', 'name', 'email', 'phoneNumber']
                }
            ]
        });

        // Step 3: Prepare the response format
        const resultsFormatted = studentResults.map(result => ({
            student_id: result.Student.id,
            student_name: result.Student.name,
            student_email: result.Student.email,
            student_phone: result.Student.phoneNumber,
            marks_obtained: result.marks  // Assuming marks is a field in StudentAnswer table
        }));

        // Step 4: Send the response with student results for the weekly test
        return res.status(200).send({
            message: 'Student results fetched successfully for the weekly test',
            weekly_test: {
                test_id: weeklyTest.wt_id,
                test_link: weeklyTest.wt_link,
                test_date: new Date(weeklyTest.test_date).toLocaleDateString(),
                test_description: weeklyTest.wt_description
            },
            student_results: resultsFormatted
        });

    } catch (error) {
        console.error('Error fetching student results for weekly test:', error);
        return res.status(500).send({
            message: 'Error fetching student results for weekly test',
            error: error.message
        });
    }
};


// const getAllIndividualStudentResultsForTest = async (req, res) => {
//     const { wt_id } = req.params;

//     try {
//         // Step 1: Fetch the weekly test details
//         const weeklyTest = await WeeklyTest.findByPk(wt_id, {
//             include: [
//                 {
//                     model: WeeklyTestTopics,
//                     as: 'TestWeekly',
//                     include: [
//                         {
//                             model: Topic,
//                             as: 'TopicAssociation'
//                         }
//                     ]
//                 }
//             ]
//         });

//         if (!weeklyTest) {
//             return res.status(404).send({ message: 'Weekly test not found' });
//         }

//         // Step 2: Calculate total available marks for the test
//         const questionMappings = await WeeklyTestQuestionMapping.findAll({
//             where: { wt_id },
//             attributes: ['wt_question_id']
//         });

//         const questionIds = questionMappings.map(mapping => mapping.wt_question_id);

//         const questions = await WeeklyTestQuestion.findAll({
//             where: { wt_question_id: questionIds },
//             attributes: ['wt_question_id', 'marks']
//         });

//         const totalAvailableMarks = questions.reduce((total, question) => total + (Number(question.marks) || 0), 0);

//         // Step 3: Fetch student answers
//         const studentAnswers = await StudentAnswer.findAll({
//             where: { wt_id },
//             include: [
//                 {
//                     model: Student,
//                     as: 'Student',
//                     attributes: ['id', 'name', 'email', 'phoneNumber']
//                 }
//             ]
//         });

//         // Step 4: Fetch keywords for auto-marking if marks are missing
//         const keywordsData = await WeeklyTestQuestionAnswer.findAll({
//             where: { wt_question_id: questionIds },
//             attributes: ['wt_question_id', 'keywords']
//         });

//         const keywordsMap = {};
//         keywordsData.forEach(({ wt_question_id, keywords }) => {
//             keywordsMap[wt_question_id] = keywords.toLowerCase().split(',').map(k => k.trim());
//         });

//         const stripHtmlTags = (html) => html.replace(/<[^>]*>/g, '').trim();

//         // Step 5: Calculate student marks
//         const studentResults = studentAnswers.reduce((acc, answer) => {
//             const studentId = answer.student_id;
//             if (!acc[studentId]) {
//                 acc[studentId] = {
//                     student_id: answer.Student.id,
//                     student_name: answer.Student.name,
//                     student_email: answer.Student.email,
//                     student_phone: answer.Student.phoneNumber,
//                     obtained_marks: 0
//                 };
//             }

//             if (answer.marks !== null) {
//                 acc[studentId].obtained_marks += Number(answer.marks) || 0;
//             } else {
//                 // Auto-calculate marks if missing
//                 const studentResponse = stripHtmlTags(answer.answer).toLowerCase();
//                 const keywords = keywordsMap[answer.question_id] || [];

//                 // Check if the student response contains any of the expected keywords
//                 const matchedKeywords = keywords.some(keyword => studentResponse.includes(keyword));
//                 if (matchedKeywords) {
//                     const question = questions.find(q => q.wt_question_id === answer.question_id);
//                     acc[studentId].obtained_marks += question ? Number(question.marks) : 0;
//                 }
//             }

//             return acc;
//         }, {});

//         const resultsFormatted = Object.values(studentResults).map(result => ({
//             ...result,
//             total_available_marks: totalAvailableMarks
//         }));

//         return res.status(200).send({
//             message: 'Individual student results fetched successfully for the weekly test',
//             weekly_test: {
//                 test_id: weeklyTest.wt_id,
//                 test_link: weeklyTest.wt_link,
//                 test_date: new Date(weeklyTest.test_date).toLocaleDateString(),
//                 test_description: weeklyTest.wt_description,
//                 total_available_marks: totalAvailableMarks // Displaying total marks before exam
//             },
//             student_results: resultsFormatted
//         });

//     } catch (error) {
//         console.error('Error fetching individual student results:', error);
//         return res.status(500).send({
//             message: 'Error fetching individual student results',
//             error: error.message
//         });
//     }
// };

const getAllIndividualStudentResultsForTest = async (req, res) => {
    const { wt_id } = req.params;

    try {
        // Step 1: Fetch the weekly test details
        const weeklyTest = await WeeklyTest.findByPk(wt_id, {
            include: [
                {
                    model: WeeklyTestTopics,
                    as: 'TestWeekly',
                    include: [
                        {
                            model: Topic,
                            as: 'TopicAssociation'
                        }
                    ]
                }
            ]
        });

        if (!weeklyTest) {
            return res.status(404).send({ message: 'Weekly test not found' });
        }

        // Step 2: Calculate total available marks for the test
        const questionMappings = await WeeklyTestQuestionMapping.findAll({
            where: { wt_id },
            attributes: ['wt_question_id']
        });

        const questionIds = questionMappings.map(mapping => mapping.wt_question_id);

        const questions = await WeeklyTestQuestion.findAll({
            where: { wt_question_id: questionIds },
            attributes: ['wt_question_id', 'marks']
        });

        const totalAvailableMarks = questions.reduce((total, question) => total + (Number(question.marks) || 0), 0);
          console.log(totalAvailableMarks,"----------------totalAvailableMarks")
        // Step 3: Fetch student answers
        const studentAnswers = await StudentAnswer.findAll({
            where: { wt_id },
            include: [
                {
                    model: Student,
                    as: 'Student',
                    attributes: ['id', 'name', 'email', 'phoneNumber']
                }
            ]
        });

        // Step 4: Fetch WeeklyTestFinalSubmission details for students
        const finalSubmissions = await WeeklyTestFinalSubmission.findAll({
            where: { wt_id },
            attributes: ['student_id', 'final_submission', 'latitude', 'longitude', 'attended_in_institute']
        });

        // Convert final submissions into a lookup object
        const finalSubmissionsMap = {};
        finalSubmissions.forEach(sub => {
            finalSubmissionsMap[sub.student_id] = {
                final_submission: sub.final_submission,
                latitude: sub.latitude,
                longitude: sub.longitude,
                attended_in_institute: sub.attended_in_institute
            };
        });

        // Step 5: Calculate student marks
        const studentResults = studentAnswers.reduce((acc, answer) => {
            const studentId = answer.student_id;
            if (!acc[studentId]) {
                acc[studentId] = {
                    student_id: answer.Student.id,
                    student_name: answer.Student.name,
                    student_email: answer.Student.email,
                    student_phone: answer.Student.phoneNumber,
                    obtained_marks: 0,
                    final_submission: false, // Default value
                    latitude: null,
                    longitude: null,
                    attended_in_institute: false,
                    // total_available_marks: totalAvailableMarks
                };
            }

            if (answer.marks !== null) {
                acc[studentId].obtained_marks += Number(answer.marks) || 0;
            }

            // Add final submission details if available
            if (finalSubmissionsMap[studentId]) {
                acc[studentId] = {
                    ...acc[studentId],
                    ...finalSubmissionsMap[studentId] // Merge submission details
                };
            }

            return acc;
        }, {});

        const resultsFormatted = Object.values(studentResults).map(result => ({
            ...result,
            total_available_marks: totalAvailableMarks
        }));

        return res.status(200).send({
            message: 'Individual student results fetched successfully for the weekly test',
            weekly_test: {
                test_id: weeklyTest.wt_id,
                test_link: weeklyTest.wt_link,
                test_date: new Date(weeklyTest.test_date).toLocaleDateString(),
                test_description: weeklyTest.wt_description,
                total_available_marks: totalAvailableMarks // Displaying total marks before exam
            },
            student_results: resultsFormatted
        });

    } catch (error) {
        console.error('Error fetching individual student results:', error);
        return res.status(500).send({
            message: 'Error fetching individual student results',
            error: error.message
        });
    }
};


// const getAllIndividualStudentResultsForTest = async (req, res) => {
//     const { wt_id } = req.params;

//     try {
//         // Step 1: Fetch the weekly test details
//         const weeklyTest = await WeeklyTest.findByPk(wt_id, {
//             include: [
//                 {
//                     model: WeeklyTestTopics,
//                     as: 'TestWeekly',
//                     include: [
//                         {
//                             model: Topic,
//                             as: 'TopicAssociation'
//                         }
//                     ]
//                 }
//             ]
//         });

//         if (!weeklyTest) {
//             return res.status(404).send({ message: 'Weekly test not found' });
//         }

//         // Step 2: Calculate total available marks for the test
//         const questionMappings = await WeeklyTestQuestionMapping.findAll({
//             where: { wt_id },
//             attributes: ['wt_question_id']
//         });

//         const questionIds = questionMappings.map(mapping => mapping.wt_question_id);

//         const questions = await WeeklyTestQuestion.findAll({
//             where: { wt_question_id: questionIds },
//             attributes: ['wt_question_id', 'marks']
//         });

//         const totalAvailableMarks = questions.reduce((total, question) => total + (Number(question.marks) || 0), 0);

//         // Step 3: Fetch student answers
//         const studentAnswers = await StudentAnswer.findAll({
//             where: { wt_id },
//             include: [
//                 {
//                     model: Student,
//                     as: 'Student',
//                     attributes: ['id', 'name', 'email', 'phoneNumber']
//                 }
//             ]
//         });

//         // Step 4: Fetch WeeklyTestFinalSubmission details for students
//         const finalSubmissions = await WeeklyTestFinalSubmission.findAll({
//             where: { wt_id },
//             attributes: ['student_id', 'final_submission', 'latitude', 'longitude', 'attended_in_institute']
//         });

//         // Convert final submissions into a lookup object
//         const finalSubmissionsMap = {};
//         finalSubmissions.forEach(sub => {
//             finalSubmissionsMap[sub.student_id] = {
//                 final_submission: sub.final_submission,
//                 latitude: sub.latitude,
//                 longitude: sub.longitude,
//                 attended_in_institute: sub.attended_in_institute
//             };
//         });

//         // Step 5: Fetch keywords for auto-marking if marks are missing
//         const keywordsData = await WeeklyTestQuestionAnswer.findAll({
//             where: { wt_question_id: questionIds },
//             attributes: ['wt_question_id', 'keywords']
//         });

//         const keywordsMap = {};
//         keywordsData.forEach(({ wt_question_id, keywords }) => {
//             keywordsMap[wt_question_id] = keywords.toLowerCase().split(',').map(k => k.trim());
//         });

//         const stripHtmlTags = (html) => html.replace(/<[^>]*>/g, '').trim();

//         // Step 6: Calculate student marks
//         const studentResults = studentAnswers.reduce((acc, answer) => {
//             const studentId = answer.student_id;
//             if (!acc[studentId]) {
//                 acc[studentId] = {
//                     student_id: answer.Student.id,
//                     student_name: answer.Student.name,
//                     student_email: answer.Student.email,
//                     student_phone: answer.Student.phoneNumber,
//                     obtained_marks: 0,
//                     final_submission: false, // Default value
//                     latitude: null,
//                     longitude: null,
//                     attended_in_institute: false
//                 };
//             }

//             if (answer.marks !== null) {
//                 acc[studentId].obtained_marks += Number(answer.marks) || 0;
//             } else {
//                 // Auto-calculate marks if missing
//                 const studentResponse = stripHtmlTags(answer.answer).toLowerCase();
//                 const keywords = keywordsMap[answer.question_id] || [];

//                 // Check if the student response contains any of the expected keywords
//                 const matchedKeywords = keywords.some(keyword => studentResponse.includes(keyword));
//                 if (matchedKeywords) {
//                     const question = questions.find(q => q.wt_question_id === answer.question_id);
//                     acc[studentId].obtained_marks += question ? Number(question.marks) : 0;
//                 }
//             }

//             // Add final submission details if available
//             if (finalSubmissionsMap[studentId]) {
//                 acc[studentId] = {
//                     ...acc[studentId],
//                     ...finalSubmissionsMap[studentId] // Merge submission details
//                 };
//             }

//             return acc;
//         }, {});

//         const resultsFormatted = Object.values(studentResults).map(result => ({
//             ...result,
//             total_available_marks: totalAvailableMarks
//         }));

//         return res.status(200).send({
//             message: 'Individual student results fetched successfully for the weekly test',
//             weekly_test: {
//                 test_id: weeklyTest.wt_id,
//                 test_link: weeklyTest.wt_link,
//                 test_date: new Date(weeklyTest.test_date).toLocaleDateString(),
//                 test_description: weeklyTest.wt_description,
//                 total_available_marks: totalAvailableMarks // Displaying total marks before exam
//             },
//             student_results: resultsFormatted
//         });

//     } catch (error) {
//         console.error('Error fetching individual student results:', error);
//         return res.status(500).send({
//             message: 'Error fetching individual student results',
//             error: error.message
//         });
//     }
// };


const getStudentAndActiveTestsWithAttendanceForAdmin = async (req, res) => {
    const { studentId } = req.params;
    console.log("student id ", studentId)
    try {
        // Step 1: Fetch all active weekly tests
        const activeTests = await WeeklyTest.findAll({
            where: {
                is_active: true  // Only fetch active tests
            },
            include: [
                {
                    model: WeeklyTestTopics,
                    as: 'TestWeekly',
                    include: [
                        {
                            model: Topic,
                            as: 'TopicAssociation'
                        }
                    ]
                }
            ]
        });

        // If no active tests are found
        if (!activeTests || activeTests.length === 0) {
            return res.status(404).send({ message: 'No active weekly tests found' });
        }

        // Step 2: Check attendance, obtained marks, and total available marks for each test
        const testsWithAttendance = await Promise.all(activeTests.map(async (test) => {
            // Check if the student attended this test
            const studentAttendance = await StudentAnswer.findOne({
                where: {
                    wt_id: test.wt_id,
                    student_id: studentId  // Check for this specific student in the weekly test
                },
                attributes: ['student_id']  // Only need the student_id to check attendance
            });

            // Calculate the obtained marks for this test
            const studentMarks = await StudentAnswer.findAll({
                where: {
                    wt_id: test.wt_id,
                    student_id: studentId
                },
                attributes: ['marks']  // Fetch only the marks
            });

            // Sum up the obtained marks
            const totalObtainedMarks = studentMarks.reduce((total, answer) => total + (answer.marks || 0), 0);

            // Step 3: Calculate total available marks for this test
            const questionMappings = await WeeklyTestQuestionMapping.findAll({
                where: { wt_id: test.wt_id },
                attributes: ['wt_question_id']
            });

            const questionIds = questionMappings.map(mapping => mapping.wt_question_id);

            const questions = await WeeklyTestQuestion.findAll({
                where: { wt_question_id: questionIds },
                attributes: ['marks']
            });

            // Sum up total available marks
            const totalAvailableMarks = questions.reduce((total, question) => total + question.marks, 0);

            // Mark whether the student attended or not
            const hasAttended = studentAttendance ? true : false;

            return {
                test_id: test.wt_id,
                test_link: test.wt_link,
                test_date: new Date(test.test_date).toLocaleDateString(),
                test_description: test.wt_description,
                has_attended: hasAttended,
                obtained_marks: hasAttended ? totalObtainedMarks : null,  // Only include marks if attended
                total_available_marks: totalAvailableMarks  // Include total available marks
            };
        }));

        // Step 4: Fetch student details
        const student = await Student.findOne({
            where: {
                id: studentId
            },
            attributes: ['id', 'name', 'email', 'phoneNumber']
        });

        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }

        // Step 5: Count number of tests attended by the student
        const attendedTestsCount = testsWithAttendance.filter(test => test.has_attended).length;

        // Step 6: Send the response with active test details, attendance status, obtained marks, and total available marks
        return res.status(200).send({
            message: 'Student and active test details fetched successfully',
            student: {
                student_id: student.id,
                student_name: student.name,
                student_email: student.email,
                student_phone: student.phoneNumber,
                attended_tests_count: attendedTestsCount  // Add the count of attended tests
            },
            active_tests: testsWithAttendance
        });

    } catch (error) {
        console.error('Error fetching student and active test details:', error);
        return res.status(500).send({
            message: 'Error fetching student and active test details',
            error: error.message
        });
    }
};


const deleteinternaltests = async (req, res) => {
    try {
        const { wt_id } = req.params;

        // 1. Check and delete `weeklytestfinalsubmissions` if any exist
        const finalSubmissions = await db.WeeklyTestFinalSubmission.findAll({
            where: { wt_id: wt_id }
        });

        if (finalSubmissions.length > 0) {
            await db.WeeklyTestFinalSubmission.destroy({
                where: { wt_id: wt_id }
            });
            console.log(`Deleted associated WeeklyTestFinalSubmissions for wt_id: ${wt_id}`);
        }

        // 2. Delete records from `studentanswers` before removing the weekly test
        await db.StudentAnswer.destroy({
            where: { wt_id: wt_id }
        });

        console.log(`Deleted associated StudentAnswers for wt_id: ${wt_id}`);

        // 3. Delete associated BatchTestLinks (child records)
        await db.BatchTestLinks.destroy({
            where: { wt_id: wt_id }
        });

        console.log(`Deleted associated BatchTestLinks for wt_id: ${wt_id}`);

        // 4. Find and delete the WeeklyTest record
        const test = await db.WeeklyTest.findByPk(wt_id);
        console.log(test, "----------------test");

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        await test.destroy();

        return res.status(200).json({ message: 'Test and associated data deleted successfully' });

    } catch (error) {
        console.error('Error deleting internal test:', error);
        return res.status(500).json({ message: 'Something went wrong while deleting the test' });
    }
};


// Controller method to get and update final submission status
const checkAndSubmitTest = async (req, res) => {
    const { student_id, wt_id } = req.body;
  
    try {
      // Check if the record exists based on student_id and wt_id
      const existingRecord = await WeeklyTestFinalSubmission.findOne({
        where: { student_id, wt_id },
      });
  
      // If no record is found
      if (!existingRecord) {
        return res.status(200).json({ message: "Test not submitted." });
      }
  
      // Check if the test is already submitted
      if (existingRecord.final_submission) {
        return res.status(200).json({
          message: "Test already submitted.",
          result: existingRecord,
        });
      }
      
    } catch (error) {
      console.error("Error checking or submitting test:", error);
      return res.status(500).json({
        message: "Internal server error while checking test submission.",
        error: error.message,
      });
    }
  };
  
  const updateEvaluationStatus = async (req, res) => {
    const { student_id, test_id, evaluation } = req.body;
     console.log(req.body,"-----------------------------------")
    try {
      // Check if the record exists based on student_id and wt_id
      const existingRecord = await WeeklyTestFinalSubmission.findOne({
        where: { student_id, wt_id :test_id },
      });
        
      console.log(existingRecord,"-----------------------------------")
      if (!existingRecord) {
        return res.status(404).json({ message: "Record not found." });
      }
  
      // Update the evaluation column based on the received value
      await existingRecord.update({
        evaluation: evaluation === true ? 1 : 0,
      });
  
      return res.status(200).json({
        message: "Evaluation status updated successfully.",
        result: existingRecord,
      });
    } catch (error) {
      console.error("Error updating evaluation status:", error);
      return res.status(500).json({
        message: "Internal server error.",
        error: error.message,
      });
    }
  };



module.exports = {
    createWeeklyTestLink,
    updateWeeklyTest,
    getWeeklyTestById,
    getAllWeeklyTests,
    saveQuestionHandler,
    getQuestionsByWeeklyTestId,
    getQuestionsByTopicId,
    getQuestionById,
    updateQuestionById,
    deleteQuestionById,
    assignQuestionsToTestHandler,
    saveAndAssignQuestionsFromExcel,
    saveStudentAnswer,
    getStudentAnswer,
    updateQuestionHandler,
    saveFinalSubmission,
    saveAnswerFortheQuestion,
    getCorrectAnswerForQuestion,
    getStudentAnswerAndQuestion,  
    getQuestionAnswerDataByStudentId, 
    getStudentDetailsByWeeklyTestId,
    getStudentEvaluationStatusByWeeklyTestId,
    getUniqueStudentsByWeeklyTestId,
    updateMarksAndCommentByStudentId,
    getStudentAndTestDetailsByStudentId,
    getAllActiveWeeklyTests,
    getStudentAndActiveTestsWithAttendance,
    getStudentAndActiveTestsWithAttendanceForAdmin,
    getStudentsWeeklyTestDetailedSummary,
    getAllStudentResultsForWeeklyTest,
    getAllIndividualStudentResultsForTest,
    deleteinternaltests,
    checkAndSubmitTest,
    updateEvaluationStatus,
}