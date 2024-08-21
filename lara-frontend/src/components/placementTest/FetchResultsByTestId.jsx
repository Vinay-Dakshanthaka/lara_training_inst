import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Table, FormControl, InputGroup, Button } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';
import * as XLSX from 'xlsx';

const FetchResultsByTestId = () => {
  const { test_id } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.post(`${baseURL}/api/placement-test/getAllResultsByTestId`, { placement_test_id: test_id });
        setResults(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching results:', error);
        toast.error('Failed to fetch results.');
        setLoading(false);
      }
    };

    fetchResults();
  }, [test_id]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    if (sortBy) {
      const sortedResults = [...results].sort((a, b) => {
        if (sortBy === 'student_name') {
          return sortOrder === 'asc' ? a.student_details.student_name.localeCompare(b.student_details.student_name) : b.student_details.student_name.localeCompare(a.student_details.student_name);
        } else if (sortBy === 'marks_obtained') {
          return sortOrder === 'asc' ? a.marks_obtained - b.marks_obtained : b.marks_obtained - a.marks_obtained;
        }
        return 0;
      });
      setResults(sortedResults);
    }
  }, [sortBy, sortOrder]);

  const applyFilters = () => {
    let filteredResults = results;

    if (filterName) {
      filteredResults = filteredResults.filter(result =>
        result.student_details.student_name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    return filteredResults;
  };

  const downloadExcel = () => {
    const sortedResults = [...results].sort((a, b) => b.marks_obtained - a.marks_obtained);

    const dataToExport = sortedResults.map(result => ({
      'Student Name': result.student_details.student_name,
      'Email': result.student_details.email,
      'Phone ': result.student_details.phone_number,
      'Marks Obtained': result.marks_obtained,
      'Total Marks': result.total_marks,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

    XLSX.writeFile(workbook, `Test_${test_id}_Results.xlsx`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Placement Test Results</h2>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Filter by Student Name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <Button variant="primary" onClick={downloadExcel}>
          Download Results as Excel
        </Button>
      </InputGroup>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>SI No</th>
            <th onClick={() => handleSort('student_name')}>Student Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th onClick={() => handleSort('marks_obtained')}>Marks Obtained</th>
            <th>Total Marks</th>
          </tr>
        </thead>
        <tbody>
          {applyFilters().map((result, index) => (
            <tr key={result.placement_test_student_id}>
              <td>{index + 1}</td>
              <td>{result.student_details.student_name}</td>
              <td>{result.student_details.email}</td>
              <td>{result.student_details.phone_number}</td>
              <td>{result.marks_obtained}</td>
              <td>{result.total_marks}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default FetchResultsByTestId;
