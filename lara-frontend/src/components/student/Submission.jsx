// import React, { useState } from 'react';
// import axios from 'axios';

// const Submission = () => {
//   const [question, setQuestion] = useState({ question: '', description: '' });
//   const [code, setCode] = useState('');
//   const [output, setOutput] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const executeCode = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("No token provided.");
//       }
  
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
      
//       setLoading(true);
//       const response = await axios.post('http://localhost:8080/api/student/executeJavaCodeHandler', {
//         code: code, // Send the Java code
//       }, config);
      
//       setOutput(response.data.output); // Set the output directly from the response
//     } catch (error) {
//       console.error('Error executing Java code:', error);
//       if (error.response && error.response.data) {
//         console.error('Error message from server:', error.response.data);
//       }
//       setOutput('Error executing Java code');
//     } finally {
//       setLoading(false);
//     }
//   };
  
  

//   return (
//     <div>
//       <h2>Submit Answer</h2>
//       <div>
//         <h4>{question.question}</h4>
//         <p>{question.description}</p>
//       </div>
//       <div>
//         <textarea
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//           rows={10}
//           cols={50}
//           placeholder="Write your Java code here"
//         ></textarea>
//       </div>
//       <div>
//         <button onClick={executeCode} disabled={loading}>Run</button>
//       </div>
//       {loading && <div>Loading...</div>}
//       <div>
//         <h4>Output:</h4>
//         <pre>{output}</pre>
//       </div>
//     </div>
//   );
// };

// export default Submission;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Submission = () => {
  const [question, setQuestion] = useState({ question: '', description: '' });
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const { questionId } = useParams();

  useEffect(() => {
    const fetchQuestionById = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token provided.");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.post(
          'http://localhost:8080/api/student/getQuestionById',
          { id: questionId },
          config
        );

        setQuestion(response.data);
      } catch (error) {
        console.error('Failed to fetch question:', error);
      }
    };

    fetchQuestionById();
  }, [questionId]);

  const executeCode = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No token provided.");
          }
      
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          
          setLoading(true);
          const response = await axios.post('http://localhost:8080/api/student/executeJavaCodeHandler', {
            code: code, // Send the Java code
          }, config);
          
          setOutput(response.data.output); // Set the output directly from the response
        } catch (error) {
          console.error('Error executing Java code:', error);
          if (error.response && error.response.data) {
            console.error('Error message from server:', error.response.data);
          }
          setOutput('Error executing Java code');
        } finally {
          setLoading(false);
        }
      };    

  return (
    <div className="container mt-5">
    <h2>Submit Answer</h2>
    <div className="mb-4">
      <h4>{question.question}</h4>
      <p>{question.description}</p>
    </div>
    <div className="mb-4">
        <h5>Write your code in the below editor</h5>
      <textarea
        className="form-control bg-dark text-light"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={10}
        placeholder="Write your Java code here"
        style={{ color: '#fff', '::placeholder': { color: '#fff' } }} // Add custom styles for placeholder text
      ></textarea>
    </div>
    <div className="mb-4">
      <button className="btn btn-primary" onClick={executeCode} disabled={loading}>Run</button>
    </div>
    {loading && <div>Loading...</div>}
    <div className="mb-4">
      <h4>Output:</h4>
      <pre className="bg-dark text-light p-3">{output}</pre>
    </div>
  </div>
  

  );
};

export default Submission;
