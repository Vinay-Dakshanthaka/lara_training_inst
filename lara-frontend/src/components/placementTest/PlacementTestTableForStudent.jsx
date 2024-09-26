import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination } from 'react-bootstrap';
import { baseURL } from '../config';

const PlacementTestTableForStudent = () => {
  const [tests, setTests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(10); // Number of tests to show per page
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseURL}/api/placement-test/get-all-placement-tests`);
        const formattedTests = response.data.placementTests
          .sort((a, b) => b.placement_test_id - a.placement_test_id); // Sort by placement_test_id desc
        setTests(formattedTests);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Failed to fetch placement tests.');
      }
    };

    fetchTests();
  }, []);

  // Pagination logic
  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Placement Tests</h2>
      {loading ? <p>Loading...</p> : null}
      {error ? <p>{error}</p> : null}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Test Link</th>
            <th>Number of Questions</th>
          </tr>
        </thead>
        <tbody>
          {currentTests.map((test) => (
            <tr key={test.placement_test_id}>
              <td><a href={test.test_link} target="_blank" rel="noopener noreferrer">{test.test_link}</a></td>
              <td>{test.number_of_questions}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination className="justify-content-center">
        {[...Array(Math.ceil(tests.length / testsPerPage)).keys()].map(number => (
          <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default PlacementTestTableForStudent;
