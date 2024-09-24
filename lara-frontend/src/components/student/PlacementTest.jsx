import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Modal, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';
import OnlineTestMonitoring from '../placementTest/OnlineTestMonitoring';

const PlacementTest = () => {
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [totalMarks, setTotalMarks] = useState(0);
    const [modalOpen, setModalOpen] = useState(true); // Open modal on component load
    const [testResults, setTestResults] = useState(null);
    const [showSummary, setShowSummary] = useState(false);
    const [obtainedMarks, setObtainedMarks] = useState(0);
    const [placementTestStudentId, setPlacementTestStudentId] = useState(null);
    const { test_id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: ''
    });
    const [savingStudent, setSavingStudent] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [showResult, setShowResult] = useState(false); // Added state to manage show_result

    const [remainingTime, setRemainingTime] = useState(0); // Timer state
    const [autoSubmit, setAutoSubmit] = useState(false); // Auto-submit state
    const timerRef = useRef(null); // Timer reference
    const navigate = useNavigate();
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMonitored, setIsMonitored] = useState(false);

    const showAlert = () => {
        alert("Allow camera and microphone access inorder to attend the test")
    }

    // useEffect(() => {
    //     const handleVisibilityChange = async () => {
    //         if (!showSummary && document.hidden) {
    //             setIsCameraOn(false);
    //             setIsMonitored(false);
    //             setAutoSubmit(true);
    //             await handleSubmitTest();
    //             navigate('/malpractice-detected');
    //         }
    //     };

    //     const handlePopState = async () => {
    //         if (!showSummary) {
    //             setAutoSubmit(true);
    //             await handleSubmitTest();
    //             navigate('/malpractice-detected');
    //         }
    //     };

    //     const setupListeners = () => {
    //         document.addEventListener("visibilitychange", handleVisibilityChange);
    //         window.addEventListener("popstate", handlePopState);
    //     };

    //     const cleanupListeners = () => {
    //         document.removeEventListener("visibilitychange", handleVisibilityChange);
    //         window.removeEventListener("popstate", handlePopState);
    //     };

    //     setupListeners();

    //     return () => {
    //         cleanupListeners();
    //     };
    // }, [navigate, showSummary]);

    useEffect(() => {
        const fetchTestDetails = async () => {
            try {
                const response1 = await axios.post(`${baseURL}/api/placement-test/fetchTestTopicIdsAndQnNums`, {
                    encrypted_test_id: test_id
                });
                // console.log('response 1 ', response1)

                const { topic_ids, number_of_questions, show_result, is_Monitored } = response1.data;

                setShowResult(show_result); // Set the showResult state based on API response
                setIsMonitored(is_Monitored);
                // console.log('is monitored ', is_Monitored)
                if (!show_result) {
                    // If show_result is false, load questions but do not show summary
                    setShowSummary(false); // Do not show detailed summary
                }

                const response2 = await axios.post(`${baseURL}/api/cumulative-test/fetchQuestionsByTestId`, {
                    placement_test_id: test_id
                });

                const questionsWithOptions = response2.data.map(question => ({
                    ...question,
                    options: question.QuestionOptions.map(opt => ({
                        option_id: opt.option_id,
                        option_description: opt.option_description
                    })),
                    correct_answers: question.CorrectAnswers.map(ans => ans.answer_description)
                }));

                setQuestions(questionsWithOptions);

                const totalMarks = questionsWithOptions.reduce((sum, question) => sum + question.no_of_marks_allocated, 0);
                setTotalMarks(totalMarks);

                // Set the timer based on the number of questions
                const initialTime = number_of_questions * 60; // 1 minute per question
                setRemainingTime(initialTime);

                setLoading(false);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 403) {
                        navigate('/not-found')
                    } else if (error.response.status === 404) {
                        navigate('/not-found')
                    }
                } else {
                    console.error('Error fetching test details:', error);
                    setLoading(false);
                }
            }
        };

        fetchTestDetails();

        return () => {
            // Clean up the timer when the component unmounts
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [test_id]);

    useEffect(() => {
        if (autoSubmit) {
            handleSubmitTest();
        }
    }, [autoSubmit]);

    const startTimer = (initialTime) => {
        timerRef.current = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timerRef.current);
                    setAutoSubmit(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const handleAnswerChange = (questionId, selectedOption, checked) => {
        setAnswers(prevAnswers => {
            const questionAnswers = prevAnswers[questionId] || [];
            if (checked) {
                return {
                    ...prevAnswers,
                    [questionId]: [...questionAnswers, selectedOption]
                };
            } else {
                return {
                    ...prevAnswers,
                    [questionId]: questionAnswers.filter(option => option !== selectedOption)
                };
            }
        });
    };

    const handleSubmitTest = async () => {
        setLoading(true);

        try {
            const completedDateTime = new Date().toISOString();

            const obtainedMarks = questions.reduce((sum, question) => {
                const selectedOptions = answers[question.cumulative_question_id] || [];
                const correctOptions = question.correct_answers;

                // Check if the selected options match the correct answers
                const isCorrect = correctOptions.length === selectedOptions.length &&
                    correctOptions.every(answer => selectedOptions.includes(answer));

                if (isCorrect) {
                    return sum + question.no_of_marks_allocated;
                }
                return sum;
            }, 0);

            setObtainedMarks(obtainedMarks);

            const questionAnsData = {};
            questions.forEach(question => {
                const selectedOptions = answers[question.cumulative_question_id] || [];
                questionAnsData[question.cumulative_question_id] = selectedOptions;
            });

            const response = await axios.post(`${baseURL}/api/placement-test/savePlacementTestResults`, {
                placement_test_student_id: placementTestStudentId,
                placement_test_id: test_id,
                marks_obtained: obtainedMarks,
                total_marks: totalMarks
            });

            toast.success('Submitted successfully!')
            setTestResults({
                ...response.data,
                question_ans_data: questionAnsData,
            });
            setIsMonitored(false);
            setIsCameraOn(false);
            setShowSummary(true);
            if (!showResult) {
                // Display a message for pending results
                alert('Your result will be updated soon.');
            }

            // Stop the timer after test submission
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    alert('Cannot Submit Answers Again: You have already submitted your answers for this test')
                } else {
                    toast.error('Error')
                }
            }
            console.error('Error saving test results:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        // Start the timer when the modal is closed
        startTimer(remainingTime);
    };

    const handleSaveStudent = async (e) => {
        e.preventDefault();
        setSavingStudent(true);
        setSaveError(null);

        try {
            const studentData = {
                ...formData,
                placement_test_id: test_id, // Include placement_test_id in the formData
            };
            const response = await axios.post(`${baseURL}/api/placement-test/save-placement-test-student`, studentData);

            if (response.status === 200) {
                if (response.data.existingStudent) {
                    toast.success('Details saved Successfully: Continue to attend the test');
                    setPlacementTestStudentId(response.data.existingStudent.placement_test_student_id);
                } else {
                    toast.success('Details saved Successfully: Continue to attend the test');
                    setPlacementTestStudentId(response.data.newStudent.placement_test_student_id);
                }

                setFormData({
                    name: '',
                    email: '',
                    phone_number: ''
                });
                setModalOpen(false); // Close modal after saving student data
                startTimer(remainingTime); // Start the timer after the modal is closed
            } else {
                setSaveError('Failed to save student data. Please try again.');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    alert("You have already completed this test.")

                    setSaveError('You have already completed this test.');
                    navigate('/not-found');
                }
            } else {
                console.error('Error saving student data:', error);
                setSaveError('Failed to save student data. Please try again.');
            }
        } finally {
            setSavingStudent(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const getAnsweredQuestionsCount = () => {
        return questions.filter(question => answers[question.cumulative_question_id] && answers[question.cumulative_question_id].length > 0).length;
    };

    const getUnansweredQuestionsCount = () => {
        return questions.filter(question => !answers[question.cumulative_question_id] || answers[question.cumulative_question_id].length === 0).length;
    };

    const getWrongAnswersCount = () => {
        return questions.filter(question => {
            const selectedOptions = answers[question.cumulative_question_id] || [];
            const correctOptions = question.correct_answers;

            // Check if the selected options match the correct answers
            return !(correctOptions.length === selectedOptions.length &&
                correctOptions.every(answer => selectedOptions.includes(answer)));
        }).length;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            {/* Camera monitoring */}
            {isMonitored && <OnlineTestMonitoring isCameraOn={isMonitored} style={{ marginLeft: '80%', marginTop: '-8rem', position: 'fixed' }} />}

            <h2>Test</h2>

            {/* Total Marks and Timer */}
            <div className="d-flex justify-content-between">
                <div>Total Marks: {totalMarks}</div>
                <div className="fw-bolder">Time Remaining: {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}</div>
            </div>

            {/* Questions and options */}
            {!showSummary && !testResults && (
                <>
                    {questions.map((question, index) => (
                        <Form key={question.cumulative_question_id} className="mb-4 p-3 rounded shadow-sm border">
                            <Form.Group as={Row} className="align-items-start">
                                <Form.Label column sm="12" className="position-relative">
                                    <pre style={{ maxWidth: '90%', whiteSpace: 'pre-wrap', fontFamily: 'inherit', marginBottom: '10px', fontSize: '1rem' }}>
                                        <code> {index + 1}. {question.question_description}</code>
                                    </pre>
                                    <span className="position-absolute top-0 end-0 bg-light px-2 py-1 rounded" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                                        Marks: {question.no_of_marks_allocated}
                                    </span>
                                </Form.Label>
                                <Col sm="12">
                                    {question.options.map((option, idx) => (
                                        <Form.Check
                                            key={idx}
                                            type="checkbox"
                                            label={option.option_description}
                                            name={`question-${index}`}
                                            value={option.option_description}
                                            checked={answers[question.cumulative_question_id]?.includes(option.option_description)}
                                            onChange={(e) => handleAnswerChange(question.cumulative_question_id, e.target.value, e.target.checked)}
                                            className="mb-2 lead "
                                            style={{ paddingLeft: '1.5rem', fontSize: '0.95rem', fontWeight: '400', }}
                                        />
                                    ))}
                                </Col>
                            </Form.Group>
                        </Form>

                    ))}
                </>
            )}

            {/* Summary and detailed results */}
            {showSummary && showResult && (
                <Card className="mt-5 shadow">
                    <Card.Header>
                        <h3>Summary</h3>
                    </Card.Header>
                    <Card.Body className="p-4 bg-light">
                        <Table bordered hover>
                            <tbody>
                                <tr>
                                    <td className="font-weight-bold text-primary">Total Questions</td>
                                    <td>{questions.length}</td>
                                </tr>
                                <tr>
                                    <td className="font-weight-bold text-success">Answered Questions</td>
                                    <td>{getAnsweredQuestionsCount()}</td>
                                </tr>
                                <tr>
                                    <td className="font-weight-bold text-warning">Unanswered Questions</td>
                                    <td>{getUnansweredQuestionsCount()}</td>
                                </tr>
                                <tr>
                                    <td className="font-weight-bold text-danger">Wrong Answers</td>
                                    <td>{getWrongAnswersCount()}</td>
                                </tr>
                                <tr>
                                    <td className="font-weight-bold text-info">Marks Obtained</td>
                                    <td className='fs-4'>{obtainedMarks}</td>
                                </tr>
                                <tr>
                                    <td className="font-weight-bold text-secondary">Total Marks</td>
                                    <td>{totalMarks}</td>
                                </tr>
                            </tbody>
                        </Table>

                        {/* Detailed results for each question */}
                        <Table responsive bordered hover className="mt-4 ">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Question</th>
                                    <th>Available Options</th>
                                    <th>Your Answers</th>
                                    <th>Correct Answers</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.map((question, index) => (
                                    <tr key={question.cumulative_question_id}>
                                        <td>{index + 1}</td>
                                        <td className='responsive'>
                                            <pre className='lead text-dark' style={{ maxWidth: '40vw', whiteSpace: 'pre-wrap', fontFamily: 'inherit', marginBottom: '10px', fontSize: '1rem' }}>
                                                <code> {index + 1}. {question.question_description}</code>
                                            </pre>
                                        </td>
                                        <td>
                                            <div className="d-grid gap-2">
                                                {question.options.map((option, idx) => (
                                                    <div key={idx} className="p-2 border rounded">
                                                        {option.option_description}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            {answers[question.cumulative_question_id]?.length > 0
                                                ? answers[question.cumulative_question_id].map((answer, idx) => (
                                                    <div key={idx} className={`p-2 rounded ${question.correct_answers.includes(answer) ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                                                        {answer}
                                                    </div>
                                                ))
                                                : <div className="p-2 rounded bg-secondary text-white my-1">Not Attended</div>
                                            }
                                        </td>
                                        <td>
                                            {question.correct_answers.map((correctAnswer, idx) => (
                                                <div key={idx} className="p-2 rounded bg-success text-white my-1">
                                                    {correctAnswer}
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}


            {/* Message if results are not available */}
            {showSummary && !showResult && (
                <h3 className="text-info text-center">Your result will be updated soon.</h3>
            )}

            {/* Student details form modal */}
            <Modal show={modalOpen}>
                <Modal.Header>
                    <Modal.Title>Please Fill the Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSaveStudent}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="phone_number">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        {saveError && <p className="text-danger">{saveError}</p>}
                        <Button variant="primary" type="submit" disabled={savingStudent} style={{ marginTop: '5px' }}>
                            {savingStudent ? 'Saving...' : 'Submit'}
                        </Button>
                    </Form>
                    <Alert variant="info" className="mt-4">
                        <Alert.Heading>Info</Alert.Heading>
                        <p>
                            Please Allow the camera and microphone to attend the test.
                        </p>
                    </Alert>
                    <Alert variant="danger" className="mt-4">
                        <Alert.Heading>Warning</Alert.Heading>
                        <div>
                            Please be aware that any form of malpractice during the test, such as:
                            <ul>
                                <li>Switching to a different tab or leaving the test window</li>
                                <li>Your face should always face towards the screen</li>
                                <li>Ensure that you stay within the test environment until you submit the test</li>
                            </ul>
                            The test will be monitored by the system. If any malpractice is found, the test will be TERMINATED! Adhere to the rules at all times to avoid disqualification.
                        </div>
                    </Alert>
                </Modal.Body>
            </Modal>

            {/* Submit button */}
            {!showSummary && (
                <Button variant="success" onClick={handleSubmitTest}>
                    Submit Test
                </Button>
            )}

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
        </div>

    );
};

export default PlacementTest;
