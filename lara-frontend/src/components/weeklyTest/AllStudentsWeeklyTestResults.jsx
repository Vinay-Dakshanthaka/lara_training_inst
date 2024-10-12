import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Table, Container, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { baseURL } from '../config';
import * as XLSX from 'xlsx';

const AllStudentsWeeklyTestResults = () => {
    const { wt_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);
    const [filteredResults, setFilteredResults] = useState(null); // For search functionality
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // Default sort order for marks

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/weekly-test/getAllIndividualStudentResultsForTest/${wt_id}`);
                setResults(response.data);
                setFilteredResults(response.data.student_results); // Initially show all results
            } catch (err) {
                setError(err.response ? err.response.data.message : 'An error occurred while fetching data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [wt_id]);

    // Search Filter Handler
    useEffect(() => {
        if (results) {
            const filtered = results.student_results.filter(student =>
                student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.student_phone.includes(searchTerm)
            );
            setFilteredResults(filtered);
        }
    }, [searchTerm, results]);

    // Sorting Handler (Asc/Desc by Marks)
    const handleSortByMarks = () => {
        const sortedResults = [...filteredResults].sort((a, b) => {
            return sortOrder === 'asc'
                ? a.obtained_marks - b.obtained_marks
                : b.obtained_marks - a.obtained_marks;
        });
        setFilteredResults(sortedResults);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    // Export to Excel Handler
    const handleExportToExcel = () => {
        const dataToExport = filteredResults.map(student => ({
            Student_Name: student.student_name,
            Marks_Obtained: student.obtained_marks,
            Total_Available_Marks: student.total_available_marks
        }));

        // Add metadata (test description and date)
        const worksheetData = [
            ['Test Description:', results.weekly_test.test_description],
            ['Test Date:', results.weekly_test.test_date],
            [], // Empty row for separation
            ['Student Name', 'Marks Obtained', 'Total Available Marks'], // Headers
            ...dataToExport.map(row => [row.Student_Name, row.Marks_Obtained, row.Total_Available_Marks]) // Data
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

        // Download as Excel file
        XLSX.writeFile(workbook, `Weekly_test_${results.weekly_test.test_date}.xlsx`);
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
            <h2>Results for Weekly Test</h2>
            {results && (
                <>
                    <h4>{results.weekly_test.test_description}</h4>
                    <p><strong>Date:</strong> {results.weekly_test.test_date}</p>

                    {/* Search Input */}
                    <div className="row">

                    <Form.Control
                        type="text"
                        placeholder="Search by name, email or phone"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-3 col-7"
                    />
                    <Button onClick={handleExportToExcel} className="mb-3 col-5">Download Results as Excel</Button>
                    </div>

                    {/* Table with sorting */}
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Student Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th onClick={handleSortByMarks} style={{ cursor: 'pointer' }}>
                                    Marks Obtained {sortOrder === 'asc' ? '▲' : '▼'}
                                </th>
                                <th>Total Available Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.length > 0 ? (
                                filteredResults.map((student, index) => (
                                    <tr key={student.student_id}>
                                        <td>{index + 1}</td>
                                        <td>{student.student_name}</td>
                                        <td>{student.student_email}</td>
                                        <td>{student.student_phone}</td>
                                        <td>{student.obtained_marks !== null ? student.obtained_marks : 'Not Available'}</td>
                                        <td>{student.total_available_marks}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No results found for this test.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    {/* Export to Excel Button */}
                </>
            )}
        </Container>
    );
};

export default AllStudentsWeeklyTestResults;
