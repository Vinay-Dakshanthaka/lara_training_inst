import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Table, Container, Spinner, Alert, Button, Form } from 'react-bootstrap';
import { baseURL } from '../config';
import * as XLSX from 'xlsx';
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs';

const AllStudentsWeeklyTestResults = () => {
    const { wt_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);
    const [filteredResults, setFilteredResults] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/weekly-test/getAllIndividualStudentResultsForTest/${wt_id}`);
                console.log("response status-------------------------------- : ", response)
                const modifiedResults = response.data.student_results.map(student => ({
                    ...student,
                    obtained_marks: 
                        typeof student.obtained_marks === "string" && /^[01]+$/.test(student.obtained_marks) 
                            ? parseInt(student.obtained_marks, 2) || 0  // Convert binary to decimal
                            : Number(student.obtained_marks) || 0 // Ensure it's a number
                }));
                setResults(response.data);
                setFilteredResults(modifiedResults);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [wt_id]);
    

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

    const handleSortByMarks = () => {
        const sortedResults = [...filteredResults].sort((a, b) => {
            return sortOrder === 'asc'
                ? a.obtained_marks - b.obtained_marks
                : b.obtained_marks - a.obtained_marks;
        });
        setFilteredResults(sortedResults);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleExportToExcel = () => {
        const dataToExport = filteredResults.map(student => ({
            Student_Name: student.student_name,
            Marks_Obtained: student.obtained_marks,
            Total_Available_Marks: student.total_available_marks
        }));

        const worksheetData = [
            ['Test Description:', results.weekly_test.test_description],
            ['Test Date:', results.weekly_test.test_date],
            [],
            ['Student Name', 'Marks Obtained', 'Total Available Marks'],
            ...dataToExport.map(row => [row.Student_Name, row.Marks_Obtained, row.Total_Available_Marks])
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
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
                                <th>Attended in Lara</th>
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
                                        <td className='text-center'>{student.attended_in_institute ? (<><BsCheckCircleFill className='text-success h4'/></>) : ( <><BsXCircleFill className='text-danger h4'  /></>) }</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No results found for this test.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </>
            )}
        </Container>
    );
};

export default AllStudentsWeeklyTestResults;
