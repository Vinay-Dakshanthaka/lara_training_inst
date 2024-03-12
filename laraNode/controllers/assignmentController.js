const db = require('../models');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const Student = db.Student;
const Profile = db.Profile;
const Batch = db.Batch;
const StudentBatch = db.Student_Batch
const BatchTrainer = db.BatchTrainer
const jwtSecret = process.env.JWT_SECRET;

 // java versionIndex details 
//  Version index 0 corresponds to Java 7.
//  Version index 1 corresponds to Java 8.
//  Version index 2 corresponds to Java 9.
//  Version index 3 corresponds to Java 10.
//  Version index 4 corresponds to Java 11.
//  Version index 5 corresponds to Java 12.

const executeJavaCode = async (code) => {
  try {
    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
        //client id got from Jdoodle 
      clientId: 'cf50f833c14a453d7b51231fe243dda6',
      //client secret got from Jdoodle
      clientSecret: 'bb9342a1e142f420f0a1f2345749fc7b751d32340b5906b76544cd02095c666a',
      script: code,
      language: 'java',
      versionIndex: '5',
    });

    return response.data;
  } catch (error) {
    console.error('Error executing Java code:', error.response.data);
    throw new Error('Error executing Java code');
  }
};

const executeJavaCodeHandler = async (req, res) => {
    try {
      const { code } = req.body;
  
      const result = await executeJavaCode(code);
  
      res.json(result);
    } catch (error) {
      console.error('Error executing Java code:', error);
      res.status(500).json({ error: 'Error executing Java code' });
    }
  };


//   to connect to repl.it 
// const executeJavaCode = async (code) => {
//   try {
//     const response = await axios.post('https://repl.it/api/v0/repls', {
//       language: 'java',
//       code: code
//     });

//     // Extract the repl id from the response
//     const replId = response.data.id;

//     // Wait for the repl to finish running
//     const result = await axios.get(`https://repl.it/api/v0/repls/${replId}/output`);

//     // Return the output of the repl
//     return result.data.output;
//   } catch (error) {
//     console.error('Error executing Java code:', error.response.data);
//     throw new Error('Error executing Java code');
//   }
// };


  
  module.exports = { executeJavaCodeHandler };
  




