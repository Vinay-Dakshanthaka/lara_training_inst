import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { baseURL } from '../../config';

const WeeklyTestPerformanceChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testData, setTestData] = useState([]);
  const [overallPerformance, setOverallPerformance] = useState([]);

  // Fetch student id from token (assuming token is stored in localStorage)
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/weekly-test/getStudentAndActiveTestsWithAttendance`, config);
        const tests = response.data.active_tests;

        // Get latest 3 tests
        const latestTests = tests.slice(0, 3).map(test => ({
          test_description: test.test_description,
          obtained_marks: test.obtained_marks || 0,
          total_available_marks: test.total_available_marks,
          percentage_obtained: ((test.obtained_marks || 0) / test.total_available_marks) * 100 // Normalize marks to percentage
        }));

        // Calculate overall performance
        const overall = tests.map(test => ({
          test_description: test.test_description,
          percentage_obtained: ((test.obtained_marks || 0) / test.total_available_marks) * 100 // Normalize marks to percentage
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
  }, []);

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
      
      {/* Latest 3 Tests - Bar Chart */}
      <h4 className='text-center'>Last 3 Test performance Graph </h4>
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
      <h4 className="mt-5">Overall Performance (Percentage)</h4>
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

export default WeeklyTestPerformanceChart;
