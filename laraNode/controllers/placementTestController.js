const db = require('../models');
const xlsx = require('xlsx');

const {Op} = require('sequelize');
const Student = db.Student;
const PlacementTest = db.PlacementTest;
const PlacementTestTopic = db.PlacementTestTopic;
const PlacementTestStudent = db.PlacementTestStudent;
const Topic = db.Topic;
const PlacementTestResult = db.PlacementTestResult;
const CumulativeQuestion = db.CumulativeQuestion;
const CumulativeQuestionPlacementTest = db.CumulativeQuestionPlacementTest;
const OptionsTable = db.Option;
const { baseURL } = require('./baseURLConfig')


const jwtSecret = process.env.JWT_SECRET;
// const CryptoJS = require('crypto-js');

// const createPlacementTestLink = async (req, res) => {
//     try {
//         const { number_of_questions, description, start_time, end_time, show_result, topic_ids } = req.body;

//         if (!number_of_questions || !start_time || !end_time || !Array.isArray(topic_ids) || topic_ids.length === 0) {
//             return res.status(400).send({ message: 'Required fields are missing or invalid' });
//         }

//         // Validate that all provided topic_ids exist in the topics table
//         const topics = await Topic.findAll({
//             where: {
//                 topic_id: topic_ids
//             }
//         });

//         if (topics.length !== topic_ids.length) {
//             return res.status(400).send({ message: 'One or more topic IDs are invalid' });
//         }

//         const newTest = await PlacementTest.create({
//             test_link: '', // Initially empty, will be updated later
//             number_of_questions,
//             description,
//             start_time, // Store as string
//             end_time, // Store as string
//             show_result: show_result !== undefined ? show_result : true // Default to true if not provided
//         });

//         // Encrypt the test ID using AES encryption
//         // const encryptedTestId = CryptoJS.AES.encrypt(newTest.placement_test_id.toString(), jwtSecret).toString();

//         // Generate the test link with the encrypted test ID
//         // const test_link = `${baseURL}/${encodeURIComponent(encryptedTestId)}`;
//         const test_link = `${baseURL}/test/${newTest.placement_test_id}`;

//         // Update the test link in the database
//         newTest.test_link = test_link;
//         await newTest.save();

//         // Save the topic IDs in the PlacementTestTopic table
//         const topicPromises = topic_ids.map(topic_id =>
//             PlacementTestTopic.create({
//                 placement_test_id: newTest.placement_test_id,
//                 topic_id
//             })
//         );

//         await Promise.all(topicPromises);

//         return res.status(200).send({ message: 'Placement test added successfully', newTest });
//     } catch (error) {
//         console.error('Error creating placement test link:', error.stack);
//         return res.status(500).send({ message: error.message });
//     }
// };

const createPlacementTestLink = async (req, res) => {
    try {
        const { number_of_questions, description, start_time, end_time, show_result, topic_ids } = req.body;

        if (!number_of_questions || !start_time || !end_time || !Array.isArray(topic_ids) || topic_ids.length === 0) {
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

        // Create a new PlacementTest
        const newTest = await PlacementTest.create({
            test_link: '', // Initially empty, will be updated later
            number_of_questions,
            description,
            start_time, // Store as string
            end_time, // Store as string
            show_result: show_result !== undefined ? show_result : true // Default to true if not provided
        });

        // Generate the test link with the placement_test_id
        const test_link = `${baseURL}/test/${newTest.placement_test_id}`;
        newTest.test_link = test_link;
        await newTest.save();

        // Save the topic IDs in the PlacementTestTopic table
        const topicPromises = topic_ids.map(topic_id =>
            PlacementTestTopic.create({
                placement_test_id: newTest.placement_test_id,
                topic_id
            })
        );

        await Promise.all(topicPromises);

        // Distribute questions among the selected topics
        const questionsPerTopic = Math.floor(number_of_questions / topic_ids.length);
        const remainderQuestions = number_of_questions % topic_ids.length;

        for (let i = 0; i < topic_ids.length; i++) {
            const topicId = topic_ids[i];
            let questionsToFetch = questionsPerTopic;

            if (i < remainderQuestions) {
                questionsToFetch += 1;
            }

            // Fetch and associate questions with the test
            const questions = await CumulativeQuestion.findAll({
                where: {
                    topic_id: topicId,
                    test_id: null // Only fetch questions not yet associated with any test
                },
                limit: questionsToFetch,
                order: db.sequelize.random()
            });

            for (const question of questions) {
                await question.update({ test_id: newTest.placement_test_id });
            }
        }
        console.log("newly created test ", newTest)
        return res.status(200).send({ message: 'Placement test added successfully', newTest });
    } catch (error) {
        console.error('Error creating placement test link:', error.stack);
        return res.status(500).send({ message: error.message });
    }
};


// Function to decrypt the encrypted test ID
const decryptTestId = (encryptedTestId) => {
    try {
        console.log('Encrypted Test ID:', encryptedTestId); // Log the encrypted test ID

        const bytes = CryptoJS.AES.decrypt(encryptedTestId, jwtSecret);
        const originalTestId = bytes.toString(CryptoJS.enc.Utf8);

        console.log('Decrypted Test ID:', originalTestId); // Log the decrypted test ID

        if (!originalTestId || isNaN(parseInt(originalTestId, 10))) {
            throw new Error('Decrypted test ID is not valid');
        }

        return parseInt(originalTestId, 10);
    } catch (error) {
        console.error('Error decrypting test ID:', error.stack);
        throw new Error('Invalid encrypted Test ID');
    }
};

const fetchTestTopicIdsAndQnNums = async (req, res) => {
    try {
        const { encrypted_test_id } = req.body; // Assuming you receive the encrypted test ID

        if (!encrypted_test_id) {
            return res.status(400).send({ message: 'Encrypted Test ID is required' });
        }

        const activeTest = await PlacementTest.findByPk(encrypted_test_id);
        if(!activeTest){
            return res.status(404).send({message: "Test Not Found"})
        }
        // console.log('ACtive test ', activeTest)
        if(!activeTest.is_Active){
            return res.status(403).send({message:"Access Forbidden"})
        }
        // // Decrypt the test ID
        // let test_id;
        // try {
        //     test_id = decryptTestId(encrypted_test_id);
        // } catch (error) {
        //     console.error('Error decrypting test ID:', error.stack);
        //     return res.status(400).send({ message: 'Invalid encrypted Test ID' });
        // }

        // Fetch all topic IDs associated with the decrypted test_id from PlacementTestTopic
        const placementTestTopics = await PlacementTestTopic.findAll({
            where: {
                // placement_test_id: test_id
                placement_test_id: encrypted_test_id
            },
            attributes: ['topic_id'] // Only fetch topic_id
        });

        // Fetch number_of_questions from PlacementTest table
        const placementTest = await PlacementTest.findByPk(encrypted_test_id, {
            attributes: ['number_of_questions', 'show_result'] // Only fetch number_of_questions
        });

        if (!placementTest) {
            return res.status(404).send({ message: 'Placement test not found' });
        }

        const topic_ids = placementTestTopics.map(topic => topic.topic_id);

        return res.status(200).send({
            message: 'Placement test details retrieved successfully',
            topic_ids,
            number_of_questions: placementTest.number_of_questions,
            show_result: placementTest.show_result,
            // start_time: PlacementTest.start_time,
            // end_time: PlacementTest.end_time
        });
    } catch (error) {
        console.error('Error fetching test details:', error.stack);
        return res.status(500).send({ message: error.message });
    }
};

const fetchQuestionsByTopicIds = async (req, res) => {
    try {
        const { encrypted_test_id } = req.body;
        console.log('encrypted test ', encrypted_test_id)

        if (!encrypted_test_id) {
            return res.status(400).send({ message: 'Encrypted Test ID is required' });
        }

        const activeTest = await PlacementTest.findByPk(encrypted_test_id);
        if (!activeTest) {
            return res.status(404).send({ message: 'Test Not Found' });
        }

        if (!activeTest.is_Active) {
            return res.status(403).send({ message: 'Access Forbidden' });
        }

        // Fetch all topic IDs associated with the decrypted test_id from PlacementTestTopic
        const placementTestTopics = await PlacementTestTopic.findAll({
            where: { placement_test_id: encrypted_test_id },
            attributes: ['topic_id'] // Only fetch topic_id
        });

        if (!placementTestTopics.length) {
            return res.status(404).send({ message: 'No topics found for this test' });
        }

        const topic_ids = placementTestTopics.map(topic => topic.topic_id);

        // Fetch number_of_questions and show_result from PlacementTest table
        const placementTest = await PlacementTest.findByPk(encrypted_test_id, {
            attributes: ['number_of_questions', 'show_result'] // Only fetch number_of_questions and show_result
        });

        if (!placementTest) {
            return res.status(404).send({ message: 'Placement test not found' });
        }

        // Fetch questions from CumulativeQuestion table using the topic_ids
        const questions = await CumulativeQuestion.findAll({
            where: { topic_id: topic_ids }
            // attributes: ['cumulative_question_id', 'question_description', 'topic_id', 'correct_answer'] // Adjust attributes as per your schema
        });

        return res.status(200).send({
            message: 'Placement test details retrieved successfully',
            topic_ids,
            number_of_questions: placementTest.number_of_questions,
            show_result: placementTest.show_result,
            questions, // Include the questions in the response
        });
    } catch (error) {
        console.error('Error fetching test details:', error.stack);
        return res.status(500).send({ message: error.message });
    }
};

const fetchQuestionsUsingTopicId = async (req, res) => {
    try {
        const { topic_id } = req.body; // Receive topic_id from request body
        console.log('Topic ID:', topic_id);

        if (!topic_id) {
            return res.status(400).send({ message: 'Topic ID is required' });
        }

        // Fetch questions from CumulativeQuestion table using the provided topic_id
        const questions = await CumulativeQuestion.findAll({
            where: { topic_id },
            // attributes: ['cumulative_question_id', 'question_description', 'topic_id', 'correct_answer'] // Adjust attributes as per your schema
        });

        if (!questions.length) {
            return res.status(404).send({ message: 'No questions found for this topic' });
        }

        return res.status(200).send({
            message: 'Questions retrieved successfully',
            questions,
        });
    } catch (error) {
        console.error('Error fetching questions:', error.stack);
        return res.status(500).send({ message: error.message });
    }
};

const savePlacementTestResults = async (req, res) => {
    try {
        const { placement_test_id, placement_test_student_id, marks_obtained, total_marks } = req.body;

        // // Decrypt the placement_test_id
        // let test_id;
        // try {
        //     test_id = decryptTestId(placement_test_id);
        // } catch (error) {
        //     console.error('Error decrypting test ID:', error.stack);
        //     return res.status(400).send({ message: 'Invalid encrypted Test ID' });
        // }

        // Check if there is already a result for this combination
        const existingResult = await PlacementTestResult.findOne({
            where: {
                // placement_test_id: test_id,
                placement_test_id,
                placement_test_student_id,
            },
        });

        if (existingResult) {
            return res.status(400).send({ message: "You have already attended this test." });
        }

        // Check if the student exists
        const placementStudent = await PlacementTestStudent.findByPk(placement_test_student_id);
        if (!placementStudent) {
            return res.status(404).send({ message: "Student Not Available" });
        }

        // Save the test results
        const testResults = await PlacementTestResult.create({
            placement_test_id,
            placement_test_student_id,
            marks_obtained,
            total_marks
        });

        return res.status(200).send(testResults);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


  
  const getAllResults = async(req, res) => {
      try {
        //   const student_id = req.student_id;
        //   const student = await Student.findByPk(student_id);
        //   const role = student.role;
  
        //   if (role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN')
        //       return res.status(403).send({ message: 'Access Forbidden' });
  
          const placementResults = await PlacementTestResult.findAll();
          if(!placementResults){
              return res.status(404).send({message: "No Test Results Available"})
          }
  
          return res.status(200).send(placementResults)
  
      } catch (error) {
          return res.status(500).send({ message: error.message });
      }
  }

  const getPlacementTestById = async (req, res) =>{
    try{
        const { placement_test_id } = req.body;

        if (!placement_test_id) {
            return res.status(400).send({ message: 'placement_test_id is required' });
        }

        const placementTest = await PlacementTest.findByPk(placement_test_id);

        if(!placementTest){
            return res.status(404).send({message:'No placement Test link found for the id'})
        }

        return res.status(200).send(placementTest)

    }catch(error){
        console.error('Error retrieving placement tests:', error);
        return res.status(500).send({ message: error.message });
    }
  }

  const getAllPlacementTests = async (req, res) => {
    try {
        const placementTests = await PlacementTest.findAll({
            include: [
                {
                    model: PlacementTestTopic,
                    as: 'TestTopics',
                    include: [
                        {
                            model: Topic,
                            as: 'PlacementTestTopic', // Use the correct alias
                            attributes: ['topic_id', 'createdAt', 'updatedAt']
                        }
                    ]
                }
            ]
        });

        if (!placementTests || placementTests.length === 0) {
            return res.status(404).send({ message: 'No placement tests found' });
        }

        const formattedTests = placementTests.map(test => ({
            placement_test_id: test.placement_test_id,
            test_link: test.test_link,
            number_of_questions: test.number_of_questions,
            description: test.description,
            start_time: test.start_time,
            end_time: test.end_time,
            show_result: test.show_result,
            created_at: test.createdAt,
            updated_at: test.updatedAt,
            is_Active: test.is_Active,
            topics: test.TestTopics.map(testTopic => ({
                topic_id: testTopic.PlacementTestTopic.topic_id,
                createdAt: testTopic.PlacementTestTopic.createdAt,
                updatedAt: testTopic.PlacementTestTopic.updatedAt
            }))
        }));

        return res.status(200).send({ message: 'Placement tests retrieved successfully', placementTests: formattedTests });
    } catch (error) {
        console.error('Error retrieving placement tests:', error);
        return res.status(500).send({ message: error.message });
    }
};





const savePlacementTestStudent = async (req, res) => {
    try {
        const { name, email, phone_number, placement_test_id } = req.body;

        // Check if all required fields are provided
        if (!name || !email || !phone_number || !placement_test_id) {
            return res.status(400).send({ message: 'Required fields are missing or invalid' });
        }

        // Check if the email already exists in the PlacementTestStudent table
        const existingStudent = await PlacementTestStudent.findOne({
            where: {
                email
            }
        });

        if (existingStudent) {
            // Check if the student has already taken this specific test
            const existingResult = await PlacementTestResult.findOne({
                where: {
                    placement_test_id,
                    placement_test_student_id: existingStudent.placement_test_student_id,
                }
            });

            if (existingResult) {
                return res.status(403).send({ message: 'You have already attended this test.' });
            } else {
                return res.status(200).send({ message: 'Student details already exist', existingStudent });
            }
        }

        // Create the new student record
        const newStudent = await PlacementTestStudent.create({
            student_name: name,
            email,
            phone_number
        });

        return res.status(200).send({ message: 'Student details saved successfully', newStudent });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


const getAllResultsByTestId = async (req, res) => {
    try {
        const { placement_test_id } = req.body;

        if (!placement_test_id) {
            return res.status(400).send({ message: 'placement_test_id is required' });
        }


        // Step 1: Fetch all results from PlacementTestResult table by placement_test_id
        const results = await PlacementTestResult.findAll({
            where: { placement_test_id },
            attributes: ['placement_test_student_id', 'marks_obtained','total_marks']
        });

        // Step 2: Extract all unique placement_test_student_id values
        const studentIds = results.map(result => result.placement_test_student_id);

        if (studentIds.length === 0) {
            return res.status(404).send({ message: 'No results found for the provided placement_test_id' });
        }

        // Step 3: Fetch student details from PlacementTestStudent table
        const students = await PlacementTestStudent.findAll({
            where: {
                placement_test_student_id: studentIds
            },
            attributes: ['placement_test_student_id', 'student_name', 'email', 'phone_number']
        });

        // Step 4: Combine results with student details
        const combinedResults = results.map(result => {
            const student = students.find(student => student.placement_test_student_id === result.placement_test_student_id);
            return {
                placement_test_student_id: result.placement_test_student_id,
                marks_obtained: result.marks_obtained,
                total_marks: result.total_marks,
                student_details: student ? {
                    student_name: student.student_name,
                    email: student.email,
                    phone_number: student.phone_number
                } : null
            };
        });

        return res.status(200).send(combinedResults);

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// const disableTestLink = async(req, res) => {
// try {
//     const {is_Active, test_id} = req.body;

//     if(is_Active){
//         await PlacementTest.update({is_Active:false where {
//             [op.ne] = test_id
//         }})
//     }
// } catch (error) {
    
// }


const disableLink = async (req, res) => {
    try {
        const { test_id, is_Active } = req.body;
        console.log( "is active ", is_Active, "  test _ id ", test_id)
        // Step 1: Find the currently active test link
        const activeTest = await PlacementTest.findAll({
            where: { is_Active: true }
        });

        // Step 2: Disable the currently active test link if it exists
        if (activeTest.length > 0) {
            await PlacementTest.update({ is_Active: false }, {
                where: { placement_test_id: activeTest.map(test => test.placement_test_id) }
            });
        }

        // Step 3: Enable the specified test link if is_Active is true
        if (is_Active) {
            await PlacementTest.update({ is_Active: true }, {
                where: { placement_test_id: test_id }
            });
        }

        res.status(200).send({ message: 'Test link status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while updating test link status' });
    }
};
    

const assignQuestionsToPlacementTest = async (req, res) => {
    const { placement_test_id, question_ids } = req.body;

    try {
        // Validate if placement_test_id and question_ids are provided
        if (!placement_test_id || !question_ids || question_ids.length === 0) {
            return res.status(400).send({ message: 'Placement test ID and question IDs are required.' });
        }

        // Check if placement_test_id exists in PlacementTest table
        const test = await PlacementTest.findByPk(placement_test_id);
        if (!test) {
            return res.status(404).send({ message: `Placement test with ID ${placement_test_id} not found.` });
        }

        // Check which question_ids are already assigned to the placement test
        const existingAssignments = await CumulativeQuestionPlacementTest.findAll({
            where: { placement_test_id: placement_test_id },
            attributes: ['cumulative_question_id']
        });

        const assignedQuestionIds = existingAssignments.map(a => a.cumulative_question_id);

        // Filter out already assigned question_ids
        const newQuestionIds = question_ids.filter(id => !assignedQuestionIds.includes(id));

        if (newQuestionIds.length === 0) {
            return res.status(200).send({ message: 'The selected questions are already exists' });
        }

        // Create an array of objects to bulk create entries in CumulativeQuestionPlacementTest
        const assignments = newQuestionIds.map(question_id => ({
            cumulative_question_id: question_id,
            placement_test_id: placement_test_id
        }));

        // Bulk create entries in the CumulativeQuestionPlacementTest table
        const createdAssignments = await CumulativeQuestionPlacementTest.bulkCreate(assignments);

        return res.status(200).send({ 
            message: 'Questions assigned to placement test successfully.', 
            assignments: createdAssignments 
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const saveOneQuestionAndAddToLink = async (req, res) => {
    try {
        // Extract required fields from the request body
        const { topic_id, question_description, no_of_marks_allocated, difficulty_level, options, correct_options, placement_test_id } = req.body;

        // Create the cumulative question
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

        await OptionsTable.bulkCreate(optionList);

        // Create the correct answers
        const correctOptionList = correct_options.map((correctOption) => ({
            cumulative_question_id: questionId,
            answer_description: correctOption.trim()
        }));

        await db.CorrectAnswer.bulkCreate(correctOptionList);

        // Create the association with placement test
        await CumulativeQuestionPlacementTest.create({
            cumulative_question_id: questionId,
            placement_test_id
        });

        // Send the response with the newly created question details
        return res.status(201).send({
            message: 'Question created and added to placement test successfully',
            question: newQuestion
        });
    } catch (error) {
        console.error('Error saving question and adding to link:', error);
        return res.status(500).send({ message: 'Failed to save question and add to link', error: error.message });
    }
};

const saveQuestionAndAddToLink = async (data) => {
    try {
        const { topic_id, question_description, no_of_marks_allocated, difficulty_level, options, correct_options, placement_test_id } = data;

        // Create the cumulative question
        const newQuestion = await CumulativeQuestion.create({
            topic_id,
            question_description,
            no_of_marks_allocated,
            difficulty_level,
        });

        const questionId = newQuestion.cumulative_question_id;

        // Create the options
        const optionList = options.map((optionDescription) => ({
            cumulative_question_id: questionId,
            option_description: optionDescription.trim()
        }));

        await OptionsTable.bulkCreate(optionList);

        // Create the correct answers
        const correctOptionList = correct_options.map((correctOption) => ({
            cumulative_question_id: questionId,
            answer_description: correctOption.trim()
        }));

        await db.CorrectAnswer.bulkCreate(correctOptionList);

        // Create the association with placement test if provided
        if (placement_test_id) {
            await CumulativeQuestionPlacementTest.create({
                cumulative_question_id: questionId,
                placement_test_id
            });
        }

        return {
            message: 'Question created and added to placement test successfully',
            question: newQuestion
        };
    } catch (error) {
        console.error('Error saving question and adding to link:', error);
        throw new Error('Failed to save question and add to link');
    }
};

const uploadAndAssignQuestionsToLink = async (filePath, topic_id, placement_test_id = null) => {
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

        // Define options and correct answers
        const options = [option1, option2, option3, option4];
        const correctOptions = correctOptionValue.split(',').map(opt => opt.trim());

        // Call saveQuestionAndAddToLink
        await saveQuestionAndAddToLink({
            topic_id,
            question_description: questionText,
            no_of_marks_allocated: marks,
            difficulty_level: difficulty,
            options,
            correct_options: correctOptions,
            placement_test_id
        });
    }
};



const getTopicsByPlacementTestId = async (req, res) => {
    try {
        const { placement_test_id } = req.body;

        if (!placement_test_id) {
            return res.status(400).send({ message: "Placement test ID is required." });
        }

        // Fetch topics associated with the given placement test ID
        const topics = await db.PlacementTestTopic.findAll({
            where: { placement_test_id },
            include: [
                {
                    model: db.Topic,
                    as: 'Topics',
                    include: [
                        {
                            model: db.Subject,
                            as: 'subject',
                            attributes: ['subject_id', 'name']
                        }
                    ],
                    attributes: ['topic_id', 'name']
                }
            ],
            attributes: []
        });

        if (!topics || topics.length === 0) {
            return res.status(404).send({ message: "No topics found for the given placement test ID." });
        }

        // Format the response to include topic and subject details
        const topicDetails = topics.map(topicEntry => {
            const topicData = topicEntry.Topics; // This should match the alias
            if (!topicData) return null;

            return {
                topic_id: topicData.topic_id,
                topic_name: topicData.name,
                subject_id: topicData.subject.subject_id,
                subject_name: topicData.subject.name
            };
        }).filter(detail => detail !== null); // Filter out any null values in case of missing associations

        return res.status(200).send({
            message: 'Topics fetched successfully',
            topics: topicDetails
        });
    } catch (error) {
        console.error('Error fetching topics by placement test ID:', error);
        return res.status(500).send({ message: 'Failed to fetch topics', error: error.message });
    }
};

const saveQuestionAndAddToLinkTopic = async (data) => {
    try {
        const { topic_id, question_description, no_of_marks_allocated, difficulty_level, options, correct_options, placement_test_id } = data;

        // Log the received placement_test_id
        console.log("Received placement_test_id:", placement_test_id);

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

        // Create the association with placement test if provided
        if (placement_test_id) {
            try {
                const association = await CumulativeQuestionPlacementTest.create({
                    cumulative_question_id: questionId,
                    placement_test_id
                });

                if (!association) {
                    console.error('Failed to create association with placement test.');
                } else {
                    console.log('Association with placement test created successfully:', association);
                }
            } catch (assocError) {
                console.error('Error creating association with placement test:', assocError);
            }
        }

        return {
            message: 'Question created and added to placement test successfully',
            question: newQuestion
        };
    } catch (error) {
        console.error('Error saving question and adding to link:', error);
        throw new Error('Failed to save question and add to link');
    }
};


const uploadAndAssignQuestionsByExcelTopics = async (filePath, link_topic_ids, nonExistingTopics, nonLinkedTopics, placement_test_id = null) => {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const cleanString = (value) => (value != null ? String(value).trim().replace(/\s+/g, ' ') : '');

    for (const row of rows) {
        const topic_id = cleanString(row["Topic ID"]);
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

        console.log(`Processing row with Topic ID: ${topic_id}`);
        console.log(`Placement test ID being passed: ${placement_test_id}`);

        // Verify if topic_id exists in Topics table
        const topicExists = await Topic.findOne({ where: { topic_id } });
        if (!topicExists) {
            nonExistingTopics.push(topic_id);
            console.log(`Topic ID ${topic_id} does not exist.`);
            continue;
        }

        // Verify if topic_id is in link_topic_ids
        if (!link_topic_ids.includes(topic_id)) {
            nonLinkedTopics.push(topic_id);
            console.log(`Topic ID ${topic_id} is not linked.`);
            continue;
        }

        // Define options and correct answers
        const options = [option1, option2, option3, option4];
        const correctOptions = correctOptionValue.split(',').map(opt => opt.trim());

        // Call saveQuestionAndAddToLinkTopic
        await saveQuestionAndAddToLinkTopic({
            topic_id,
            question_description: questionText,
            no_of_marks_allocated: marks,
            difficulty_level: difficulty,
            options,
            correct_options: correctOptions,
            placement_test_id // Ensure this is passed correctly
        });

        console.log(`Question for Topic ID ${topic_id} processed successfully.`);
    }
};






module.exports = {
    createPlacementTestLink,
    savePlacementTestStudent,
    getPlacementTestById,
    getAllPlacementTests,
    fetchTestTopicIdsAndQnNums,
    savePlacementTestResults,
    getAllResults,
    getAllResultsByTestId,
    disableLink,
    fetchQuestionsByTopicIds,
    fetchQuestionsUsingTopicId,
    assignQuestionsToPlacementTest,
    saveQuestionAndAddToLink,
    getTopicsByPlacementTestId,
    uploadAndAssignQuestionsToLink,
    saveOneQuestionAndAddToLink,
    uploadAndAssignQuestionsByExcelTopics,
}