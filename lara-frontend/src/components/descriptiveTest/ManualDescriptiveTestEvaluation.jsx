import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Form, Container, Row, Col, Card, Collapse, ToastContainer } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PlacementTestStudentDetails from "./PlacementTestStudentDetails";
import { baseURL } from "../config";
import { cosineSimilarity, tokenizeAndVectorize } from "../weeklyTest/weeklyTestStudentAnswerSubmission/evaluvation/autoEvaluvateUtils";

const ManualDescriptiveTestEvaluation = () => {
    const { placement_test_id, placement_test_student_id } = useParams();
    const [questionsWithAnswers, setQuestionsWithAnswers] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState({});
    const [answerKeywords, setAnswerKeywords] = useState({});
    const [updatedMarks, setUpdatedMarks] = useState({});
    const [updatedComment, setUpdatedComment] = useState({});
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [showUnanswered, setShowUnanswered] = useState(false);
    const [isAutoEvaluation, setIsAutoEvaluation] = useState();
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


    useEffect(() => {
        // Fetch student and test details
        axios
            .get(`${baseURL}/api/weekly-test/getPlacementTestStudentAndTestDetailsByStudentId/${placement_test_id}/${placement_test_student_id}`)
            .then((response) => {
                console.log("totola marks " , response.data.test)
                // setStudentDetails(response.data.student);
                // setTestDetails(response.data.test);
                // Set totalMarks and obtainedMarks here, based on test data if available
                setTotalMarks(response.data.test.total_marks); // Example, adjust based on your response structure
                setObtainedMarks(response.data.test.obtained_marks); // Example, adjust based on your response structure
            })
            .catch((error) => {
                console.error("Error fetching student and test details:", error);
            });
            getFinalEvluationDetails();
    }, [placement_test_id, placement_test_student_id]);
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

    const fetchCorrectAnswer = (question_id) => {
        axios
            .get(`${baseURL}/api/weekly-test/getCorrectAnswerForQuestion/${question_id}`)
            .then((response) => {
                setCorrectAnswers((prev) => ({
                    ...prev,
                    [question_id]: response.data.answer,
                }));
                setAnswerKeywords((prev) => ({
                    ...prev,
                    [question_id]: response.data.keywords, // Storing keywords
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
                console.error("Error updating marks and comments, ", error)
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

    const [loadingQuestions, setLoadingQuestions] = useState(
        answeredQuestions.map(() => false)
    );

    const unansweredQuestions = questionsWithAnswers.filter(
        (item) => !item.studentAnswer || !item.studentAnswer.answer
    );

   async function getFinalEvluationDetails(){
        try {
            const response = await axios.put(`${baseURL}/api/weekly-test/getPlacementTestFinalSubmissionDetails/${placement_test_id}/${placement_test_student_id}`);
            const isFinalEvaluation = response.data[0].evaluation
            console.log("final : ", response.data[0].evaluation)
            setIsAutoEvaluation(isFinalEvaluation);

        } catch (error) {
            console.error("Error while fetcing final evaluation status : ", error)
        }
    }

    const autoEvaluateAnswers = async () => {

       
        console.log("auto : ", isAutoEvaluation)
        if (isAutoEvaluation) {
            toast.error("Manual evaluation has been done. So Excluded from Auto-evaluation.");
            return;
        }

        let allUpdated = true;
        console.log("Starting auto evaluation of answers...");

        for (let i = 0; i < answeredQuestions.length; i++) {
            const item = answeredQuestions[i];
            console.log(`Processing question ID ${item.question_id}`);
            const studentAnswer = item.studentAnswer.answer;
            const correctAnswer = correctAnswers[item.question_id];
            const answerKeyword = answerKeywords[item.question_id];

            // Set loading state for the current question
            setLoadingQuestions(prevState => {
                const newState = [...prevState];
                newState[i] = true; // Set the current question as loading
                return newState;
            });

            if (studentAnswer && correctAnswer) {
                const studentVector = tokenizeAndVectorize(studentAnswer);
                const correctVector = tokenizeAndVectorize(correctAnswer);
                const similarity = cosineSimilarity(studentVector, correctVector);
                const threshold = answerKeyword === "1" ? 0.7 : 0.4;
                const isCorrect = similarity >= threshold;
                const marks = isCorrect ? item.marks : 0;
                const comment = isCorrect ? "Correct Answer" : "Incorrect Answer";
                // console.log("Similarity: ", similarity)
                // console.log("Threshold:", threshold);
                // console.log("isCorrect:", isCorrect);

                try {
                    // 2-second delay before evaluating the next question
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    const response = await axios.put(
                        `${baseURL}/api/weekly-test/updatePlacementTestMarksAndCommentByStudentId/${placement_test_id}/${placement_test_student_id}/${item.question_id}`,
                        { marks, comment }
                    );
                    console.log(`Successfully updated marks for question ID ${item.question_id}`);
                    console.log("Marks updated marks : ", response)
                } catch (error) {
                    allUpdated = false;
                    console.error(`Error updating marks for question ID ${item.question_id}:`, error);

                    // Check if error status is 403 (Final evaluation already done)
                    if (error.response && error.response.status === 403) {
                        toast.error("Excluded from auto evaluation...");
                    } else {
                        toast.error("Error updating marks and comments.");
                    }
                }
            }

            // Set loading state to false after processing the current question
            setLoadingQuestions(prevState => {
                const newState = [...prevState];
                newState[i] = false; // Set the current question as not loading
                return newState;
            });
        }

        if (allUpdated) {
            console.log("Auto evaluation completed successfully!");
            toast.success("Answers auto-evaluated successfully!");
        } else {
            console.error("Errors occurred during auto evaluation.");
            toast.error("There was an error during auto evaluation.");
        }
    };


    const handleFinalEvaluation = () => {
        axios
            .put(`${baseURL}/api/weekly-test/updatePlacementTestEvaluationStatus`, {
                placement_test_student_id,
                placement_test_id,
                evaluation: true,
            })
            .then(() => {
                toast.success("Final Evaluation Completed Successfully!");
            })
            .catch(() => {
                toast.error("Error completing final evaluation.");
            });
    };

    return (
        <Container fluid className="my-4">
            <Row>
                <Col md={9} className="overflow-auto" style={{ maxHeight: "100vh" }}>
                    <PlacementTestStudentDetails />
                    <h3 className="d-flex justify-content-between align-items-center text-primary my-3 py-3" style={{ fontWeight: 'bold', }}>
                        <span>Total Marks:</span>
                        <span className="text-secondary">{totalMarks}</span>
                        <span>|</span>
                        <span>Obtained Marks:</span>
                        <span className="text-success">{obtainedMarks}</span>
                    </h3>
                    <Button variant="primary" onClick={autoEvaluateAnswers} className="my-3 mx-3" title="Automated Evaluation">
                        Automated Evaluation
                    </Button>

                    <Button
                        variant="success"
                        onClick={handleFinalEvaluation}
                        className="my-3 mx-3"
                        title="Final Evaluation"
                    >
                        Final Evaluation
                    </Button>

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
                                        disabled={loadingQuestions[index]}
                                    >
                                        {loadingQuestions[index] ? "Evaluating..." : `Q${index + 1}`}
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

export default ManualDescriptiveTestEvaluation;
