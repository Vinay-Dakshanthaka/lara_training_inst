import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Modal, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';

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
    const navigate = useNavigate()

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (!showSummary && document.hidden) {
                setAutoSubmit(true);
                await handleSubmitTest();
                navigate('/malpractice-detected');
            }
        };
    
        const handlePopState = async () => {
            if (!showSummary) {
                setAutoSubmit(true);
                await handleSubmitTest();
                navigate('/malpractice-detected');
            }
        };
    
        const setupListeners = () => {
            document.addEventListener("visibilitychange", handleVisibilityChange);
            window.addEventListener("popstate", handlePopState);
        };
    
        const cleanupListeners = () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("popstate", handlePopState);
        };
    
        setupListeners();
    
        return () => {
            cleanupListeners();
        };
    }, [navigate, showSummary]);
     
    
    

    useEffect(() => {
        const fetchTestDetails = async () => {
            try {
                const response1 = await axios.post(`${baseURL}/api/placement-test/fetchTestTopicIdsAndQnNums`, {
                    encrypted_test_id:test_id
                });

                const { topic_ids, number_of_questions, show_result } = response1.data;

                setShowResult(show_result); // Set the showResult state based on API response

                if (!show_result) {
                    // If show_result is false, load questions but do not show summary
                    setShowSummary(false); // Do not show detailed summary
                }

                const response2 = await axios.post(`${baseURL}/api/cumulative-test/getQuestionsByTopicIds`, {
                    topic_ids,
                    numberOfQuestions: number_of_questions
                });

                const questionsWithOptions = response2.data.map(question => ({
                    ...question,
                    options: [
                        question.option_1,
                        question.option_2,
                        question.option_3,
                        question.option_4,
                    ]
                }));

                setQuestions(questionsWithOptions);

                const totalMarks = questionsWithOptions.reduce((sum, question) => sum + question.no_of_marks_allocated, 0);
                setTotalMarks(totalMarks);

                // Set the timer based on the number of questions
                const initialTime = number_of_questions * 60; // 1 minute per question
                setRemainingTime(initialTime);

                setLoading(false);
            } catch (error) {
                if(error.response){
                    if(error.response.status === 403){
                        navigate('/not-found')
                    }else if(error.response.status === 404){
                        navigate('/not-found')
                    }
                }else{
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

    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: selectedOption,
        }));
    };

    const handleSubmitTest = async () => {
        setLoading(true);

        try {
            const completedDateTime = new Date().toISOString();

            const obtainedMarks = questions.reduce((sum, question) => {
                const selectedOption = answers[question.cumulative_question_id];
                if (String(selectedOption) === String(question.correct_option)) {
                    return sum + question.no_of_marks_allocated;
                }
                return sum;
            }, 0);

            setObtainedMarks(obtainedMarks);

            const questionAnsData = {};
            questions.forEach(question => {
                const selectedOption = answers[question.cumulative_question_id] || null;
                questionAnsData[question.cumulative_question_id] = selectedOption;
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
            if(error.response){
                if(error.response.status === 403){
                    alert("You have already completed this test.")
                    setSaveError('You have already completed this test.');
                    navigate('/not-found')
                }
            }else{
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
        return questions.filter(question => answers[question.cumulative_question_id]).length;
    };

    const getUnansweredQuestionsCount = () => {
        return questions.filter(question => !answers[question.cumulative_question_id]).length;
    };

    const getWrongAnswersCount = () => {
        return questions.filter(question => {
            const selectedOption = answers[question.cumulative_question_id];
            return selectedOption && selectedOption !== question.correct_option;
        }).length;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Test</h2>
            <div className="d-flex justify-content-between">
                <div>Total Marks: {totalMarks}</div>
                <div className='fw-bolder '>Time Remaining: {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}</div>
            </div>
            {!showSummary && !testResults && (
                <>
                    {questions.map((question, index) => (
                        <Form key={question.cumulative_question_id} className="mb-3">
                            <Form.Group as={Row}>
                                <Form.Label column sm="12" className="position-relative">
                                    <span>{index + 1}. {question.question_description}</span>
                                    <span className="position-absolute top-0 end-0">Marks: {question.no_of_marks_allocated}</span>
                                </Form.Label>
                                <Col sm="12">
                                    {question.options.map((option, idx) => (
                                        <Form.Check
                                            key={idx}
                                            type="radio"
                                            label={option}
                                            name={`question-${index}`}
                                            value={option}
                                            checked={answers[question.cumulative_question_id] === option}
                                            onChange={(e) => handleAnswerChange(question.cumulative_question_id, e.target.value)}
                                        />
                                    ))}
                                </Col>
                            </Form.Group>
                        </Form>
                    ))}
                </>
            )}

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
                                    <td>{obtainedMarks}</td>
                                </tr>
                                <tr>
                                    <td className="font-weight-bold text-secondary">Total Marks</td>
                                    <td>{totalMarks}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
            {showSummary && !showResult && (
                <h3 className='text-info text-center'>Your result will be updated soon.</h3>
            )}
            <Modal show={modalOpen} >
                <Modal.Header >
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
                        <Button variant="primary" type="submit" disabled={savingStudent} style={{marginTop:'5px'}}>
                            {savingStudent ? 'Saving...' : 'Submit'}
                        </Button>
                    </Form>
                        <Alert variant="danger" className="mt-4">
                            <Alert.Heading>Warning</Alert.Heading>
                            <p>
                                Please be aware that any form of malpractice during the test, such as switching to a different tab or leaving the test window, will result in immediate termination of the test. Ensure that you stay within the test environment at all times to avoid disqualification.
                            </p>
                        </Alert>
                </Modal.Body>
            </Modal>

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

