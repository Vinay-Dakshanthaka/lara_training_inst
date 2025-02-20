// import React, { useState } from 'react';
// import axios from 'axios';
// import {useParams } from 'react-router-dom';
// import { baseURL } from '../config';

// function DeleteinternaltestLink() {
//   const [internalTestId, setInternalTestId] = useState('');
//   const [message, setMessage] = useState('');
//   const { internal_test_id } = useParams();  // Extract internal_test_id from the URL
 
  
//   const handleDelete = async () => {
//     try {
//       // Ensure internalTestId is not empty
//       if (!internal_test_id) {
//         setMessage('Please provide an internal test ID.');
//         return;
//       }
//          console.log(internal_test_id, "----------------------internal_test_id")
//       // Make a DELETE request to the API
//       const response = await axios.delete(`${baseURL}/api/internal-test/deleteinternaltest/${internal_test_id}`);

//         console.log(response.data,"------------------------------response data")
//       // Show success message
//       setMessage(response.data.message);
//     } catch (error) {
//       // Handle any errors
//       console.error('Error deleting internal test:', error);
//       setMessage('An error occurred while deleting the test.');
//     }
//   };

//   return (
//     <div>
//       <h2>Delete Internal Test</h2>

//       {/* Input field to take internal test ID */}
//       <input
//         type="text"
//         value={internal_test_id}
//         onChange={(e) => setInternalTestId(e.target.value)}
//         placeholder="Enter internal test ID"
//       />
//       <button onClick={handleDelete}>Delete Test</button>

//       {/* Display the response message */}
//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// export default DeleteinternaltestLink;
