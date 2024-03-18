import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination, Form } from 'react-bootstrap';
import {baseURL}  from '../config';

const AllStudentsProfiles = () => {
  const [studentProfiles, setStudentProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [searchType, setSearchType] = useState('specialization');
  const [searchValue, setSearchValue] = useState('');

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = studentProfiles.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = async () => {
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
  
      let response;
  
      if (searchType === 'specialization') {
        response = await axios.post(`${baseURL}/api/student/searchBySpecialization`, { specialization: searchValue }, config);
      } else if (searchType === 'qualification') {
        response = await axios.post(`${baseURL}/api/student/searchByQualification`, { highest_education: searchValue }, config);
      }
  
      setStudentProfiles(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching for student profiles:', error);
    }
  };
  

  useEffect(() => {
    const fetchStudentProfiles = async () => {
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
        const response = await axios.get(`${baseURL}/api/student/getAllStudentProfileDetails`, config);
        setStudentProfiles(response.data);
      } catch (error) {
        console.error('Error fetching student profiles:', error);
      }
    };

    fetchStudentProfiles();
  }, []);

  return (
    <div className="container">
      <h1>All Students Profile Details</h1>
      <div className="row">
        <div className="col-md-4">
          <Form.Group controlId="searchType">
            <Form.Label>Search By:</Form.Label>
            <Form.Control as="select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
              <option value="qualification">Highest Qualification</option>
              <option value="specialization">Specialization</option>
            </Form.Control>
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group controlId="searchValue">
            <Form.Label>Search Value:</Form.Label>
            <Form.Control type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Highest Education</th>
              <th>Year of Passout</th>
              <th>Specialization</th>
              <th>Highest Education Percent</th>
              <th>10<sup>th</sup> Percentage</th>
              <th>12<sup>th</sup> Percentage</th>
              <th>Mobile Number</th>
              <th>Father's Name</th>
              <th>Father's Mobile Number</th>
              <th>Father's Occupation</th>
              <th>Mother's Name</th>
              <th>Mother's Mobile Number</th>
              <th>Aadhar Number</th>
              <th>Address</th>
              <th>Pincode</th>
              <th>City</th>
              <th>District</th>
              <th>State</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map(student => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.gender}</td>
                <td>{student.highest_education}</td>
                <td>{student.year_of_passout}</td>
                <td>{student.specialization}</td>
                <td>{student.highest_education_percent}</td>
                <td>{student.tenth_percentage}</td>
                <td>{student.twelth_percentage}</td>
                <td>{student.mobile_number}</td>
                <td>{student.father_name}</td>
                <td>{student.father_mobile_number}</td>
                <td>{student.father_occupation}</td>
                <td>{student.mother_name}</td>
                <td>{student.mother_mobile_number}</td>
                <td>{student.adhaar_number}</td>
                <td>{student.address}</td>
                <td>{student.pincode}</td>
                <td>{student.city}</td>
                <td>{student.district}</td>
                <td>{student.state}</td>
                <td>{student.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='text-center'>
        <Pagination>
          {studentsPerPage !== 0 &&
            Array.from({ length: Math.ceil(studentProfiles.length / studentsPerPage) }).map((_, index) => (
              <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
        </Pagination>
      </div>
    </div>
  );
};

export default AllStudentsProfiles;
