import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pagination, Modal, Button, Toast } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import BatchWiseStudents from './BatchWiseStudents';
import {baseURL}  from '../config';

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('name');
  const [batchDetails, setBatchDetails] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [availableBatches, setAvailableBatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
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

        const response = await axios.get(`${baseURL}/api/student/getAllStudentDetails`, config);
        const filteredStudents = response.data.filter(student => student.role === "STUDENT");
        setStudents(filteredStudents);
        console.log("student details :", response.data)
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, []);

  const fetchBatchDetails = async () => {
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

      const response = await axios.get(`${baseURL}/api/student/getAllStudentsWithBatches`, config);
      const filteredStudents = response.data.students.filter(student => student.role !== "SUPER ADMIN");
      setBatchDetails(filteredStudents);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBatchDetails();
  }, []);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddToBatch = (student) => {
    setSelectedStudent(student);
    setSelectedBatches([]);
    setShowModal(true);
  };

  const handleCheckboxChange = (event) => {
    const batchId = parseInt(event.target.value);
    if (event.target.checked) {
      setSelectedBatches(prevState => [...prevState, batchId]);
    } else {
      setSelectedBatches(prevState => prevState.filter(id => id !== batchId));
    }
  };

  const createBatch = () => {
    navigate('/createNewBatch');
  };

  const deassignBatch = async (studentId, batchId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${baseURL}/api/student/deassignBatchesFromStudent`,
        {
          studentId,
          batchIds: [batchId],
        },
        config
      );
      console.log(response.data);
      console.log('Successfully deleted');

      fetchBatchDetails();
    } catch (error) {
      console.error('Error deassigning batch:', error);
    }
  };

  const handleSearch = async (searchCriteria) => {
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
  
      let searchUrl = '';
      let searchParam = '';
  
      switch (searchCriteria) {
        case 'email':
          searchUrl = `${baseURL}/api/student/searchByEmail`;
          searchParam = 'email';
          break;
        case 'phoneNumber':
          searchUrl = `${baseURL}/api/student/searchByPhoneNumber`;
          searchParam = 'phoneNumber';
          break;
        case 'name':
          searchUrl = `${baseURL}/api/student/searchByName`;
          searchParam = 'name';
          break;
        default:
          return;
      }
  
      if (!searchValue.trim()) {
        const response = await axios.get(`${baseURL}/api/student/getAllStudentDetails`, config);
        const filteredStudents = response.data.filter(student => student.role === "STUDENT");
        setStudents(filteredStudents);
      } else {
        const response = await axios.get(searchUrl, {
          ...config,
          params: { [searchParam]: searchValue }
        });
        const filteredStudents = response.data.filter(student => student.role === "STUDENT");
        setStudents(filteredStudents);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const batchWiseStudents = () => {
    navigate('/batchWiseStudents');
  };

  const handleAdd = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(`${baseURL}/api/student/assignBatchesToStudent`, {
        studentId: selectedStudent.id,
        batchIds: selectedBatches,
      }, config);
      setShowModal(false);
      setShowSuccessToast(true);
      fetchBatchDetails();
    } catch (error) {
      console.error(error);
      setShowErrorToast(true);
    }
  };

  const fetchAvailableBatches = async () => {
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

      const response = await axios.get(`${baseURL}/api/student/getAllBatches`, config);
      const unassignedBatches = response.data.filter(batch => {
        // Check if the batch is not assigned to the selected student
        return !batchDetails.find(batchDetail => batchDetail.student.id === selectedStudent.id && batchDetail.batchesDetails.some(detail => detail.batch.batch_id === batch.batch_id))
      });
      setAvailableBatches(unassignedBatches);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (showModal && selectedStudent) {
      fetchAvailableBatches();
    }
  }, [showModal, selectedStudent]);

  return (
    <div>
      <h1>All Student Details</h1>
      <div className="mb-3 row align-items-center">
        <div className="col-md-3 mb-2 mb-md-0">
          <select
            value={searchCriteria}
            onChange={(e) => setSearchCriteria(e.target.value)}
            className="form-select"
          >
            <option value="email">Email</option>
            <option value="phoneNumber">Phone Number</option>
            <option value="name">Name</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={`Search by ${searchCriteria}...`}
            className="form-control"
          />
        </div>
        <div className="col-md-3">
          <button onClick={() => handleSearch(searchCriteria)} className="btn btn-primary">Search</button>
        </div>
        <div className='col-md-6'>
          <button className='btn btn-warning m-2 col-3' onClick={batchWiseStudents}>Filter By Batch</button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Batches</th>
            <th>Add to Batch</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phoneNumber}</td>
              <td>
                {batchDetails
                  .filter(batchStudent => batchStudent.student.id === student.id)
                  .map(batchStudent => (
                    <ul key={batchStudent.student.id}>
                      {batchStudent.batchesDetails.map(batch => (
                        <li key={batch.batch.batch_id}>
                          <div className="d-flex align-items-center justify-content-between">
                            <span>{batch.batch.batch_name}</span>
                            <button className="btn btn-danger ms-2 m-1" onClick={() => deassignBatch(student.id, batch.batch.batch_id)}>
                              <BsTrash />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ))}
              </td>
              <td>
                <button className='btn btn-primary' onClick={() => handleAddToBatch(student)}>Add to Batch</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='text-center'>
        <Pagination>
          {studentsPerPage !== 0 &&
            Array.from({ length: Math.ceil(students.length / studentsPerPage) }).map((_, index) => (
              <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
        </Pagination>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add to Batch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <div>
              <p>Name: {selectedStudent.name}</p>
              <p>Email: {selectedStudent.email}</p>
              <p>Phone Number: {selectedStudent.phoneNumber}</p>
              <div>
                <h6>Select Batches:</h6>
                {availableBatches.map(batch => (
                  <div key={batch.batch_id} className="form-check">
                    <input className="form-check-input" type="checkbox" value={batch.batch_id} onChange={handleCheckboxChange} />
                    <label className="form-check-label">{batch.batch_name}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAdd}>Add</Button>
        </Modal.Footer>
      </Modal>
      <Toast
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        delay={3000}
        autohide
        className="position-fixed top-0 end-0 mt-2 me-2"
        style={{ backgroundColor: 'rgba(40, 167, 69, 0.85)', color: 'white' }}
      >
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>Batches assigned successfully</Toast.Body>
      </Toast>
      <Toast
        show={showErrorToast}
        onClose={() => setShowErrorToast(false)}
        delay={3000}
        autohide
        className="position-fixed top-0 end-0 mt-2 me-2"
        style={{ backgroundColor: 'rgba(220, 53, 69, 0.85)', color: 'white' }}
      >
        <Toast.Header>
          <strong className="me-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>Failed to assign batches</Toast.Body>
      </Toast>
    </div>
  );
};

export default StudentDetails;
