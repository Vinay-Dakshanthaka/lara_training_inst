import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Container, Spinner, Alert, Table } from 'react-bootstrap';
import { baseURL } from '../../config';
import { useParams } from 'react-router-dom';

const WeeklyTestPerformanceForAdmin = () => {
  const { student_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState({});
  const [testData, setTestData] = useState([]);
  const [overallPerformance, setOverallPerformance] = useState([]);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/weekly-test/getStudentAndActiveTestsWithAttendanceForAdmin/${student_id}`);
        const tests = response.data.active_tests;

        // Student details
        const studentDetails = response.data.student;
        setStudent(studentDetails);

        // Get latest 3 tests
        const latestTests = tests.slice(0, 3).map(test => ({
          test_description: test.test_description,
          obtained_marks: test.obtained_marks || 0,
          total_available_marks: test.total_available_marks,
          percentage_obtained: ((test.obtained_marks || 0) / test.total_available_marks) * 100,
          test_date: test.test_date, // Store original test date
          has_attended: test.has_attended // Store attendance
        }));

        // Calculate overall performance
        const overall = tests.map(test => ({
          test_description: test.test_description,
          percentage_obtained: ((test.obtained_marks || 0) / test.total_available_marks) * 100
        }));

        setTestData(latestTests);
        setOverallPerformance(overall);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'An error occurred while fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [student_id]);

  // Function to format date properly
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Converts to a user-friendly format
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className='text-center'>Weekly Test Performance</h2>

      {/* Student Details */}
      <div className="student-details mb-4">
        <h4 className="text-center">Student Details</h4>
        <Table striped bordered hover className="text-center">
          <tbody>
            <tr>
              <td><strong>Name</strong></td>
              <td>{student.student_name}</td>
            </tr>
            <tr>
              <td><strong>Email</strong></td>
              <td>{student.student_email}</td>
            </tr>
            <tr>
              <td><strong>Phone</strong></td>
              <td>{student.student_phone}</td>
            </tr>
            <tr>
              <td><strong>Attended Tests Count</strong></td>
              <td>{student.attended_tests_count}</td>
            </tr>
          </tbody>
        </Table>
      </div>

      {/* Available Tests Table */}
      <h4 className="text-center mb-4">Available Tests</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Test Description</th>
            <th>Test Date</th>
            <th>Attended</th>
            <th>Marks Obtained</th>
            <th>Total Marks</th>
          </tr>
        </thead>
        <tbody>
          {testData.map((test, index) => (
            <tr key={index}>
              <td>{test.test_description}</td>
              <td>{formatDate(test.test_date)}</td> {/* Format the date */}
              <td>{test.has_attended ? 'Yes' : 'No'}</td> {/* Display attendance */}
              <td>{test.obtained_marks !== null ? test.obtained_marks : 'N/A'}</td>
              <td>{test.total_available_marks}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Latest 3 Tests - Bar Chart */}
      <h4 className="text-center mt-5">Last 3 Test Performance (Graph)</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={testData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="test_description" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="obtained_marks" fill="#8884d8" name="Marks Obtained" />
          <Bar dataKey="total_available_marks" fill="#82ca9d" name="Total Marks" />
        </BarChart>
      </ResponsiveContainer>

      {/* Overall Performance - Line Chart */}
      <h4 className="mt-5 text-center">Overall Performance (Percentage)</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={overallPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="test_description" />
          <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
          <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
          <Legend />
          <Line type="monotone" dataKey="percentage_obtained" stroke="#8884d8" activeDot={{ r: 8 }} name="Percentage Obtained" />
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default WeeklyTestPerformanceForAdmin;
