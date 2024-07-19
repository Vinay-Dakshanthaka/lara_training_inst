import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../config';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';

const StartTest = () => {
    const location = useLocation();
    const { selectedTopics, numQuestions } = location.state;
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [totalMarks, setTotalMarks] = useState(0);
    const [remainingTime, setRemainingTime] = useState(numQuestions * 60); // in seconds
    const [modalOpen, setModalOpen] = useState(false);
    const [testResults, setTestResults] = useState(null);
    const [reviewMode, setReviewMode] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [obtainedMarks, setObtainedMarks] = useState(0);
    const [loading, setLoading] = useState(false); // New loading state
    const questionRefs = useRef([]);
    const timerRef = useRef(null); // Initialize timerRef with null
    const answersRef = useRef(answers);
    const [autoSubmit, setAutoSubmit] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // User switched tabs or minimized window
                // Navigate back to StudentCumulativeTest component with a state
                // navigate('/studentCumulativeTest', { state: { message: "Test Terminated due to detection of Malpractice" } });
                navigate('/studentCumulativeTest');
            }
        };

        const handlePopState = () => {
            // User clicked on the browser's back button
            // navigate('/studentCumulativeTest', { state: { message: "Test Terminated due to navigation attempt" } });
            navigate('/studentCumulativeTest');
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("popstate", handlePopState);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [navigate]);

    const isMounted = useRef(false);


    useEffect(() => {
        if (autoSubmit) {
            // Pass the current answers state to handleSubmit
            handleSubmit(answers);
            // Reset auto-submit state
            setAutoSubmit(false);
        }
    }, [autoSubmit, answers]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token provided.");
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.post(`${baseURL}/api/cumulative-test/getQuestionsByTopicIds`, {
                    topic_ids: selectedTopics,
                    numberOfQuestions: numQuestions,
                }, config);

                const fetchedQuestions = response.data;
                setQuestions(fetchedQuestions);

                const totalMarks = fetchedQuestions.reduce((sum, question) => sum + question.no_of_marks_allocated, 0);
                setTotalMarks(totalMarks);

                // Start the timer when questions are fetched
                startTimer();

            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();

        // Cleanup function to clear the timer when the component unmounts
        return () => {
            clearInterval(timerRef.current);
        };
    }, [selectedTopics, numQuestions]);

    // Function to start the timer
    const startTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timerRef.current);
                    setLoading(true); // Set loading state to true

                    // Set auto-submit to true
                    setAutoSubmit(true);

                    setLoading(false); // Set loading state to false after setting auto-submit

                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };



    // Function to stop the timer
    const stopTimer = () => {
        clearInterval(timerRef.current);
    };

    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: selectedOption, // Store the selected option value directly
        }));
    };



    const handleSubmit = async () => {
        setLoading(true); // Set loading state to true

        stopTimer(); // Stop the timer

        try {
            const completed_date_time = new Date().toISOString();

            const obtained_marks = questions.reduce((sum, question) => {
                const selectedOption = answers[question.cumulative_question_id];
                // Convert both selectedOption and correctOption to strings for comparison
                if (String(selectedOption) === String(question.correct_option)) {
                    return sum + question.no_of_marks_allocated;
                }
                // console.log('selected option ', selectedOption)
                return sum;
            }, 0);

            setObtainedMarks(obtained_marks);

            const question_ans_data = {};
            questions.forEach(question => {
                const selectedOption = answers[question.cumulative_question_id] || null;
                question_ans_data[question.cumulative_question_id] = selectedOption;
            });

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token provided.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.post(`${baseURL}/api/cumulative-test/saveTestResults`, {
                total_marks: totalMarks,
                completed_date_time,
                obtained_marks,
                question_ans_data,
            }, config);

            setTestResults({
                ...response.data,
                question_ans_data,
            });
            setModalOpen(true);
        } catch (error) {
            console.error('Error saving test results:', error);
        } finally {
            setLoading(false); // Set loading state to false after submission
        }
    };




    const handleCloseModal = () => {
        setModalOpen(false);
        setReviewMode(true);
        setShowSummary(true);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleQuestionClick = (index) => {
        questionRefs.current[index].scrollIntoView({ behavior: 'smooth' });
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

    return (
        <div className="container mt-4">
            <Row className="mb-3">
                <Col><h6>Number of Questions: {numQuestions}</h6></Col>
                <Col><h6>Duration: {formatTime(remainingTime)}</h6></Col>
                <Col><h6>Total Marks: {totalMarks}</h6></Col>
            </Row>
            {loading ? ( // Render preloader if loading state is true
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            ) : (
                <div className="row">
                    <div className="col-lg" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                        {reviewMode ? (
                            <>
                                {questions.map((question, index) => {
                                    const selectedOption = testResults.question_ans_data[question.cumulative_question_id];
                                    const isCorrect = selectedOption === question.correct_option;
                                    return (
                                        <div key={question.cumulative_question_id} ref={el => questionRefs.current[index] = el} className={`p-2 mb-2 border position-relative ${isCorrect ? 'border-success' : 'border-danger'}`}>
                                            <span className="position-absolute top-0 end-0">Marks: {question.no_of_marks_allocated}</span>
                                            <p>{index + 1}. {question.question_description}</p>
                                            <p className={`text-${isCorrect ? 'success' : 'danger'}`}>Your Answer: {selectedOption ? selectedOption : "Not Attempted"}</p>
                                            {!isCorrect && (
                                                <p className="text-success">Correct Answer:  {question.correct_option}</p>
                                            )}
                                        </div>
                                    );
                                })}

                            </>
                        ) : (
                            <>
                                {questions.map((question, index) => (
                                    <Form key={question.cumulative_question_id} className="mb-3" ref={el => questionRefs.current[index] = el}>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="12" className="position-relative">
                                                <span>{index + 1}. {question.question_description}</span>
                                                <span className="position-absolute top-0 end-0">Marks: {question.no_of_marks_allocated}</span>
                                            </Form.Label>
                                            <Col sm="12">
                                                <Form.Check
                                                    type="radio"
                                                    label={question.option_1}
                                                    name={`question-${index}`}
                                                    id={`question-${index}-option-1`}
                                                    value={question.option_1}
                                                    checked={answers[question.cumulative_question_id] === question.option_1}
                                                    onChange={(e) => handleAnswerChange(question.cumulative_question_id, e.target.value)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    label={question.option_2}
                                                    name={`question-${index}`}
                                                    id={`question-${index}-option-2`}
                                                    value={question.option_2}
                                                    checked={answers[question.cumulative_question_id] === question.option_2}
                                                    onChange={(e) => handleAnswerChange(question.cumulative_question_id, e.target.value)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    label={question.option_3}
                                                    name={`question-${index}`}
                                                    id={`question-${index}-option-3`}
                                                    value={question.option_3}
                                                    checked={answers[question.cumulative_question_id] === question.option_3}
                                                    onChange={(e) => handleAnswerChange(question.cumulative_question_id, e.target.value)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    label={question.option_4}
                                                    name={`question-${index}`}
                                                    id={`question-${index}-option-4`}
                                                    value={question.option_4}
                                                    checked={answers[question.cumulative_question_id] === question.option_4}
                                                    onChange={(e) => handleAnswerChange(question.cumulative_question_id, e.target.value)}
                                                />

                                            </Col>
                                        </Form.Group>
                                    </Form>

                                ))}
                                <Button variant="primary" onClick={handleSubmit}>Submit</Button>
                            </>
                        )}
                    </div>
                    {showSummary && (
                        <div className="col-lg-3 ml-lg-2" style={{ position: 'sticky', top: '10px' }}>
                            <h6>Results Summary</h6>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td className='bg-warning'>Total Marks:</td>
                                        <td className='bg-warning fw-bolder'>{totalMarks}</td>
                                    </tr>
                                    <tr>
                                        <td className='bg-warning'>Obtained Marks:</td>
                                        <td className='text-success bg-warning fw-bolder'>{obtainedMarks}</td>
                                    </tr>
                                    <tr>
                                        <td className='bg-warning'>Answered Questions:</td>
                                        <td className='text-dark bg-warning fw-bolder'>{getAnsweredQuestionsCount()}</td>
                                    </tr>
                                    <tr>
                                        <td className='bg-warning'>Unanswered Questions:</td>
                                        <td className='text-secondary bg-warning fw-bolder'>{getUnansweredQuestionsCount()}</td>
                                    </tr>
                                    <tr>
                                        <td className='bg-warning'>Wrong Answers:</td>
                                        <td className='text-danger bg-warning fw-bolder'>{getWrongAnswersCount()}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="d-flex flex-wrap mb-2">
                                {questions.map((question, index) => {
                                    const selectedOption = testResults.question_ans_data[question.cumulative_question_id];
                                    const isCorrect = selectedOption === question.correct_option;
                                    return (
                                        <Button
                                            key={question.cumulative_question_id}
                                            variant={selectedOption ? (isCorrect ? 'success' : 'danger') : 'secondary'}
                                            className="m-1"
                                            onClick={() => handleQuestionClick(index)}
                                        >
                                            {index + 1}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

            )}

            <Modal show={modalOpen} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Test Completed!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You have completed the test. Click below to see your detailed results.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal}>Detailed Summary</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default StartTest;

