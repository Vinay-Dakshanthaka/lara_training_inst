// TestSummary.jsx
import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TestSummaryTable = ({ 
    answeredCount, 
    unansweredCount, 
    correctCount, 
    wrongCount, 
    obtainedMarks, 
    totalMarks,
    internal_test_id
}) => {
    return (
        <>
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>Answered</th>
                        <th>Unanswered</th>
                        <th>Correct</th>
                        <th>Wrong</th>
                        <th>Obtained Marks</th>
                        <th>Total Marks</th>
                        <th>Action</th> {/* Added Action column for the link */}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{answeredCount}</td>
                        <td>{unansweredCount}</td>
                        <td>{correctCount}</td>
                        <td>{wrongCount}</td>
                        <td>{obtainedMarks}</td>
                        <td>{totalMarks}</td>
                        <td>
                            <Link to={`/detailed-internal-result/${internal_test_id}`}>
                                <Button variant="info">View Detailed Summary</Button>
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </>
    );
};

export default TestSummaryTable;
