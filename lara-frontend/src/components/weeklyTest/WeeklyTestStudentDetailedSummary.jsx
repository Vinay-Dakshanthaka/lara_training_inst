import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, ToastContainer } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentDetailsByWeeklyTestId from "./StudentDetailsByWeeklyTestId";
import { baseURL } from "../config";

const WeeklyTestStudentDetailedSummary = () => {
  const { wt_id } = useParams();
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token provided.");

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get(`${baseURL}/api/weekly-test/getStudentsWeeklyTestDetailedSummary/${wt_id}`, config)
      .then((response) => {
        const questions = response.data.questions;
        setQuestionsWithAnswers(questions);
        // console.log('questions ', questions);

        questions.forEach((question) => {
          fetchCorrectAnswer(question.question_id);
        });
      })
      .catch(() => {
        toast.error("Error fetching data");
      });
  }, [wt_id]);

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

  return (
    <Container className="my-4">
      {/* <StudentDetailsByWeeklyTestId /> */}
      <ToastContainer />
      <h2 className="mb-4" style={{ textAlign: "center", color: "#4a4a4a", fontWeight: "bold" }}>
        Detailed Summary
      </h2>

      <Row>
        {questionsWithAnswers.length === 0 ? (
          <Col>
            <Card>
              <Card.Body>
                <h5>No Data found</h5>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          questionsWithAnswers.map((item) => (
            <Col key={item.question_id} xs={12} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Subtitle className="mb-2 text-muted">
                    <strong>Topic: </strong> {item.topic || "N/A"}
                  </Card.Subtitle>

                  {/* Display Marks and Comment as Text */}
                  <Row className="mb-3">
                    <Col md={6}>
                      <div>
                        <p style={{ color: "#17a2b8" }}>
                          <strong>Marks Obtained: </strong>
                          {item.studentAnswer.marks !== null ? item.studentAnswer.marks : "Not Graded Yet"}
                        </p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div>
                        <pre>
                          <strong>Comment: </strong>
                          {item.studentAnswer.comment || "No Comments"}
                        </pre>
                      </div>
                    </Col>
                  </Row>

                  {/* Display the question as it is */}
                  <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", color: "#495057" }}>
                    <span className="fw-bolder">Marks : {item.marks} </span> <br />
                    <strong>Question: </strong>{item.question_text}
                  </pre>

                  <Row className="mt-4">
                    <Col md={6}>
                      <div>
                        <p>
                          <strong>Your Answer:</strong>
                        </p>
                        <div
                          dangerouslySetInnerHTML={{ __html: item.studentAnswer.answer }}
                          style={{
                            border: "1px solid #ffc107",
                            padding: "10px",
                            // backgroundColor: "#fff3cd",
                            borderRadius: "0.25rem",
                          }}
                        />
                      </div>
                    </Col>

                    <Col md={6}>
                      <div>
                        <p>
                          <strong>Trainer Provided Answer:</strong>
                        </p>
                        <div
                          dangerouslySetInnerHTML={{ __html: correctAnswers[item.question_id] || "N/A" }}
                          style={{
                            border: "1px solid #28a745",
                            padding: "10px",
                            // backgroundColor: "#d4edda",
                            borderRadius: "0.25rem",
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default WeeklyTestStudentDetailedSummary;
