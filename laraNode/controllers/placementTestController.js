const db = require('../models');

const {Op} = require('sequelize');
const Student = db.Student;
const PlacementTest = db.PlacementTest;
const PlacementTestTopic = db.PlacementTestTopic;
const PlacementTestStudent = db.PlacementTestStudent;
const Topic = db.Topic;
const PlacementTestResult = db.PlacementTestResult;
const { baseURL } = require('./baseURLConfig')


const jwtSecret = process.env.JWT_SECRET;
// const CryptoJS = require('crypto-js');

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

        const newTest = await PlacementTest.create({
            test_link: '', // Initially empty, will be updated later
            number_of_questions,
            description,
            start_time, // Store as string
            end_time, // Store as string
            show_result: show_result !== undefined ? show_result : true // Default to true if not provided
        });

        // Encrypt the test ID using AES encryption
        // const encryptedTestId = CryptoJS.AES.encrypt(newTest.placement_test_id.toString(), jwtSecret).toString();

        // Generate the test link with the encrypted test ID
        // const test_link = `${baseURL}/${encodeURIComponent(encryptedTestId)}`;
        const test_link = `${baseURL}/test/${newTest.placement_test_id}`;

        // Update the test link in the database
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
        console.log('ACtive test ', activeTest)
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


const getAllPlacementTests = async (req, res) => {
    try {
        const placementTests = await PlacementTest.findAll({
            include: [
                {
                    model: PlacementTestTopic,
                    as: 'Topics',
                    include: [
                        {
                            model: Topic,
                            attributes: ['topic_id', 'createdAt', 'updatedAt'] // Include desired attributes from Topic model
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
            is_Active:test.is_Active,
            topics: test.Topics.map(topic => ({
                topic_id: topic.topic_id,
                createdAt: topic.createdAt,
                updatedAt: topic.updatedAt
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
    








module.exports = {
    createPlacementTestLink,
    savePlacementTestStudent,
    getAllPlacementTests,
    fetchTestTopicIdsAndQnNums,
    savePlacementTestResults,
    getAllResults,
    getAllResultsByTestId,
    disableLink
}