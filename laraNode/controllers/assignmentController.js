const db = require('../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ dest: 'questionImages/' });
const axios = require('axios');
const fs = require('fs');

const Student = db.Student;
const Profile = db.Profile;
const Batch = db.Batch;
const StudentBatch = db.Student_Batch
const BatchTrainer = db.BatchTrainer
const Questions = db.Questions
const Testcase = db.TestCase
const StudentSubmission = db.StudentSubmission
const jwtSecret = process.env.JWT_SECRET;

// const saveQuestion = async (req, res) => {
//   try {
//     const studentId = req.studentId;
//     const { batch_id, question, description } = req.body;

//     // Fetch student from database using studentId
//     const student = await Student.findByPk(studentId);
//     if (!student) {
//       return res.status(404).json({ error: 'Student not found' });
//     }

//     // Fetch user's role
//     const userRole = student.role;

//     // Check if the user role is authorized to save questions
//     if (userRole !== 'TRAINER') {
//       return res.status(403).json({ error: 'Access forbidden' });
//     }

//     // Create the question
//     const createdQuestion = await Questions.create({
//       trainer_id: studentId,
//       batch_id,
//       question,
//       description
//     });

//     res.status(200).send(createdQuestion);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: error.message });
//   }
// };

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

    // Initialize imagePath to null
    let imagePath = null;

    // Check if file was uploaded
    if (req.file) {
      // Check if the file format is valid
      const fileFormat = req.file.originalname.split('.').pop().toLowerCase();
      if (!validFileFormats.includes(fileFormat)) {
        throw new Error('Invalid file format. Supported formats: JPEG, JPG, PNG.');
      }

      // Construct the full path for saving the image
      imagePath = req.file.path;
    }

    // Create the question
    const createdQuestion = await Questions.create({
      trainer_id: studentId,
      batch_id,
      question,
      description,
      question_image: imagePath // Assign imagePath or null to question_image field
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
    const { id, question, description, solution } = req.body;

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

    // Initialize imagePath to the existing question's image path
    let imagePath = existingQuestion.question_image;

    // Check if a new image file was uploaded
    if (req.file) {
      // Check if the file format is valid
      const fileFormat = req.file.originalname.split('.').pop().toLowerCase();
      if (!validFileFormats.includes(fileFormat)) {
        throw new Error('Invalid file format. Supported formats: JPEG, JPG, PNG.');
      }

      // Construct the full path for saving the image
      imagePath = req.file.path;
    }

    // Update the question, description, solution, and question image
    existingQuestion.question = question;
    existingQuestion.description = description;
    existingQuestion.solution = solution; // Adding solution update
    existingQuestion.question_image = imagePath; // Assign updated imagePath
    await existingQuestion.save();

    res.status(200).send(existingQuestion);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};


const validFileFormats = ['jpeg', 'jpg', 'png'];

const uploadQuestionImage = async (req, res) => {
  try {
    const { id } = req.body;
    // console.log("id :", id)
    if (id === undefined) {
      throw new Error('ID parameter is missing or undefined.');
    }
    // Check if file was uploaded
    if (!req.file) {
      throw new Error('No image file uploaded.');
    }

    // Check if the file format is valid
    const fileFormat = req.file.originalname.split('.').pop().toLowerCase();
    if (!validFileFormats.includes(fileFormat)) {
      throw new Error('Invalid file format. Supported formats: JPEG, JPG, PNG.');
    }

    // Construct the full path for saving the image
    const imagePath = req.file.path;

    // Update the image path in the database
    await Questions.update({ question_image: imagePath }, { where: { id } });

    res.status(200).send({ message: 'Question image uploaded successfully.', imagePath });
  } catch (error) {
    console.error('Error uploading question image:', error);
    res.status(500).send({ message: error.message });
  }
};

const getQuestionImage = async (req, res) => {
  try {
      const { id } = req.body;
      // console.log("id   ----",id)
      // Find the question by ID
      const question = await Questions.findOne({ where: { id } });

      if (!question) {
          return res.status(404).send({ message: 'Question not found.' });
      }

      const imagePath = question.question_image;

      // Check if imagePath exists
      if (!imagePath) {
          return res.status(404).send({ message: 'Image not found.' });
      }

      // Read the image file
      fs.readFile(imagePath, (err, data) => {
          if (err) {
              return res.status(500).send({ message: 'Error reading image file.' });
          }

          // Set the appropriate content type
          res.setHeader('Content-Type', 'image/jpeg'); // Adjust content type based on your image format

          // Send the image file as response
          res.status(200).send(data);
      });
  } catch (error) {
      res.status(500).send({ message: error.message });
  }
};




// const validFileFormats = ['jpeg', 'jpg', 'png'];

// const updateQuestion = async (req, res) => {
//   try {
//     const studentId = req.studentId;
//     const { id, question, description, solution } = req.body;

//     // Fetch student from database using studentId
//     const student = await Student.findByPk(studentId);
//     if (!student) {
//       return res.status(404).json({ error: 'Student not found' });
//     }

//     // Fetch user's role
//     const userRole = student.role;

//     // Check if the user role is authorized to update questions
//     if (userRole !== 'TRAINER') {
//       return res.status(403).json({ error: 'Access forbidden' });
//     }

//     // Find the question by ID
//     const existingQuestion = await Questions.findByPk(id);
//     if (!existingQuestion) {
//       return res.status(404).json({ error: 'Question not found' });
//     }

//     // Update the question, description, and solution
//     existingQuestion.question = question;
//     existingQuestion.description = description;
//     existingQuestion.solution = solution; // Adding solution update

//     // Check if a question image file was uploaded
//     if (req.file) {
//       // Check if the file format is valid
//       const fileFormat = req.file.originalname.split('.').pop().toLowerCase();
//       if (!validFileFormats.includes(fileFormat)) {
//         throw new Error('Invalid file format. Supported formats: JPEG, JPG, PNG.');
//       }

//       // Construct the full path for saving the image
//       const imagePath = req.file.path;

//       // Update the image path in the question entity
//       existingQuestion.questionImage = imagePath;
//     }

//     // Save the updated question entity
//     await existingQuestion.save();

//     res.status(200).send(existingQuestion);
//   } catch (error) {
//     console.error('Error updating question:', error);
//     res.status(500).send({ message: error.message });
//   }
// };


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
    const { batch_id } = req.body;

    // Fetch questions from the database based on batch_id
    const questions = await Questions.findAll({
      where: { batch_id },
    });

    // Iterate through each question to append image data
    const questionsWithImageData = await Promise.all(
      questions.map(async (question) => {
        try {
          // Read the image file asynchronously
          const data = await fs.promises.readFile(question.imagePath);

          // Encode the image data to Base64
          const base64Image = Buffer.from(data).toString('base64');

          // Append the Base64 image data to the question object
          return {
            ...question.toJSON(),
            question_image: base64Image,
          };
        } catch (error) {
          console.error('Error reading image file:', error);
          // If there's an error reading the image file, return the question without image data
          return question.toJSON();
        }
      })
    );

    res.status(200).json(questionsWithImageData);
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

const getStudentSubmissionsByStudentId = async (req, res) => {
  try {
    const { studentId } = req.body; // Retrieve student ID from request body

    // Check if the student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Retrieve all submissions for the student
    const submissions = await StudentSubmission.findAll({
      where: {
        student_id: studentId
      }
    });

    // If no submissions found, return an empty response
    if (!submissions || submissions.length === 0) {
      return res.status(200).json({ message: 'No submissions found for the student' });
    }

    // Retrieve student details
    const studentDetails = {
      id: student.id,
      name: student.name,
      email: student.email
      // Add other details as needed
    };

    // Retrieve question and batch details for each submission
    const submissionDetails = await Promise.all(submissions.map(async (submission) => {
      const { question_id, batch_id } = submission;
      const question = await Questions.findByPk(question_id);
      const batch = await Batch.findByPk(batch_id);
      return { submission, question, batch };
    }));

    // Return student details along with submission details
    res.status(200).json({ student: studentDetails, submissions: submissionDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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
    const { question_id, code, batch_id, submission_time, no_testcase_passed, execution_output } = req.body;

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

const saveStudentMarks = async (req, res) => {
  try {
    const studentId = req.studentId;
    const { student_id, question_id, batch_id, marks } = req.body;

    // Fetch student from database using studentId
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Fetch user's role
    const userRole = student.role;
    if (userRole !== 'TRAINER') {
      return res.status(403).json({ error: 'Access forbidden' });
    }

    // Check if the question exists
    const question = await Questions.findByPk(question_id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if the student exists
    const checkStudent = await Student.findByPk(student_id);
    if (!checkStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if the student has submitted the code for this question
    const existingSubmission = await StudentSubmission.findOne({
      where: {
        question_id: question_id,
        student_id: student_id
      }
    });

    if (!existingSubmission) {
      return res.status(400).json({ error: 'Student has not submitted the answer for this question' });
    }

    // Update the student's marks
    await StudentSubmission.update(
      { marks },
      {
        where: {
          question_id: question_id,
          student_id: student_id,
          batch_id: batch_id
        }
      }
    );

    res.status(200).json({ message: 'Marks saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


const getStudentSubmissions = async (req, res) => {
  try {
    const studentId = req.studentId;
    const { batchId } = req.body;
    // console.log("batch id :", batchId)
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
    const { studentId, batchId } = req.body;
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

const getSResults = async (req, res) => {
  try {
    const studentId = req.studentId;
    const { batch_id, question_id } = req.body;
    console.log("student Id ", studentId)
    console.log("batch Id ", batch_id)
    // Check if the student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Retrieve all submissions for the student and batch
    const submissions = await StudentSubmission.findAll({
      where: {
        student_id: studentId,
        batch_id: batch_id,
        question_id: question_id
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

const executeJavaCodeHandler2 = async (req, res) => {
  try {
    const { code } = req.body;

    // Construct the request body
    const requestBody = {
      script: code,
      language: 'java',
      versionIndex: '3', // Specify the Java version index (e.g., '3' for Java 8)
      clientId: 'ee5fa68e27a29f2bf81554d5bedc3868',
      clientSecret: 'b7bfe6bd794890421f7e777a672e074e5a232b0c1ca8c49672c49b18636c5308',
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
  executeJavaCodeHandler2,
  saveQuestion,
  saveTestcases,
  saveStudentSubmission,
  getQuestionsByBatchId,
  getQuestionById,
  updateQuestion,
  uploadQuestionImage,
  getQuestionImage,
  deleteQuestion,
  getStudentSubmissions,
  getStudentSubmissionsByStudentId,
  getStudentSubmissionsByBatchId,
  saveStudentMarks,
  getSResults
};