import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Form, Container, Row, Col, Card, ToastContainer } from "react-bootstrap";
import { baseURL } from "../../config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentDetailsByWeeklyTestId from "../StudentDetailsByWeeklyTestId";

const StudentQuestionAnswer = () => {
  const { wt_id, student_id } = useParams(); // Get the weekly test ID and student ID from route params
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [updatedMarks, setUpdatedMarks] = useState({});
  const [updatedComment, setUpdatedComment] = useState({});

  useEffect(() => {
    axios
      .get(`${baseURL}/api/weekly-test/getQuestionAnswerDataByStudentId/${wt_id}/${student_id}`)
      .then((response) => {
        const questions = response.data.questions;
        setQuestionsWithAnswers(questions);

        // Fetch correct answers for all questions
        questions.forEach((question) => {
          fetchCorrectAnswer(question.question_id);
        });
      })
      .catch(() => {
        toast.error("Error fetching data");
      });
  }, [wt_id, student_id]);

  const fetchCorrectAnswer = (question_id) => {
    axios
      .get(`${baseURL}/api/weekly-test/getCorrectAnswerForQuestion/${question_id}`)
      .then((response) => {
        setCorrectAnswers((prev) => ({
          ...prev,
          [question_id]: response.data.answer,
        }));
      })
      .catch(() => {
        toast.error("Error fetching correct answer.");
      });
  };

  const handleUpdate = (question_id, maxMarks) => {
    const marks = updatedMarks[question_id];
    const comment = updatedComment[question_id];
  
    // Validation: Marks should not exceed the maximum assigned marks
    if (marks > maxMarks) {
      toast.error(`Marks cannot exceed the maximum of ${maxMarks}`);
      return;
    }
  
    if (marks === undefined || comment === undefined) {
      toast.error("Marks and comment cannot be empty.");
      return;
    }
  
    axios
      .put(`${baseURL}/api/weekly-test/updateMarksAndCommentByStudentId/${wt_id}/${student_id}/${question_id}`, {
        marks,
        comment,
      })
      .then(() => {
        toast.success("Marks and comments updated successfully!");
  
        // Update local state: only modify the `marks` and `comment` of `studentAnswer`, while keeping the `answer` intact
        setQuestionsWithAnswers((prev) =>
          prev.map((item) =>
            item.question_id === question_id
              ? {
                  ...item,
                  studentAnswer: {
                    ...item.studentAnswer, // Keep the existing `answer`
                    marks,
                    comment,
                  },
                }
              : item
          )
        );
      })
      .catch(() => {
        toast.error("Error updating marks and comments.");
      });
  };
  

  return (
    <Container className="my-4">
        <StudentDetailsByWeeklyTestId />
      <ToastContainer /> {/* Toast messages container */}
      <h2 className="mb-4">Student Answer Details</h2>

      <Row>
        {questionsWithAnswers.length === 0 ? (
          <Col>
            <Card>
              <Card.Body>
                <h5>No questions found for this student.</h5>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          questionsWithAnswers.map((item) => (
            <Col key={item.question_id} xs={12} className="mb-4"> 
              <Card>
                <Card.Body>
                  {/* <Card.Title></Card.Title> */}
                  <Card.Subtitle className="mb-2 text-muted">Topic: {item.topic || "N/A"}</Card.Subtitle>

                  {/* Display the question as it is using <pre> tag */}
                  <pre style={{ whiteSpace: "pre-wrap" }}>Question: {item.question_text}</pre>

                  <p><strong>Marks: </strong>{item.marks}</p>

                  {/* Student and Correct Answer side-by-side */}
                  <Row>
                    <Col md={6}>
                      <div>
                        <p><strong>Student's Answer: </strong></p>
                        <div
                          dangerouslySetInnerHTML={{ __html: item.studentAnswer.answer }}
                          style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
                        />
                      </div>
                    </Col>

                    <Col md={6}>
                      <div>
                        <p><strong>Correct Answer: </strong></p>
                        <div
                          dangerouslySetInnerHTML={{ __html: correctAnswers[item.question_id] || "N/A" }}
                          style={{ border: "1px solid #28a745", padding: "10px", marginBottom: "10px" }}
                        />
                      </div>
                    </Col>
                  </Row>

                  {/* Marks and Comments Input */}
                  <Form.Group controlId={`marks_${item.question_id}`}>
                    <Form.Label>Marks</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter marks"
                      value={updatedMarks[item.question_id] || item.studentAnswer.marks}
                      onChange={(e) => setUpdatedMarks({ ...updatedMarks, [item.question_id]: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId={`comment_${item.question_id}`}>
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      placeholder="Enter comments"
                      value={updatedComment[item.question_id] || item.studentAnswer.comment}
                      onChange={(e) => setUpdatedComment({ ...updatedComment, [item.question_id]: e.target.value })}
                    />
                  </Form.Group>

                  <Button variant="primary" onClick={() => handleUpdate(item.question_id, item.marks)} className="my-2">
                    Update
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default StudentQuestionAnswer;
