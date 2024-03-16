const db = require('../models');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const Student = db.Student;
const Profile = db.Profile;
const Batch = db.Batch;
const StudentBatch = db.Student_Batch
const BatchTrainer = db.BatchTrainer
const Questions = db.Questions
const Testcase = db.TestCase
const StudentSubmission = db.StudentSubmission
const jwtSecret = process.env.JWT_SECRET;

const saveQuestion = async (req, res) => {
  try {
    const studentId = req.studentId;
    const { batch_id, question, description } = req.body;

    // Fetch student from database using studentId
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Fetch user's role
    const userRole = student.role;

    // Check if the user role is authorized to save questions
    if (userRole !== 'TRAINER') {
      return res.status(403).json({ error: 'Access forbidden' });
    }

    // Create the question
    const createdQuestion = await Questions.create({
      trainer_id: studentId,
      batch_id,
      question,
      description
    });

    res.status(200).send(createdQuestion);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const studentId = req.studentId;
    const { id, question, description } = req.body;

    // Fetch student from database using studentId
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Fetch user's role
    const userRole = student.role;

    // Check if the user role is authorized to update questions
    if (userRole !== 'TRAINER') {
      return res.status(403).json({ error: 'Access forbidden' });
    }

    // Find the question by ID
    const existingQuestion = await Questions.findByPk(id);
    if (!existingQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Update the question
    existingQuestion.question = question;
    existingQuestion.description = description;
    await existingQuestion.save();

    res.status(200).send(existingQuestion);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const studentId = req.studentId;
    const { id } = req.body;

    // Fetch student from database using studentId
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Fetch user's role
    const userRole = student.role;

    // Check if the user role is authorized to delete questions
    if (userRole !== 'TRAINER') {
      return res.status(403).json({ error: 'Access forbidden' });
    }

    // Find the question by ID
    const existingQuestion = await Questions.findByPk(id);
    if (!existingQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Delete the question
    await existingQuestion.destroy();

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getQuestionsByBatchId = async (req, res) => {
  try {
    // const studentId = req.studentId;

    const { batch_id } = req.body;
    // Fetch user's role
    // const student = await Student.findByPk(studentId)
    // const userRole = student.role;

    // // Check if the user role is authorized to save questions
    // if (userRole !== 'TRAINER') {
    //   return res.status(403).json({ error: 'Access forbidden' });
    // }
    // Fetch questions from the database based on batch_id
    const questions = await Questions.findAll({
      where: { batch_id },
    });

    res.status(200).json(questions);
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const { id } = req.body;
    console.log("id ", id)
    // Fetch question from the database based on question_id
    const question = await Questions.findByPk(id); // Assuming Questions is your Sequelize model

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error('Failed to fetch question by ID:', error);
    res.status(500).json({ message: 'Failed to fetch question by ID' });
  }
};

const saveTestcases = async (req, res) => {
  try {
    const { question_id, testcases } = req.body;

    // Check if the question exists
    const question = await Questions.findByPk(question_id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Save each testcase
    const createdTestcases = [];
    for (const testcase of testcases) {
      const createdTestcase = await Testcase.create({
        question_id,
        input: testcase.input,
        expected_output: testcase.expected_output
      });
      createdTestcases.push(createdTestcase);
    }

    res.status(200).json(createdTestcases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const saveStudentSubmission = async (req, res) => {
  try {
    const studentId = req.studentId;
    const { question_id, code,batch_id, submission_time, no_testcase_passed, execution_output } = req.body;

    // Check if the question exists
    const question = await Questions.findByPk(question_id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if the student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if the student has already submitted the code for this question
    const existingSubmission = await StudentSubmission.findOne({
      where: {
        question_id: question_id,
        student_id: studentId
      }
    });

    if (existingSubmission) {
      return res.status(400).json({ error: 'Student already submitted the answer for this question' });
    }

    // Save the student submission
    const createdSubmission = await StudentSubmission.create({
      question_id,
      student_id: studentId,
      batch_id,
      code,
      submission_time,
      no_testcase_passed,
      execution_output
    });

    res.status(200).json(createdSubmission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getStudentSubmissions = async (req, res) => {
  try {
    const studentId = req.studentId;
    const {batchId} = req.body;
    console.log("batch id :", batchId)
    // Check if the student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Retrieve all submissions for the student and batch
    const submissions = await StudentSubmission.findAll({
      where: {
        student_id: studentId,
        batch_id: batchId
      }
    });
    
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getStudentSubmissionsByBatchId = async (req, res) => {
  try {
    const {studentId,batchId} = req.body;
    console.log("student Id ", studentId)
    console.log("batch Id ", batchId)
    // Check if the student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Retrieve all submissions for the student and batch
    const submissions = await StudentSubmission.findAll({
      where: {
        student_id: studentId,
        batch_id: batchId
      }
    });
    
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// java versionIndex details 
//  Version index 0 corresponds to Java 7.
//  Version index 1 corresponds to Java 8.
//  Version index 2 corresponds to Java 9.
//  Version index 3 corresponds to Java 10.
//  Version index 4 corresponds to Java 11.
//  Version index 5 corresponds to Java 12.

async function executeCode(code, input) {
  const response = await axios.post('https://api.jdoodle.com/v1/execute', {
    clientId: 'cf50f833c14a453d7b51231fe243dda6',
    clientSecret: 'bb9342a1e142f420f0a1f2345749fc7b751d32340b5906b76544cd02095c666a',
    script: code,
    stdin: input,
    language: 'java',
    versionIndex: '5'
  });

  return response.data.output;
}
/******************** */
const executeJavaCodeHandler = async (req, res) => {
  try {
    const { code } = req.body;

    // Construct the request body
    const requestBody = {
      script: code,
      language: 'java',
      versionIndex: '3', // Specify the Java version index (e.g., '3' for Java 8)
      clientId: 'cf50f833c14a453d7b51231fe243dda6',
      clientSecret: 'bb9342a1e142f420f0a1f2345749fc7b751d32340b5906b76544cd02095c666a',
      stdin: '', 
    };

    // Send POST request to Jdoodle compiler API
    const response = await axios.post('https://api.jdoodle.com/v1/execute', requestBody);

    // Extract the output from the response and send it as JSON
    res.json({ output: response.data.output });
  } catch (error) {
    console.error('Error executing Java code:', error);
    res.status(500).json({ error: 'Error executing Java code' });
  }
};

// ************************************/

// const executeJavaCodeHandler = async (req, res) => {
//   try {
//     const { code, testCases } = req.body;

//     const results = [];
//     for (const testCase of testCases) {
//       // Execute code for the current test case
//       const output = await executeCode(code, testCase.input);

//       // Compare output with expected output
//       const isCorrect = output.trim() === testCase.expectedOutput.trim();

//       results.push({
//         input: testCase.input,
//         output: output.trim(),
//         expectedOutput: testCase.expectedOutput.trim(),
//         isCorrect: isCorrect
//       });
//     }

//     res.json(results);
//   } catch (error) {
//     console.error('Error executing Java code:', error);
//     res.status(500).json({ error: 'Error executing Java code' });
//   }
// };



// const executeJavaCodeHandler = async (req, res) => {
//   try {
//     const { code, testCases } = req.body;

//     // Array to hold results for each test case
//     const results = [];

//     // Function to execute Java code for a single test case
//     const executeTestCase = async (testCase) => {
//       const requestBody = {
//         script: code,
//         language: 'java',
//         versionIndex: '3', // Specify the Java version index (e.g., '3' for Java 8)
//         clientId: 'cf50f833c14a453d7b51231fe243dda6',
//         clientSecret: 'bb9342a1e142f420f0a1f2345749fc7b751d32340b5906b76544cd02095c666a',
//         stdin: testCase.input,
//       };

//       // Send POST request to Jdoodle compiler API
//       const response = await axios.post('https://api.jdoodle.com/v1/execute', requestBody);

//       // Extract output from the response
//       const output = response.data.output

//       // Compare output with expected output
//       const expectedResult = testCase.expectedOutput; // No need to trim for boolean values
//       const testResult = output === expectedResult ? 'Pass' : 'Fail';

//       // Store the result for the current test case
//       return {
//         input: testCase.input,
//         output: output,
//         expectedOutput: expectedResult,
//         result: testResult,
//       };
//     };

//     // Execute Java code for each test case
//     for (const testCase of testCases) {
//       const result = await executeTestCase(testCase);
//       results.push(result);
//     }

//     // Send results as JSON
//     res.json({ results });
//   } catch (error) {
//     console.error('Error executing Java code:', error);
//     res.status(500).json({ error: 'Error executing Java code' });
//   }
// };


module.exports = {
  executeJavaCodeHandler,
  saveQuestion,
  saveTestcases,
  saveStudentSubmission,
  getQuestionsByBatchId,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getStudentSubmissions,
  getStudentSubmissionsByBatchId
};