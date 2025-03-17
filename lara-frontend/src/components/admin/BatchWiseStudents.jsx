// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { Button, Form, Table } from 'react-bootstrap';
// import { BsArrowLeftCircle } from 'react-icons/bs';
// import {  useNavigate } from 'react-router-dom';
// import {baseURL}  from '../config';

// const BatchWiseStudents = () => {
//   const [availableBatches, setAvailableBatches] = useState([]);
//   const [selectedBatches, setSelectedBatches] = useState([]);
//   const [students, setStudents] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAvailableBatches = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           return;
//         }

//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };
//         const response = await axios.get(`${baseURL}/api/student/getAllBatches`, config);
//         setAvailableBatches(response.data);
//       } catch (error) {
//         console.error('Error fetching batches:', error);
//       }
//     };

//     fetchAvailableBatches();
//   }, []);

//   const handleCheckboxChange = (batchName) => {
//     setSelectedBatches(prevSelected => {
//       if (prevSelected.includes(batchName)) {
//         return prevSelected.filter(item => item !== batchName);
//       } else {
//         return [...prevSelected, batchName];
//       }
//     });
//   };

//   const handleSubmit = async () => {
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
//       // console.log(selectedBatches,"--------------------------selectedbacthes")
//       const response = await axios.post(`${baseURL}/api/student/getStudentsByBatches`, {
//         batchNames: selectedBatches
//       }, config);
//       //  console.log(response.data,"-------------------------------------studentsbacths")
//       setStudents(response.data.students);
//     } catch (error) {
//       console.error('Error fetching students:', error);
//     }
//   };

//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div>
//       <div onClick={handleGoBack} className=" bg-transparent fw-bolder " style={{ position: 'absolute', left: 10, top: 60 , color:"black", fontWeight:"bolder" , fontSize:"1.5rem"}}>
//         <BsArrowLeftCircle/>
//       </div>
//       <h1>Batch Wise Student details</h1>
//       <div className='mt-5'>
//         <h4>Select Batches:</h4>
//         <Form className="d-flex justify-content-between align-items-center">
//           {availableBatches.map(batch => (
//             <div key={batch.batch_id} className="mb-2">
//               <Form.Check
//                 type="checkbox"
//                 label={batch.batch_name}
//                 onChange={() => handleCheckboxChange(batch.batch_name)}
//                 checked={selectedBatches.includes(batch.batch_name)}
//               />
//             </div>
//           ))}
//           <Button onClick={handleSubmit} disabled={selectedBatches.length === 0}>Submit</Button>
//         </Form>
//       </div>
//       <div className='m-5'>
//         {students.length > 0 && (
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Roll Number</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Phone Number</th>
//                 {/* <th>Batches</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {students.map(student => (
//                 // Exclude super admin role
//                 student.role !== "SUPER ADMIN" && (
//                   <tr key={student.id}>
//                     <td>{student.uniqueStudentId}</td>
//                     <td>{student.name}</td>
//                     <td>{student.email}</td>
//                     <td>{student.phoneNumber}</td>
//                     {/* <td>
//                       <ul>
//                         {student.batches.map(batch => (
//                           <li key={batch.batch_id}>{batch.batch_name}</li>
//                         ))}
//                       </ul>
//                     </td> */}
//                   </tr>
//                 )
//               ))}
//             </tbody>
//           </Table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BatchWiseStudents;


import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../config';
import Paginate from '../common/Paginate';

const BatchWiseStudents = () => {
  const [availableBatches, setAvailableBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableBatches = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(`${baseURL}/api/student/getAllBatches`, config);
        setAvailableBatches(response.data);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };

    fetchAvailableBatches();
  }, []);

  const handleCheckboxChange = (batchName) => {
    setSelectedBatches(prevSelected =>
      prevSelected.includes(batchName)
        ? prevSelected.filter(item => item !== batchName)
        : [...prevSelected, batchName]
    );
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.post(`${baseURL}/api/student/getStudentsByBatches`, {
        batchNames: selectedBatches
      }, config);
      setStudents(response.data.students);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleGoBack = () => navigate(-1);

  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  return (
    <div>
      <div onClick={handleGoBack} className="bg-transparent fw-bolder" style={{ position: 'absolute', left: 10, top: 60, color: "black", fontWeight: "bolder", fontSize: "1.5rem" }}>
        <BsArrowLeftCircle />
      </div>
      <h1>Batch Wise Student details</h1>
      <div className='mt-5'>
        <h4>Select Batches:</h4>
        <Form className="d-flex justify-content-between align-items-center">
          {availableBatches.map(batch => (
            <div key={batch.batch_id} className="mb-2">
              <Form.Check
                type="checkbox"
                label={batch.batch_name}
                onChange={() => handleCheckboxChange(batch.batch_name)}
                checked={selectedBatches.includes(batch.batch_name)}
              />
            </div>
          ))}
          <Button onClick={handleSubmit} disabled={selectedBatches.length === 0}>Submit</Button>
        </Form>
      </div>
      <div className='m-5'>
        {students.length > 0 && (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map(student => (
                  student.role !== "SUPER ADMIN" && (
                    <tr key={student.id}>
                      <td>{student.uniqueStudentId}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.phoneNumber}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </Table>
            <Paginate
              currentPage={currentPage}
              totalItems={students.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default BatchWiseStudents;

