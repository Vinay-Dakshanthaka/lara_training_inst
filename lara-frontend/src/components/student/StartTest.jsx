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
        if (autoSubmit) {
            handleSubmit();
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

                // const response = await axios.post(`${baseURL}/api/cumulative-test/getQuestionsByTopicIds`, {
                const response = await axios.post(`${baseURL}/api/cumulative-test/getPracticeQuestionsByTopicIds`, {
                    topic_ids: selectedTopics,
                    numberOfQuestions: numQuestions,
                }, config);

                const fetchedQuestions = response.data;
                setQuestions(fetchedQuestions);
                const totalMarks = fetchedQuestions.reduce((sum, question) => sum + question.no_of_marks_allocated, 0);
                setTotalMarks(totalMarks);
                startTimer();

            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();

        return () => {
            clearInterval(timerRef.current);
        };
    }, [selectedTopics, numQuestions]);

    const startTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timerRef.current);
                    setLoading(true);
                    setAutoSubmit(true);
                    setLoading(false);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(timerRef.current);
    };

    const handleAnswerChange = (questionId, option) => {
        setAnswers(prevAnswers => {
            const currentAnswers = prevAnswers[questionId] || [];
            const newAnswers = currentAnswers.includes(option)
                ? currentAnswers.filter(ans => ans !== option)
                : [...currentAnswers, option];
            return { ...prevAnswers, [questionId]: newAnswers };
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        stopTimer();
    
        try {
            const completed_date_time = new Date().toISOString();
            const obtained_marks = questions.reduce((sum, question) => {
                const selectedOptions = answers[question.cumulative_question_id] || [];
                const correctOptions = question.CorrectAnswers.map(ans => ans.answer_description).sort();
                const isCorrect = selectedOptions.length === correctOptions.length && 
                                  selectedOptions.sort().every(opt => correctOptions.includes(opt));
                if (isCorrect) {
                    return sum + question.no_of_marks_allocated;
                }
                return sum;
            }, 0);
    
            setObtainedMarks(obtained_marks);
    
            const question_ans_data = {};
            questions.forEach(question => {
                question_ans_data[question.cumulative_question_id] = answers[question.cumulative_question_id] || [];
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
            setLoading(false);
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
        return questions.filter(question => answers[question.cumulative_question_id]?.length > 0).length;
    };

    const getUnansweredQuestionsCount = () => {
        return questions.filter(question => !answers[question.cumulative_question_id] || answers[question.cumulative_question_id].length === 0).length;
    };

    const getWrongAnswersCount = () => {
        return questions.filter(question => {
            const selectedOptions = answers[question.cumulative_question_id] || [];
            return selectedOptions.length > 0 &&
                   !selectedOptions.every(opt => question.CorrectAnswers.map(ans => ans.answer_description).includes(opt));
        }).length;
    };

    return (
        <div className="container mt-4">
            <Row className="mb-3">
                <Col><h6>Number of Questions: {numQuestions}</h6></Col>
                <Col><h6>Duration: {formatTime(remainingTime)}</h6></Col>
                <Col><h6>Total Marks: {totalMarks}</h6></Col>
            </Row>
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            ) : (
                <div className="row">
                    <div className="col-lg" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                        {reviewMode ? (
                            <>
                                {questions.map((question, index) => {
                                    const selectedOptions = testResults?.question_ans_data[question.cumulative_question_id] || [];
                                    const correctOptions = question.CorrectAnswers.map(ans => ans.answer_description);
                                    const isCorrect = selectedOptions.length === correctOptions.length &&
                                        selectedOptions.every(opt => correctOptions.includes(opt));
 
                                    return (
                                        <div key={question.cumulative_question_id} ref={el => questionRefs.current[index] = el} className={`p-2 mb-2 border position-relative ${isCorrect ? 'border-success' : 'border-danger'}`}>
                                            <span className="position-absolute top-0 end-0">Marks: {question.no_of_marks_allocated}</span>
                                            <pre style={{paddingRight:'2rem'}}>{index + 1}. {question.question_description}</pre>
                                            <p className={`text-${isCorrect ? 'success' : 'danger'}`}>Your Answer: {selectedOptions.length > 0 ? selectedOptions.join(', ') : "Not Attempted"}</p>
                                            {!isCorrect && (
                                                <p className="text-success">Correct Answer: {correctOptions.join(', ')}</p>
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
                                               <pre style={{paddingRight:'2rem'}}>{index + 1}. {question.question_description}</pre>
                                               <span className="position-absolute top-0 end-0 " style={{maxWidth:'80%'}}>Marks: {question.no_of_marks_allocated}</span>
                                           </Form.Label>
                                           <Col sm="12">
                                               {question.QuestionOptions.map((option, i) => (
                                                   <Form.Check
                                                       type="checkbox"
                                                       label={option.option_description}
                                                       name={`question-${index}`}
                                                       id={`question-${index}-option-${option.option_id}`}
                                                       value={option.option_description}
                                                       checked={answers[question.cumulative_question_id]?.includes(option.option_description) || false}
                                                       onChange={() => handleAnswerChange(question.cumulative_question_id, option.option_description)}
                                                       key={option.option_id}
                                                   />
                                               ))}
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
                                    const selectedOptions = testResults?.question_ans_data[question.cumulative_question_id] || [];
                                    const correctOptions = question.CorrectAnswers.map(ans => ans.answer_description);
                                    const isCorrect = selectedOptions.length === correctOptions.length &&
                                        selectedOptions.every(opt => correctOptions.includes(opt));
                                    return (
                                        <Button
                                            key={question.cumulative_question_id}
                                            variant={selectedOptions.length > 0 ? (isCorrect ? 'success' : 'danger') : 'secondary'}
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
