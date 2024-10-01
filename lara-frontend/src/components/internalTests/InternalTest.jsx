// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { Button, Form, Row, Col } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { baseURL } from '../config';
// import TestSummaryTable from './TestSummaryTable';
// import OnlineTestMonitoring from '../placementTest/OnlineTestMonitoring';

// const InternalTest = () => {
//     const [loading, setLoading] = useState(true);
//     const [questions, setQuestions] = useState([]);
//     const [answers, setAnswers] = useState({});
//     const [totalMarks, setTotalMarks] = useState(0);
//     const [obtainedMarks, setObtainedMarks] = useState(0);
//     const [showSummary, setShowSummary] = useState(false);
//     const [remainingTime, setRemainingTime] = useState(0);
//     const [autoSubmit, setAutoSubmit] = useState(false);
//     const timerRef = useRef(null);
//     const { test_id } = useParams();

//     useEffect(() => {
//         const handleVisibilityChange = async () => {
//             if (!showSummary && document.hidden) {
//                 setIsCameraOn(false);
//                 setIsMonitored(false);
//                 setAutoSubmit(true);
//                 await handleSubmitTest();
//                 navigate('/malpractice-detected');
//             }
//         };

//         const handlePopState = async () => {
//             if (!showSummary) {
//                 setAutoSubmit(true);
//                 await handleSubmitTest();
//                 navigate('/malpractice-detected');
//             }
//         };

//         const setupListeners = () => {
//             document.addEventListener("visibilitychange", handleVisibilityChange);
//             window.addEventListener("popstate", handlePopState);
//         };

//         const cleanupListeners = () => {
//             document.removeEventListener("visibilitychange", handleVisibilityChange);
//             window.removeEventListener("popstate", handlePopState);
//         };

//         setupListeners();

//         return () => {
//             cleanupListeners();
//         };
//     }, [navigate, showSummary]);

//     useEffect(() => {
//         fetchTestDetails();
//         return () => {
//             if (timerRef.current) {
//                 clearInterval(timerRef.current);
//             }
//         };
//     }, [test_id]);

//     useEffect(() => {
//         if (autoSubmit) {
//             handleSubmitTest();
//         }
//     }, [autoSubmit]);

//     const fetchTestDetails = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 throw new Error("No token provided.");
//             }
    
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             };
//             const response = await axios.post(`${baseURL}/api/internal-test/fetchQuestionsByInternalTestId`, {
//                 internal_test_id: test_id
//             }, config);
    
//             const testQuestions = response.data.questions;
//             setQuestions(testQuestions);
    
//             // Initialize answers
//             const initialAnswers = {};
//             testQuestions.forEach(question => {
//                 initialAnswers[question.cumulative_question_id] = [];
//             });
//             setAnswers(initialAnswers);
    
//             // Calculate total marks
//             const totalMarks = testQuestions.reduce((sum, question) => sum + question.no_of_marks_allocated, 0);
//             setTotalMarks(totalMarks);
    
//             setRemainingTime(60 * 30); // Example: 30 minutes
//             startTimer(60 * 30);
//             setLoading(false);
//         } catch (error) {
//             handleFetchError(error);
//         }
//     };

//     const handleFetchError = (error) => {
//         if (error.response && error.response.status === 400) {
//             toast.error("You have already attended this test. Please see the result in your dashboard.");
//         } else {
//             console.error('Error fetching test details:', error);
//             toast.error('Failed to fetch test details. Please try again later.');
//         }
//         setLoading(false);
//     };

//     const startTimer = (initialTime) => {
//         timerRef.current = setInterval(() => {
//             setRemainingTime((prevTime) => {
//                 if (prevTime <= 1) {
//                     clearInterval(timerRef.current);
//                     setAutoSubmit(true);
//                     return 0;
//                 }
//                 return prevTime - 1;
//             });
//         }, 1000);
//     };

//     const handleAnswerChange = (questionId, selectedOption, checked) => {
//         setAnswers((prevAnswers) => {
//             const questionAnswers = prevAnswers[questionId] || [];
//             if (checked) {
//                 return {
//                     ...prevAnswers,
//                     [questionId]: [...questionAnswers, selectedOption],
//                 };
//             } else {
//                 return {
//                     ...prevAnswers,
//                     [questionId]: questionAnswers.filter((option) => option !== selectedOption),
//                 };
//             }
//         });
//     };

//     const handleSubmitTest = async () => {
//         setLoading(true);
    
//         try {
//             const obtainedMarks = questions.reduce((sum, question) => {
//                 const selectedOptions = answers[question.cumulative_question_id] || [];
//                 const correctOptions = question.CorrectAnswers.map((answer) => answer.answer_description);
    
//                 const isCorrect = correctOptions.length === selectedOptions.length &&
//                     correctOptions.every((answer) => selectedOptions.includes(answer));
    
//                 return isCorrect ? sum + question.no_of_marks_allocated : sum;
//             }, 0);
    
//             setObtainedMarks(obtainedMarks);
    
//             const detailedResults = questions.map((question) => ({
//                 cumulative_question_id: question.cumulative_question_id,
//                 correct_options: question.CorrectAnswers.map((answer) => answer.answer_description),
//                 selected_options: answers[question.cumulative_question_id] || []
//             }));
    
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 throw new Error("No token provided.");
//             }
    
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             };
    
//             // Call to backend API to save results
//             await axios.post(`${baseURL}/api/internal-test/saveInternalTestResults`, {
//                 internal_test_id: test_id,
//                 student_id: 1, // Use the actual student ID here
//                 marks_obtained: obtainedMarks,
//                 total_marks: totalMarks,
//                 detailed_results: detailedResults, // Send the correctly formatted detailedResults
//             }, config);
    
//             toast.success('Test submitted successfully!');
//             setShowSummary(true);
//             // Stop the timer after submission
//             if (timerRef.current) {
//                 clearInterval(timerRef.current);
//             }
//         } catch (error) {
//             handleSubmissionError(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmissionError = (error) => {
//         if (error.response && error.response.status === 400) {
//             toast.error("You have already attended this test. Please see the result in your dashboard.");
//         } else {
//             console.error('Error submitting test:', error);
//             toast.error('Error submitting test');
//         }
//         setLoading(false);
//     };

//     const getAnsweredQuestionsCount = () => {
//         return questions.filter((question) => answers[question.cumulative_question_id]?.length > 0).length;
//     };

//     const getUnansweredQuestionsCount = () => {
//         return questions.filter((question) => !answers[question.cumulative_question_id]?.length).length;
//     };

//     const getCorrectAnswersCount = () => {
//         return questions.filter((question) => {
//             const selectedOptions = answers[question.cumulative_question_id] || [];
//             const correctOptions = question.CorrectAnswers.map((answer) => answer.answer_description);
//             return correctOptions.length === selectedOptions.length &&
//                 correctOptions.every((answer) => selectedOptions.includes(answer));
//         }).length;
//     };

//     const getWrongAnswersCount = () => {
//         return questions.length - getCorrectAnswersCount();
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="container mt-5">
//             {isMonitored && <OnlineTestMonitoring isCameraOn={isMonitored} style={{ marginLeft: '80%', marginTop: '-8rem', position: 'fixed' }} />}
//             <h2>Test</h2>

//             <div className="d-flex justify-content-between">
//                 <div>Total Marks: {totalMarks}</div>
//                 <div className="fw-bolder">Time Remaining: {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}</div>
//             </div>

//             {!showSummary && (
//                 <>
//                     {questions.map((question, index) => (
//                         <Form key={question.cumulative_question_id} className="mb-4 p-3 rounded shadow-sm border">
//                             <Form.Group as={Row} className="align-items-start">
//                                 <Form.Label column sm="12">
//                                     <pre>{index + 1}. {question.question_description}</pre>
//                                     <span>Marks: {question.no_of_marks_allocated}</span>
//                                 </Form.Label>
//                                 <Col sm="12">
//                                     {question.QuestionOptions.map((option, idx) => (
//                                         <Form.Check
//                                             key={idx}
//                                             type="checkbox"
//                                             label={option.option_description}
//                                             value={option.option_description}
//                                             checked={answers[question.cumulative_question_id]?.includes(option.option_description) || false} // Ensure checked is always a boolean
//                                             onChange={(e) => handleAnswerChange(question.cumulative_question_id, e.target.value, e.target.checked)}
//                                         />
//                                     ))}
//                                 </Col>
//                             </Form.Group>
//                         </Form>
//                     ))}
//                 </>
//             )}

//             {showSummary && (
//                 <TestSummaryTable 
//                     answeredCount={getAnsweredQuestionsCount()} 
//                     unansweredCount={getUnansweredQuestionsCount()} 
//                     correctCount={getCorrectAnswersCount()} 
//                     wrongCount={getWrongAnswersCount()} 
//                     obtainedMarks={obtainedMarks} 
//                     totalMarks={totalMarks} 
//                     internal_test_id={test_id}
//                 />
//             )}

//             {!showSummary && (
//                 <Button variant="success" onClick={handleSubmitTest}>
//                     Submit Test
//                 </Button>
//             )}

//         </div>
//     );
// };

// export default InternalTest;


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';
import TestSummaryTable from './TestSummaryTable';
import OnlineTestMonitoring from '../placementTest/OnlineTestMonitoring';

const InternalTest = () => {
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [totalMarks, setTotalMarks] = useState(0);
    const [obtainedMarks, setObtainedMarks] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [autoSubmit, setAutoSubmit] = useState(false);
    const [isMonitored, setIsMonitored] = useState(false);
    const timerRef = useRef(null);
    const { test_id } = useParams();
    const navigate = useNavigate();

    // Visibility change and popstate handlers for monitoring malpractice
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (!showSummary && document.hidden) {
                setIsMonitored(false);
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
        fetchTestDetails();
        return () => {
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

    const fetchTestDetails = async () => {
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
    
            const response = await axios.post(`${baseURL}/api/internal-test/fetchQuestionsByInternalTestId`, {
                internal_test_id: test_id
            }, config);
    
            const { questions: testQuestions, is_monitored } = response.data;
    
            console.log("Number of questions fetched: ", testQuestions.length);
    
            setQuestions(testQuestions);
            setIsMonitored(is_monitored); // Set the is_monitored state
    
            // Initialize answers
            const initialAnswers = {};
            testQuestions.forEach(question => {
                initialAnswers[question.cumulative_question_id] = [];
            });
            setAnswers(initialAnswers);
    
            // Calculate total marks
            const totalMarks = testQuestions.reduce((sum, question) => sum + question.no_of_marks_allocated, 0);
            setTotalMarks(totalMarks);
    
            // Set remaining time based on the number of questions (1 minute per question)
            const testTimeInMinutes = testQuestions.length; // 1 minute per question based on the length of questions
            const remainingTimeInSeconds = testTimeInMinutes * 60;
    
            // Debugging output
            console.log("Test time in minutes:", testTimeInMinutes);
            console.log("Remaining time in seconds:", remainingTimeInSeconds);
    
            setRemainingTime(remainingTimeInSeconds);
            startTimer(remainingTimeInSeconds); // Start the timer
    
            setLoading(false);
        } catch (error) {
            console.error("Error fetching test details:", error);
            handleFetchError(error);
        }
    };
    
    
    const startTimer = (initialTime) => {
        let preciseTime = initialTime; // Track time more accurately with a variable
        timerRef.current = setInterval(() => {
            preciseTime -= 1; // Decrement the precise time each second
    
            setRemainingTime(preciseTime); // Update state to re-render the UI every second
    
            if (preciseTime <= 0) {
                clearInterval(timerRef.current);
                setAutoSubmit(true); // Trigger auto submission when time runs out
            }
        }, 1000);
    };
    

    // const startTimer = (initialTime) => {
    //     if (isNaN(initialTime)) {
    //         console.error("Invalid initial time for timer:", initialTime);
    //         return;
    //     }
    
    //     timerRef.current = setInterval(() => {
    //         setRemainingTime((prevTime) => {
    //             if (prevTime <= 1) {
    //                 clearInterval(timerRef.current);
    //                 setAutoSubmit(true); // Trigger auto submission when time runs out
    //                 return 0;
    //             }
    //             return prevTime - 1;
    //         });
    //     }, 1000);
    // };
    
    
    

    const handleFetchError = (error) => {
        if (error.response && error.response.status === 400) {
            toast.error("You have already attended this test. Please see the result in your dashboard.");
        } else {
            console.error('Error fetching test details:', error);
            toast.error('Failed to fetch test details. Please try again later.');
        }
        setLoading(false);
    };


    const handleAnswerChange = (questionId, selectedOption, checked) => {
        setAnswers((prevAnswers) => {
            const questionAnswers = prevAnswers[questionId] || [];
            if (checked) {
                return {
                    ...prevAnswers,
                    [questionId]: [...questionAnswers, selectedOption],
                };
            } else {
                return {
                    ...prevAnswers,
                    [questionId]: questionAnswers.filter((option) => option !== selectedOption),
                };
            }
        });
    };

    const handleSubmitTest = async () => {
        setLoading(true);
    
        try {
            const obtainedMarks = questions.reduce((sum, question) => {
                const selectedOptions = answers[question.cumulative_question_id] || [];
                const correctOptions = question.CorrectAnswers.map((answer) => answer.answer_description);
    
                const isCorrect = correctOptions.length === selectedOptions.length &&
                    correctOptions.every((answer) => selectedOptions.includes(answer));
    
                return isCorrect ? sum + question.no_of_marks_allocated : sum;
            }, 0);
    
            setObtainedMarks(obtainedMarks);
    
            const detailedResults = questions.map((question) => ({
                cumulative_question_id: question.cumulative_question_id,
                correct_options: question.CorrectAnswers.map((answer) => answer.answer_description),
                selected_options: answers[question.cumulative_question_id] || []
            }));
    
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token provided.");
            }
    
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
    
            // Call to backend API to save results
            await axios.post(`${baseURL}/api/internal-test/saveInternalTestResults`, {
                internal_test_id: test_id,
                // student_id: 1, // Use the actual student ID here
                marks_obtained: obtainedMarks,
                total_marks: totalMarks,
                detailed_results: detailedResults, // Send the correctly formatted detailedResults
            }, config);
    
            toast.success('Test submitted successfully!');
            setShowSummary(true);
    
            // Stop the timer after submission
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        } catch (error) {
            handleSubmissionError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmissionError = (error) => {
        if (error.response && error.response.status === 400) {
            toast.error("You have already attended this test. Please see the result in your dashboard.");
        } else {
            console.error('Error submitting test:', error);
            toast.error('Error submitting test');
        }
        setLoading(false);
    };

    const getAnsweredQuestionsCount = () => {
        return questions.filter((question) => answers[question.cumulative_question_id]?.length > 0).length;
    };

    const getUnansweredQuestionsCount = () => {
        return questions.filter((question) => !answers[question.cumulative_question_id]?.length).length;
    };

    const getCorrectAnswersCount = () => {
        return questions.filter((question) => {
            const selectedOptions = answers[question.cumulative_question_id] || [];
            const correctOptions = question.CorrectAnswers.map((answer) => answer.answer_description);
            return correctOptions.length === selectedOptions.length &&
                correctOptions.every((answer) => selectedOptions.includes(answer));
        }).length;
    };

    const getWrongAnswersCount = () => {
        return questions.length - getCorrectAnswersCount();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            {isMonitored && (
                <OnlineTestMonitoring
                    isCameraOn={isMonitored}
                    style={{ marginLeft: '80%', marginTop: '-8rem', position: 'fixed' }}
                />
            )}
            <h2>Test</h2>

            <div className="d-flex justify-content-between">
                <div>Total Marks: {totalMarks}</div>
                <div className="fw-bolder">Time Remaining: {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}</div>
            </div>

            {!showSummary && (
                <>
                    {questions.map((question, index) => (
                        <Form key={question.cumulative_question_id} className="mb-4 p-3 rounded shadow-sm border">
                            <Form.Group as={Row} className="align-items-start">
                                <Form.Label column sm="12">
                                    <pre>{index + 1}. {question.question_description}</pre>
                                    <span>Marks: {question.no_of_marks_allocated}</span>
                                </Form.Label>
                                <Col sm="12">
                                    {question.QuestionOptions.map((option, idx) => (
                                        <Form.Check
                                            key={idx}
                                            type="checkbox"
                                            label={option.option_description}
                                            value={option.option_description}
                                            checked={answers[question.cumulative_question_id]?.includes(option.option_description) || false} // Ensure checked is always a boolean
                                            onChange={(e) => handleAnswerChange(question.cumulative_question_id, e.target.value, e.target.checked)}
                                        />
                                    ))}
                                </Col>
                            </Form.Group>
                        </Form>
                    ))}
                </>
            )}

            {showSummary && (
                <TestSummaryTable
                    answeredCount={getAnsweredQuestionsCount()}
                    unansweredCount={getUnansweredQuestionsCount()}
                    correctCount={getCorrectAnswersCount()}
                    wrongCount={getWrongAnswersCount()}
                    obtainedMarks={obtainedMarks}
                    totalMarks={totalMarks}
                    internal_test_id={test_id}
                />
            )}

            {!showSummary && (
                <Button variant="success" onClick={handleSubmitTest}>
                    Submit Test
                </Button>
            )}

        </div>
    );
};

export default InternalTest;
