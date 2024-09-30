import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Table, FormControl, InputGroup, Button } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';
import * as XLSX from 'xlsx';

const FetchInternalTestResultsByTestId = () => {
  const { internal_test_id } = useParams();
  const [results, setResults] = useState([]); // This will hold the 'students' data
  const [topics, setTopics] = useState([]); // This will hold the 'topics' data
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token provided.");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.post(`${baseURL}/api/internal-test/getAllInternalTestResultsByTestId`, { internal_test_id }, config);
        // console.log('students ', response.data)
        setResults(response.data.students); // Set only the 'students' part of the response
        setTopics(response.data.topics); // Store 'topics' separately
        setLoading(false);
      } catch (error) {
        console.error('Error fetching results:', error);
        toast.error('Failed to fetch results.');
        setLoading(false);
      }
    };

    fetchResults();
  }, [internal_test_id]);

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
          return sortOrder === 'asc'
            ? (a.student_details?.student_name || '').localeCompare((b.student_details?.student_name || ''))
            : (b.student_details?.student_name || '').localeCompare((a.student_details?.student_name || ''));
        } else if (sortBy === 'marks_obtained') {
          return sortOrder === 'asc' ? a.marks_obtained - b.marks_obtained : b.marks_obtained - a.marks_obtained;
        }
        return 0;
      });
      setResults(sortedResults);
    }
  }, [sortBy, sortOrder, results]);

  const applyFilters = () => {
    let filteredResults = results;

    if (filterName) {
      filteredResults = filteredResults.filter(result =>
        (result.student_details?.student_name || '').toLowerCase().includes(filterName.toLowerCase())
      );
    }

    return filteredResults;
  };

  // Function to download Excel with details and topics
  const downloadExcelWithDetails = () => {
    const sortedResults = [...results].sort((a, b) => b.marks_obtained - a.marks_obtained);

    // Create a comma-separated string of topics
    const topicsString = topics.join(', ');

    // Create an array for Excel data
    const dataToExport = sortedResults.map(result => ({
      'Student Name': result.student_details?.student_name || '',
      'Email': result.student_details?.email || '',
      'Phone': result.student_details?.phone_number || '',
      'Marks Obtained': result.marks_obtained,
      'Total Marks': result.total_marks,
    }));

    const worksheet = XLSX.utils.json_to_sheet([]);

    // Add topics in the first row
    XLSX.utils.sheet_add_aoa(worksheet, [['Topics: ' + topicsString]], { origin: 'A1' });

    // Add the rest of the data after the topics row
    XLSX.utils.sheet_add_json(worksheet, dataToExport, { origin: 'A2' });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results with Details');

    XLSX.writeFile(workbook, `Test_${internal_test_id}_Results_With_Details.xlsx`);
  };

  // New download function without email and phone number and with topics
  const downloadExcelWithoutDetails = () => {
    const sortedResults = [...results].sort((a, b) => b.marks_obtained - a.marks_obtained);

    const topicsString = topics.join(', ');

    const dataToExport = sortedResults.map(result => ({
      'Student Name': result.student_details?.student_name || '',
      'Marks Obtained': result.marks_obtained,
      'Total Marks': result.total_marks,
    }));

    const worksheet = XLSX.utils.json_to_sheet([]);

    XLSX.utils.sheet_add_aoa(worksheet, [['Topics: ' + topicsString]], { origin: 'A1' });
    XLSX.utils.sheet_add_json(worksheet, dataToExport, { origin: 'A2' });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results Without Details');

    XLSX.writeFile(workbook, `Test_${internal_test_id}_Results_Without_Details.xlsx`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5 resp">
      <h2>Internal Test Results</h2>

      {/* Topics Table */}
      <Table striped bordered hover responsive className="mb-3">
        <thead>
          <tr>
            <th>Test Conducted on these topics</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{topics.join(', ')}</td>
          </tr>
        </tbody>
      </Table>

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Filter by Student Name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <Button variant="primary" onClick={downloadExcelWithDetails}>
          Download Results (with Email & Phone)
        </Button>
        <Button variant="secondary" onClick={downloadExcelWithoutDetails} className="ms-2">
          Download Results (Name, Marks only)
        </Button>
      </InputGroup>

      <Table striped bordered hover responsive>
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
            <tr key={result.internal_test_student_id}>
              <td>{index + 1}</td>
              <td>{result.student_details?.student_name || ''}</td>
              <td>{result.student_details?.email || ''}</td>
              <td>{result.student_details?.phone_number || ''}</td>
              <td>{result.marks_obtained}</td>
              <td>{result.total_marks}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* <ToastContainer position="top-right" /> */}
    </div>
  );
};

export default FetchInternalTestResultsByTestId;
