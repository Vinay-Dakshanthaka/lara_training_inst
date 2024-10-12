import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Container, Alert, Spinner, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { baseURL } from '../../config'; 

const WeeklyTestAttendedStudentsList = () => {
  const { wt_id } = useParams(); 
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentEvaluationStatus = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/weekly-test/getStudentEvaluationStatusByWeeklyTestId/${wt_id}`);
        setStudents(response.data.students);
      } catch (error) {
        setError('Failed to fetch student details.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentEvaluationStatus();
  }, [wt_id]);

  if (loading) {
    return (
      <Container className="my-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Student Details</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>  
            <th>#</th>
            <th>Student Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Evaluate</th>
            <th>Evaluation Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.student_id}>
              <td>{index + 1}</td>
              <td>{student.student_name}</td>
              <td>{student.student_email}</td>
              <td>{student.student_phone}</td>
              <td>
              <Link to={`/evaluvate-student-answers/${wt_id}/${student.student_id}`}>Evaluvate</Link>
              </td>
              <td>
                {student.is_evaluation_done ? (
                  <Badge bg="success">Evaluation Done</Badge>
                ) : (
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Evaluation not fully completed for this student</Tooltip>}
                  >
                    <Badge bg="danger">Evaluation Pending</Badge>
                  </OverlayTrigger>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default WeeklyTestAttendedStudentsList;
