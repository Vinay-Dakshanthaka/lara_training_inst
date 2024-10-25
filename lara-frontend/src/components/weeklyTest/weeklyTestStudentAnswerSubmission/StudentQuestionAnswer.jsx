import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Form, Container, Row, Col, Card, Collapse, ToastContainer } from "react-bootstrap";
import { baseURL } from "../../config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentDetailsByWeeklyTestId from "../StudentDetailsByWeeklyTestId";

const StudentQuestionAnswer = () => {
  const { wt_id, student_id } = useParams();
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [updatedMarks, setUpdatedMarks] = useState({});
  const [updatedComment, setUpdatedComment] = useState({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showUnanswered, setShowUnanswered] = useState(false);
  const questionRefs = useRef([]);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/weekly-test/getQuestionAnswerDataByStudentId/${wt_id}/${student_id}`)
      .then((response) => {
        const questions = response.data.questions;
        setQuestionsWithAnswers(questions);

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
    let comment = updatedComment[question_id];

    if (marks > maxMarks) {
      toast.error(`Marks cannot exceed the maximum of ${maxMarks}`);
      return;
    }

    if (marks === undefined) {
      toast.error("Marks cannot be empty.");
      return;
    }

    if (!comment) {
      comment = "N/A";
    }

    axios
      .put(`${baseURL}/api/weekly-test/updateMarksAndCommentByStudentId/${wt_id}/${student_id}/${question_id}`, {
        marks,
        comment,
      })
      .then(() => {
        toast.success("Marks and comments updated successfully!");

        setQuestionsWithAnswers((prev) =>
          prev.map((item) =>
            item.question_id === question_id
              ? {
                ...item,
                studentAnswer: {
                  ...item.studentAnswer,
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

  const handleScrollToQuestion = (index) => {
    setActiveQuestionIndex(index);
    questionRefs.current[index].scrollIntoView({ behavior: "smooth" });
  };

  // Filter out questions where the student's answer is "Not Attempted" or null
  const answeredQuestions = questionsWithAnswers.filter(
    (item) => item.studentAnswer && item.studentAnswer.answer && item.studentAnswer.answer !== "Not Attempted"
  );
  const unansweredQuestions = questionsWithAnswers.filter(
    (item) => !item.studentAnswer || !item.studentAnswer.answer
  );

  return (
    <Container fluid className="my-4">
      <Row>
        <Col md={9} className="overflow-auto" style={{ maxHeight: "100vh" }}>
          <StudentDetailsByWeeklyTestId />
          <ToastContainer />
          <h2 className="mb-4">Student Answer Details</h2>

          {answeredQuestions.length === 0 ? (
            <Card>
              <Card.Body>
                <h5>No answered questions found for this student.</h5>
              </Card.Body>
            </Card>
          ) : (
            answeredQuestions.map((item, index) => (
              <Card
                key={item.question_id}
                className={`mb-4 ${index === activeQuestionIndex ? "border-primary" : ""}`}
                ref={(el) => (questionRefs.current[index] = el)}
              >
                <Card.Body>
                  <Card.Subtitle className="mb-2 text-muted">Topic: {item.topic || "N/A"}</Card.Subtitle>
                  <pre style={{ whiteSpace: "pre-wrap" }}>Question: {item.question_text}</pre>

                  <p><strong>Marks: </strong>{item.marks}</p>

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
                      placeholder="Enter comments (Optional)"
                      value={updatedComment[item.question_id] || item.studentAnswer.comment}
                      onChange={(e) => setUpdatedComment({ ...updatedComment, [item.question_id]: e.target.value })}
                    />
                  </Form.Group>

                  <Button
                    variant={item.studentAnswer.marks ? "success" : "warning"}
                    onClick={() => handleUpdate(item.question_id, item.marks)}
                    className="my-2"
                  >
                    Update
                  </Button>
                </Card.Body>
              </Card>
            ))
          )}

          <Button
            onClick={() => setShowUnanswered(!showUnanswered)}
            aria-controls="unanswered-collapse"
            aria-expanded={showUnanswered}
            className="my-3"
          >
            {showUnanswered ? "Hide Unanswered Questions" : "Show Unanswered Questions"}
          </Button>

          <Collapse in={showUnanswered}>
            <div id="unanswered-collapse">
              {unansweredQuestions.length === 0 ? (
                <Card>
                  <Card.Body>
                    <h5>No unanswered questions found.</h5>
                  </Card.Body>
                </Card>
              ) : (
                unansweredQuestions.map((item, index) => (
                  <Card key={item.question_id} className="mb-4">
                    <Card.Body>
                      <Card.Subtitle className="mb-2 text-muted">Topic: {item.topic || "N/A"}</Card.Subtitle>
                      <pre style={{ whiteSpace: "pre-wrap" }}>Question: {item.question_text}</pre>
                      <p><strong>Marks: </strong>{item.marks}</p>
                      <p><strong>Student's Answer: </strong> Not Answered</p>
                    </Card.Body>
                  </Card>
                ))
              )}
            </div>
          </Collapse>
        </Col>

        <Col md={3} className="overflow-auto" style={{ maxHeight: "100vh" }}>
          <div className="d-flex flex-column align-items-end">
            <Row>
              {answeredQuestions.map((item, index) => (
                <Col xs={6} key={index} className="mb-2 d-flex justify-content-center">
                  <Button
                    variant={index === activeQuestionIndex ? "primary" : item.studentAnswer.marks ? "success" : "warning"}
                    onClick={() => handleScrollToQuestion(index)}
                    className="text-nowrap"
                  >
                    Q{index + 1}
                  </Button>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentQuestionAnswer;
