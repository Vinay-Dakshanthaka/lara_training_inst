import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap'; 
import {baseURL}  from '../config';

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [updatedRoles, setUpdatedRoles] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State to manage current page
  const [studentsPerPage] = useState(10); // Number of students per page
  const [searchValue, setSearchValue] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('name'); // Default search criteria

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
        // Filter out SUPER ADMIN students
        const filteredStudents = response.data.filter(student => student.role !== "SUPER ADMIN");
        setStudents(filteredStudents);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchStudents();
  }, []);

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
  
      // Determine the search URL and parameter based on the search criteria
      switch (searchCriteria) {
        case 'name':
          searchUrl = `${baseURL}/api/student/searchByName`;
          searchParam = 'name';
          break;
        case 'email':
          searchUrl = `${baseURL}/api/student/searchByEmail`;
          searchParam = 'email';
          break;
        case 'phoneNumber':
          searchUrl = `${baseURL}/api/student/searchByPhoneNumber`;
          searchParam = 'phoneNumber';
          break;
        default:
          return; // If invalid search criteria, exit function
      }
  
      // Check if the search value is empty
      if (!searchValue.trim()) {
        // If empty, fetch all students
        const response = await axios.get(`${baseURL}/api/student/getAllStudentDetails`, config);
        const filteredStudents = response.data.filter(student => student.role !== "SUPER ADMIN");
        setStudents(filteredStudents);
      } else {
        // If not empty, perform the search
        const response = await axios.get(searchUrl, {
          ...config,
          params: { [searchParam]: searchValue } // Pass the search value based on the search criteria
        });
        const filteredStudents = response.data;
        setStudents(filteredStudents);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const showAlert = (message, success) => {
    setAlertMessage(message);
    setIsSuccess(success);
    setTimeout(() => {
      setAlertMessage('');
      setIsSuccess(false);
    }, 3000); // Hide the alert after 3 seconds
  };

  const handleUpdateRole = async (studentId) => {
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
  
      console.log("Updating role for student with ID:", studentId); // Debugging
  
      await axios.put(
        `${baseURL}/api/student/updateRole`,
        { id: studentId, role: updatedRoles[studentId] }, // Include both id and role in the request body
        config
      );
  
      console.log("Role updated successfully for student with ID:", studentId); // Debugging

      showAlert('Role updated successfully', true);
  
      // Optionally, you can refresh the student list after the role is updated
      // fetchStudents();
    } catch (error) {
      console.error('Error updating role:', error);
      showAlert('Something went wrong', false);
    }
  };

  const handleRoleChange = (studentId, role) => {
    setUpdatedRoles(prevState => ({
      ...prevState,
      [studentId]: role
    }));
  };

  return (
    <div>
      <h1>All Student Details</h1>
      {alertMessage && (
        <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
          {alertMessage}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
     <div className="mb-3 row ">
  <div className="col-md-4 mb-2 mb-md-0">
    <select
      value={searchCriteria}
      onChange={(e) => setSearchCriteria(e.target.value)}
      className="form-select"
      style={{ width: "auto" }}
    >
      <option value="email">Email</option>
      <option value="phoneNumber">Phone Number</option>
      <option value="name">Name</option>
    </select>
  </div>
  <div className="col-md-6">
    <input
      type="text"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      placeholder={`Search by ${searchCriteria}...`}
      className="form-control"
    />
  </div>
  <div className="col-md-2">
    <button onClick={() => handleSearch(searchCriteria)} className="btn btn-primary">Search</button>
  </div>
</div>


      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phoneNumber}</td>
              <td>
                <select value={updatedRoles[student.id] || student.role} onChange={(e) => handleRoleChange(student.id, e.target.value)}>
                  <option value="STUDENT">STUDENT</option>
                  <option value="TRAINER">TRAINER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td>
                <button className="btn btn-primary" onClick={() => handleUpdateRole(student.id)}>Update</button>
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
    </div>
  );
};

export default AllStudents;
