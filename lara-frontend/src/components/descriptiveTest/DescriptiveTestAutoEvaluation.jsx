import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Form, Container, Row, Col, Card, ToastContainer } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlacementTestStudentDetails from "./PlacementTestStudentDetails";
import { baseURL } from "../config";
import CertificateGenerator from "./CertificateGenerator";
import logoUrl from "./laralogo.png";
import qrCodeUrl from "./qr_code_whatsApp.png";


const DescriptiveTestAutoEvaluation = () => {
    const { placement_test_id, placement_test_student_id } = useParams();
    const [questionsWithAnswers, setQuestionsWithAnswers] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState({});
    const [updatedMarks, setUpdatedMarks] = useState({});
    const [updatedComment, setUpdatedComment] = useState({});
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [studentDetails, setStudentDetails] = useState(null);
    const [testDetails, setTestDetails] = useState(null);
    const [totalMarks, setTotalMarks] = useState(0);
    const [obtainedMarks, setObtainedMarks] = useState(0);


    const questionRefs = useRef([]);

    useEffect(() => {
        axios
            .get(`${baseURL}/api/weekly-test/getPlacementTestAnswerDataByStudentId/${placement_test_id}/${placement_test_student_id}`)
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
    }, [placement_test_id, placement_test_student_id]);

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
            .put(`${baseURL}/api/weekly-test/updatePlacementTestMarksAndCommentByStudentId/${placement_test_id}/${placement_test_student_id}/${question_id}`, {
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
            .catch((error) => {
                console.error("Error updating marks and comments, ", error);
                toast.error("Error updating marks and comments.");
            });
    };

    const handleScrollToQuestion = (index) => {
        setActiveQuestionIndex(index);
        questionRefs.current[index].scrollIntoView({ behavior: "smooth" });
    };

    // Calculate totalMarks and obtainedMarks
    useEffect(() => {
        let total = 0;
        let obtained = 0;
        questionsWithAnswers.forEach((item) => {
            total += item.marks;
            obtained += item.studentAnswer?.marks || 0; // Ensure marks are 0 if undefined
        });
        setTotalMarks(total);
        setObtainedMarks(obtained);
    }, [questionsWithAnswers]);

    useEffect(() => {
        // Fetch student and test details
        axios
            .get(`${baseURL}/api/weekly-test/getPlacementTestStudentAndTestDetailsByStudentId/${placement_test_id}/${placement_test_student_id}`)
            .then((response) => {
                setStudentDetails(response.data.student);
                setTestDetails(response.data.test);
                // Set totalMarks and obtainedMarks here, based on test data if available
                setTotalMarks(response.data.test.total_marks); // Example, adjust based on your response structure
                setObtainedMarks(response.data.test.obtained_marks); // Example, adjust based on your response structure
            })
            .catch((error) => {
                console.error("Error fetching student and test details:", error);
            });
    }, [placement_test_id, placement_test_student_id]);

    return (
        <Container fluid className="my-4">
            <Row>
                <Col md={9} className="overflow-auto" style={{ maxHeight: "100vh" }}>
                    <PlacementTestStudentDetails />
                    <div className="text-center">
                        {studentDetails && testDetails ? (
                            <CertificateGenerator
                                studentDetails={studentDetails}
                                testDetails={testDetails}
                                marksForCertificate={obtainedMarks}
                                totalMarks={totalMarks}
                                logoUrl={logoUrl}
                                qrCodeUrl={qrCodeUrl}
                            />
                        ) : (
                            <div>Loading...</div>
                        )}
                    </div>
                    <ToastContainer />
                    <h2 className="mb-4">Detailed Result</h2>
                    {/* <h5>Total Marks: {totalMarks} | Obtained Marks: {obtainedMarks}</h5> */}
                    <h3 className="d-flex justify-content-between align-items-center text-primary" style={{ fontWeight: 'bold', }}>
                        <span>Total Marks:</span>
                        <span className="text-secondary">{totalMarks}</span>
                        <span>|</span>
                        <span>Obtained Marks:</span>
                        <span className="text-success">{obtainedMarks}</span>
                    </h3>


                    {questionsWithAnswers.length === 0 ? (
                        <Card>
                            <Card.Body>
                                <h5>No questions found for this test.</h5>
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

                                    <Row>
                                        <Col md={6}>
                                            <div>
                                                <p><strong>Student's Answer: </strong></p>
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: item.studentAnswer?.answer || "N/A" }}
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
                                            value={updatedMarks[item.question_id] || item.studentAnswer?.marks || 0}
                                            onChange={(e) => setUpdatedMarks({ ...updatedMarks, [item.question_id]: e.target.value })}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group controlId={`comment_${item.question_id}`}>
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control as="textarea" rows={6}
                                            placeholder="comments "
                                            value={updatedComment[item.question_id] || item.studentAnswer?.comment || ""}
                                            onChange={(e) => setUpdatedComment({ ...updatedComment, [item.question_id]: e.target.value })}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Button
                                        variant={item.studentAnswer?.marks ? "success" : "warning"}
                                        onClick={() => handleUpdate(item.question_id, item.marks)}
                                        className="my-2 d-none"
                                    >
                                        Update
                                    </Button>
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </Col>

                <Col md={3} className="overflow-auto" style={{ maxHeight: "100vh" }}>
                    <div className="d-flex flex-column align-items-end">
                        <Row>
                            {questionsWithAnswers.map((item, index) => (
                                <Col xs={6} key={index} className="mb-2 d-flex justify-content-center">
                                    <Button
                                        variant={
                                            index === activeQuestionIndex
                                                ? "primary" // Blue color for the active question button
                                                : item.studentAnswer?.marks
                                                    ? "success"
                                                    : item.studentAnswer?.marks === 0
                                                        ? "danger"
                                                        : "secondary"
                                        }
                                        onClick={() => handleScrollToQuestion(index)}
                                        className="text-nowrap"
                                    >
                                        {item.studentAnswer?.marks > 0 ? "🟢" : item.studentAnswer?.marks === 0 ? "🔴" : "⚪"} Q{index + 1}
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

export default DescriptiveTestAutoEvaluation;
