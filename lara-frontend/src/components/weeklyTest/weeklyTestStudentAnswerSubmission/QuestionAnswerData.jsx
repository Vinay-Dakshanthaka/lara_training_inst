import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from '../../config';

const QuestionAnswerData = ({ wt_id, student_id }) => {
  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the question and answer data by weekly test ID and student ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // const response = await axios.get(`${baseURL}/api/weekly-test/getQuestionAnswerDataByStudentId/${wt_id}/${student_id}`);
        const response = await axios.get(`${baseURL}/api/weekly-test/getQuestionAnswerDataByStudentId/1/2`);
        setQuestionsData(response.data.questions);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };
    fetchData();
  }, [wt_id, student_id]);

  // Render error message if there's an error
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  // Render loading spinner while fetching data
  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading questions and answers...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2>Question and Answer Data</h2>
      {questionsData.length === 0 ? (
        <Alert variant="warning">No questions found for this test.</Alert>
      ) : (
        <Row>
          {questionsData.map((question, index) => (
            <Col key={index} md={6} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Question {index + 1}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    <strong>Topic:</strong> {question.topic || 'Not available'}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Question:</strong> {question.question_text}
                  </Card.Text>
                  <Card.Text>
                    <strong>Marks:</strong> {question.marks} | <strong>Time Allowed:</strong> {question.minutes} minutes
                  </Card.Text>
                  <h5>Student's Answer</h5>
                  {question.studentAnswer ? (
                    <Table striped bordered hover>
                      <tbody>
                        <tr>
                          <td><strong>Answer</strong></td>
                          <td>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: question.studentAnswer.answer || 'Not Attempted'
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Marks Awarded</strong></td>
                          <td>{question.studentAnswer.marks !== null ? question.studentAnswer.marks : 'Not Attempted'}</td>
                        </tr>
                        <tr>
                          <td><strong>Comment</strong></td>
                          <td>{question.studentAnswer.comment || 'No comments'}</td>
                        </tr>
                      </tbody>
                    </Table>
                  ) : (
                    <p>No answer provided.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default QuestionAnswerData;
