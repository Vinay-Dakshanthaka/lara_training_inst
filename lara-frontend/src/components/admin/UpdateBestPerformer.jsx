import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';
import { ToastContainer, toast } from 'react-toastify';
//import { BestPerformer } from '../../../../laraNode/models';

//Previous Code for Updating Best Performer By email 
// const UpdateBestPerformer = () => {
//   const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
//   const [email, setEmail] = useState('');
//   const [questionNo, setQuestionNo] = useState('');
//   const [bestPerformerData, setBestPerformerData] = useState(null);
//   const [name, setName] = useState('');

//   useEffect(() => {
//     fetchBestPerformer();
//   }, []);

//   const fetchBestPerformer = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         return;
//       }
      
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const response = await axios.get(`${baseURL}/api/student/getBestPerformersByDate`);
//       const data = response.data;
//       setBestPerformerData(data);
//       // console.log(bestPerformerData)
//     } catch (error) {
//       console.error('Error fetching best performer:', error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         return;
//       }
      
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       await axios.post(`${baseURL}/api/student/saveOrUpdateBestPerformer`, {
//         date: date,
//         email: email,
//         //name: name,
//         question_no: questionNo // Include question_no in the request
//       }, config);
//       toast.success('Updated Successfully')
//       fetchBestPerformer();
//     } catch (error) {
//       console.error('Error updating best performer:', error);
//       toast.error('Something went wrong')
//     }
//   };

//   return (
//     <div>
//       <h2>Update Best Performer</h2>
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label htmlFor="dateInput" className="form-label">Date</label>
//           <input type="date" className="form-control" id="dateInput" value={date} onChange={(e) => setDate(e.target.value)} />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="emailInput" className="form-label">Email</label>
//           <input type="email" className="form-control" id="emailInput" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder='Enter email id of the Best performer'/>
//         </div>
//         <div className="mb-3">
//           <label htmlFor="questionNoInput" className="form-label">Question Number</label>
//           <input type="text" className="form-control" id="questionNoInput" value={questionNo} onChange={(e) => setQuestionNo(e.target.value)} required placeholder='Enter question number'/>
//         </div>

//         {/* <div className="mb-3">
//           <label htmlFor="nameInput" className="form-label">Name</label>
//           <input type="text" className="form-control" id="nameInput" value={name} onChange={(e) => setName(e.target.value)} required placeholder='Enter name of the Best performer'/>
//         </div> */}


//         <button type="submit" className="btn btn-primary">Update</button>
//       </form>
//       {bestPerformerData && (
//   <div className='my-3'>
//     {bestPerformerData.map((performer, index) => (
//       <div key={index}>
//         <h5>Best Performer's for Question Number :{performer.bestPerformer.question_no ? performer.bestPerformer.question_no : 'N/A'}</h5>
//         <p className='display-5'>Student Name: {performer.student ? performer.student.name || 'N/A' : 'N/A'}</p>
//         <table className="table">
//           <thead>
//             <tr>
//               <th scope="col">Highest Education</th>
//               <th scope="col">Specialization</th>
//               <th scope="col">College Name</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>{performer.profile ? performer.profile.highest_education || 'N/A' : 'N/A'}</td>
//               <td>{performer.profile ? performer.profile.specialization || 'N/A' : 'N/A'}</td>
//               <td>{performer.collegeName || 'N/A'}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     ))}
//   </div>
// )}

//     </div>
//   );
// };


//Update code for updating best performer by name
// const UpdateBestPerformer = () => {
//   const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
//   const [name, setName] = useState('');
//   const [questionNo, setQuestionNo] = useState('');
//   const [bestPerformerData, setBestPerformerData] = useState(null);
//   const [nameSuggestions, setNameSuggestions] = useState([]);

//   useEffect(() => {
//     fetchBestPerformer();
//   }, []);

//   const fetchBestPerformer = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const response = await axios.get(`${baseURL}/api/student/getBestPerformersByDate`, config);
//       const data = response.data;
//       setBestPerformerData(data);
//     } catch (error) {
//       console.error('Error fetching best performer:', error);
//     }
//   };

//   const fetchNameSuggestions = async (query) => {
//     try {
//       const response = await axios.get(`${baseURL}/api/student/nameSuggestions?query=${query}`);
//       setNameSuggestions(response.data);
//     } catch (error) {
//       console.error('Error fetching name suggestions:', error);
//     }
//   };

//   const handleNameChange = (e) => {
//     const query = e.target.value;
//     setName(query);
//     if (query.length > 2) {
//       fetchNameSuggestions(query);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       await axios.post(`${baseURL}/api/student/saveOrUpdateBestPerformer`, {
//         date: date,
//         name: name,
//         question_no: questionNo
//       }, config);
//       toast.success('Updated Successfully');
//       fetchBestPerformer();
//     } catch (error) {
//       console.error('Error updating best performer:', error);
//       toast.error('Something went wrong');
//     }
//   };

//   return (
//     <div>
//       <h2>Update Best Performer</h2>
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label htmlFor="dateInput" className="form-label">Date</label>
//           <input type="date" className="form-control" id="dateInput" value={date} onChange={(e) => setDate(e.target.value)} />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="nameInput" className="form-label">Name</label>
//           <input type="text" className="form-control" id="nameInput" value={name} onChange={handleNameChange} required placeholder='Enter name of the Best performer' list="nameSuggestions"/>
//           <datalist id="nameSuggestions">
//             {nameSuggestions.map((suggestion, index) => (
//               <option key={index} value={suggestion.name}>{suggestion.name}</option>
//             ))}
//           </datalist>
//         </div>
//         <div className="mb-3">
//           <label htmlFor="questionNoInput" className="form-label">Question Number</label>
//           <input type="text" className="form-control" id="questionNoInput" value={questionNo} onChange={(e) => setQuestionNo(e.target.value)} required placeholder='Enter question number'/>
//         </div>
//         <button type="submit" className="btn btn-primary">Update</button>
//       </form>
//       {bestPerformerData && (
//         <div className='my-3'>
//           {bestPerformerData.map((performer, index) => (
//             <div key={index}>
//               <h5>Best Performer's for Question Number :{performer.bestPerformer.question_no ? performer.bestPerformer.question_no : 'N/A'}</h5>
//               <p className='display-5'>Student Name: {performer.student ? performer.student.name || 'N/A' : 'N/A'}</p>
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th scope="col">Highest Education</th>
//                     <th scope="col">Specialization</th>
//                     <th scope="col">College Name</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>{performer.profile ? performer.profile.highest_education || 'N/A' : 'N/A'}</td>
//                     <td>{performer.profile ? performer.profile.specialization || 'N/A' : 'N/A'}</td>
//                     <td>{performer.collegeName || 'N/A'}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };


//Updating Best Performer By Date in HomePage
const UpdateBestPerformer = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [name, setName] = useState('');
  const [bestPerformerData, setBestPerformerData] = useState([]);
  const [nameSuggestions, setNameSuggestions] = useState([]);

  useEffect(() => {
    
    fetchBestPerformersByDate();
  }, [date]);

  const fetchBestPerformersByDate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${baseURL}/api/student/getBestPerformersByDate`, {
        params: { date },
        ...config
      });
      const data = response.data;
      setBestPerformerData(data);
    } catch (error) {
      console.error('Error fetching best performer:', error);
    }
  };
  

  const fetchNameSuggestions = async (query) => {
    try {
      const response = await axios.get(`${baseURL}/api/student/nameSuggestions`, {
        params: { query }
      });
      setNameSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching name suggestions:', error);
    }
  };

  const handleNameChange = (e) => {
    const query = e.target.value;
    setName(query);
    if (query.length > 2) {
      fetchNameSuggestions(query);
    } else {
      setNameSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(`${baseURL}/api/student/saveOrUpdateBestPerformer`, {
        date,
        name
      }, config);
      toast.success('Updated Successfully');
      fetchBestPerformersByDate();
    } catch (error) {
      console.error('Error updating best performer:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div>
      <h2>Update Best Performer</h2>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="dateInput" className="form-label">Date</label>
          <input type="date" className="form-control" id="dateInput" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="nameInput" className="form-label">Name</label>
          <input type="text" className="form-control" id="nameInput" value={name} onChange={handleNameChange} required placeholder='Enter name of the Best performer' list="nameSuggestions"/>
          <datalist id="nameSuggestions">
            {nameSuggestions.map((suggestion, index) => (
              <option key={index} value={suggestion.name}>{suggestion.name}</option>
            ))}
          </datalist>
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
      {bestPerformerData.length > 0 && (
        <div className='my-3'>
          {bestPerformerData.map((performer, index) => (
            <div key={index}>
              <h5>Best Performer's for Date: {performer.bestPerformer.date}</h5>
              <p className='display-5'>Student Name: {performer.student ? performer.student.name : 'N/A'}</p>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Highest Education</th>
                    <th scope="col">Specialization</th>
                    <th scope="col">College Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{performer.profile ? performer.profile.highest_education : 'N/A'}</td>
                    <td>{performer.profile ? performer.profile.specialization : 'N/A'}</td>
                    <td>{performer.collegeName || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpdateBestPerformer;

