import React, { useState, useEffect, useRef } from "react";
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
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0); // Track active question for navigation
  const questionRefs = useRef([]); // Use refs to store question elements for scrolling

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

  // Handle navigation to a specific question
  const handleScrollToQuestion = (index) => {
    setActiveQuestionIndex(index);
    questionRefs.current[index].scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Container fluid className="my-4">
      <Row>
        {/* Left side: Student Answer Details */}
        <Col md={9} className="overflow-auto" style={{ maxHeight: "100vh" }}>
          <StudentDetailsByWeeklyTestId />
          <ToastContainer /> {/* Toast messages container */}
          <h2 className="mb-4">Student Answer Details</h2>

          {questionsWithAnswers.length === 0 ? (
            <Card>
              <Card.Body>
                <h5>No questions found for this student.</h5>
              </Card.Body>
            </Card>
          ) : (
            questionsWithAnswers.map((item, index) => (
              <Card
                key={item.question_id}
                className={`mb-4 ${index === activeQuestionIndex ? "border-primary" : ""}`}
                ref={(el) => (questionRefs.current[index] = el)}
              >
                <Card.Body>
                  <Card.Subtitle className="mb-2 text-muted">Topic: {item.topic || "N/A"}</Card.Subtitle>
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

                  {/* Update Button with conditional variant */}
                  <Button
                    variant={item.studentAnswer.marks && item.studentAnswer.comment ? "success" : "warning"}
                    onClick={() => handleUpdate(item.question_id, item.marks)}
                    className="my-2"
                  >
                    Update
                  </Button>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>

        {/* Right side: Navigation buttons */}
        <Col md={3} className="overflow-auto" style={{ maxHeight: "100vh" }}>
          <div className="d-flex flex-column align-items-end">
            <Row>
              {questionsWithAnswers.map((item, index) => (
                <Col xs={6} key={index} className="mb-2 d-flex justify-content-center">
                  <Button
                    variant={index === activeQuestionIndex ? "primary" : item.studentAnswer.marks && item.studentAnswer.comment ? "success" : "warning"}
                    onClick={() => handleScrollToQuestion(index)}
                    style={{ width: "60px", fontWeight: index === activeQuestionIndex ? "bold" : "normal" }}
                  >
                    {index + 1}
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
