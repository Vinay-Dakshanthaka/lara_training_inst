// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Button, Form, Modal, Row, Col, Card, Table, Alert } from 'react-bootstrap';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { baseURL } from '../config';
// import OnlineTestMonitoring from '../placementTest/OnlineTestMonitoring';

// const PlacementTest = () => {
//     const [loading, setLoading] = useState(true);
//     const [questions, setQuestions] = useState([]);
//     const [answers, setAnswers] = useState({});
//     const [totalMarks, setTotalMarks] = useState(0);
//     const [modalOpen, setModalOpen] = useState(true); // Open modal on component load
//     const [testResults, setTestResults] = useState(null);
//     const [showSummary, setShowSummary] = useState(false);
//     const [obtainedMarks, setObtainedMarks] = useState(0);
//     const [placementTestStudentId, setPlacementTestStudentId] = useState(null);
//     const { test_id } = useParams();
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         phone_number: ''
//     });
//     const [savingStudent, setSavingStudent] = useState(false);
//     const [saveError, setSaveError] = useState(null);
//     const [showResult, setShowResult] = useState(false); // Added state to manage show_result

//     const [remainingTime, setRemainingTime] = useState(0); // Timer state
//     const [autoSubmit, setAutoSubmit] = useState(false); // Auto-submit state
//     const timerRef = useRef(null); // Timer reference
//     const navigate = useNavigate();
//     const [isCameraOn, setIsCameraOn] = useState(true);
//     const [isMonitored, setIsMonitored] = useState(false);

//     const showAlert = () => {
//         alert("Allow camera and microphone access inorder to attend the test")
//     }

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
//         const fetchTestDetails = async () => {
//             try {
//                 const response1 = await axios.post(`${baseURL}/api/placement-test/fetchTestTopicIdsAndQnNums`, {
//                     encrypted_test_id: test_id
//                 });
//                 // console.log('response 1 ', response1)

//                 const { topic_ids, number_of_questions, show_result, is_Monitored } = response1.data;

//                 setShowResult(show_result); // Set the showResult state based on API response
//                 setIsMonitored(is_Monitored);
//                 // console.log('is monitored ', is_Monitored)
//                 if (!show_result) {
//                     // If show_result is false, load questions but do not show summary
//                     setShowSummary(false); // Do not show detailed summary
//                 }

//                 const response2 = await axios.post(`${baseURL}/api/cumulative-test/fetchQuestionsByTestId`, {
//                     placement_test_id: test_id
//                 });

//                 const questionsWithOptions = response2.data.map(question => ({
//                     ...question,
//                     options: question.QuestionOptions.map(opt => ({
//                         option_id: opt.option_id,
//                         option_description: opt.option_description
//                     })),
//                     correct_answers: question.CorrectAnswers.map(ans => ans.answer_description)
//                 }));

//                 setQuestions(questionsWithOptions);

//                 const totalMarks = questionsWithOptions.reduce((sum, question) => sum + question.no_of_marks_allocated, 0);
//                 setTotalMarks(totalMarks);

//                 // Set the timer based on the number of questions
//                 const initialTime = number_of_questions * 60; // 1 minute per question
//                 setRemainingTime(initialTime);

//                 setLoading(false);
//             } catch (error) {
//                 if (error.response) {
//                     if (error.response.status === 403) {
//                         navigate('/not-found')
//                     } else if (error.response.status === 404) {
//                         navigate('/not-found')
//                     }
//                 } else {
//                     console.error('Error fetching test details:', error);
//                     setLoading(false);
//                 }
//             }
//         };

//         fetchTestDetails();

//         return () => {
//             // Clean up the timer when the component unmounts
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

//     const startTimer = (initialTime) => {
//         timerRef.current = setInterval(() => {
//             setRemainingTime(prevTime => {
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
//         setAnswers(prevAnswers => {
//             const questionAnswers = prevAnswers[questionId] || [];
//             if (checked) {
//                 return {
//                     ...prevAnswers,
//                     [questionId]: [...questionAnswers, selectedOption]
//                 };
//             } else {
//                 return {
//                     ...prevAnswers,
//                     [questionId]: questionAnswers.filter(option => option !== selectedOption)
//                 };
//             }
//         });
//     };

//     const handleSubmitTest = async () => {
//         setLoading(true);

//         try {
//             const completedDateTime = new Date().toISOString();

//             const obtainedMarks = questions.reduce((sum, question) => {
//                 const selectedOptions = answers[question.cumulative_question_id] || [];
//                 const correctOptions = question.correct_answers;

//                 // Check if the selected options match the correct answers
//                 const isCorrect = correctOptions.length === selectedOptions.length &&
//                     correctOptions.every(answer => selectedOptions.includes(answer));

//                 if (isCorrect) {
//                     return sum + question.no_of_marks_allocated;
//                 }
//                 return sum;
//             }, 0);

//             setObtainedMarks(obtainedMarks);

//             const questionAnsData = {};
//             questions.forEach(question => {
//                 const selectedOptions = answers[question.cumulative_question_id] || [];
//                 questionAnsData[question.cumulative_question_id] = selectedOptions;
//             });

//             const response = await axios.post(`${baseURL}/api/placement-test/savePlacementTestResults`, {
//                 placement_test_student_id: placementTestStudentId,
//                 placement_test_id: test_id,
//                 marks_obtained: obtainedMarks,
//                 total_marks: totalMarks
//             });

//             toast.success('Submitted successfully!')
//             setTestResults({
//                 ...response.data,
//                 question_ans_data: questionAnsData,
//             });
//             setIsMonitored(false);
//             setIsCameraOn(false);
//             setShowSummary(true);
//             if (!showResult) {
//                 // Display a message for pending results
//                 alert('Your result will be updated soon.');
//             }

//             // Stop the timer after test submission
//             if (timerRef.current) {
//                 clearInterval(timerRef.current);
//             }

//         } catch (error) {
//             if (error.response) {
//                 if (error.response.status === 400) {
//                     alert('Cannot Submit Answers Again: You have already submitted your answers for this test')
//                 } else {
//                     toast.error('Error')
//                 }
//             }
//             console.error('Error saving test results:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCloseModal = () => {
//         setModalOpen(false);
//         // Start the timer when the modal is closed
//         startTimer(remainingTime);
//     };

//     const handleSaveStudent = async (e) => {
//         e.preventDefault();
//         setSavingStudent(true);
//         setSaveError(null);

//         try {
//             const studentData = {
//                 ...formData,
//                 placement_test_id: test_id, // Include placement_test_id in the formData
//             };
//             const response = await axios.post(`${baseURL}/api/placement-test/save-placement-test-student`, studentData);

//             if (response.status === 200) {
//                 if (response.data.existingStudent) {
//                     toast.success('Details saved Successfully: Continue to attend the test');
//                     setPlacementTestStudentId(response.data.existingStudent.placement_test_student_id);
//                 } else {
//                     toast.success('Details saved Successfully: Continue to attend the test');
//                     setPlacementTestStudentId(response.data.newStudent.placement_test_student_id);
//                 }

//                 setFormData({
//                     name: '',
//                     email: '',
//                     phone_number: ''
//                 });
//                 setModalOpen(false); // Close modal after saving student data
//                 startTimer(remainingTime); // Start the timer after the modal is closed
//             } else {
//                 setSaveError('Failed to save student data. Please try again.');
//             }
//         } catch (error) {
//             if (error.response) {
//                 if (error.response.status === 403) {
//                     alert("You have already completed this test.")

//                     setSaveError('You have already completed this test.');
//                     navigate('/not-found');
//                 }
//             } else {
//                 console.error('Error saving student data:', error);
//                 setSaveError('Failed to save student data. Please try again.');
//             }
//         } finally {
//             setSavingStudent(false);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevData => ({
//             ...prevData,
//             [name]: value
//         }));
//     };

//     const getAnsweredQuestionsCount = () => {
//         return questions.filter(question => answers[question.cumulative_question_id] && answers[question.cumulative_question_id].length > 0).length;
//     };

//     const getUnansweredQuestionsCount = () => {
//         return questions.filter(question => !answers[question.cumulative_question_id] || answers[question.cumulative_question_id].length === 0).length;
//     };

//     const getWrongAnswersCount = () => {
//         return questions.filter(question => {
//             const selectedOptions = answers[question.cumulative_question_id] || [];
//             const correctOptions = question.correct_answers;

//             // Check if the selected options match the correct answers
//             return !(correctOptions.length === selectedOptions.length &&
//                 correctOptions.every(answer => selectedOptions.includes(answer)));
//         }).length;
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="container mt-5">
//             {/* Camera monitoring */}
//             {isMonitored && <OnlineTestMonitoring isCameraOn={isMonitored} style={{ marginLeft: '80%', marginTop: '-8rem', position: 'fixed' }} />}

//             <h2>Test</h2>

//             {/* Total Marks and Timer */}
//             <div className="d-flex justify-content-between">
//                 <div>Total Marks: {totalMarks}</div>
//                 <div className="fw-bolder">Time Remaining: {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}</div>
//             </div>

//             {/* Questions and options */}
//             {!showSummary && !testResults && (
//                 <>
//                     {questions.map((question, index) => (
//                         <Form key={question.cumulative_question_id} className="mb-4 p-3 rounded shadow-sm border">
//                             <Form.Group as={Row} className="align-items-start">
//                                 <Form.Label column sm="12" className="position-relative">
//                                     <pre style={{ maxWidth: '90%', whiteSpace: 'pre-wrap', fontFamily: 'inherit', marginBottom: '10px', fontSize: '1rem' }}>
//                                         <code> {index + 1}. <br />{question.question_description}</code>
//                                     </pre>
//                                     <span className="position-absolute top-0 end-0 bg-light px-2 py-1 rounded" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
//                                         Marks: {question.no_of_marks_allocated}
//                                     </span>
//                                 </Form.Label>
//                                 <Col sm="12">
//                                     {question.options.map((option, idx) => (
//                                         <Form.Check
//                                             key={idx}
//                                             type="checkbox"
//                                             label={option.option_description}
//                                             name={`question-${index}`}
//                                             value={option.option_description}
//                                             checked={answers[question.cumulative_question_id]?.includes(option.option_description)}
//                                             onChange={(e) => handleAnswerChange(question.cumulative_question_id, e.target.value, e.target.checked)}
//                                             className="mb-2 lead "
//                                             style={{ paddingLeft: '1.5rem', fontSize: '0.95rem', fontWeight: '400', }}
//                                         />
//                                     ))}
//                                 </Col>
//                             </Form.Group>
//                         </Form>

//                     ))}
//                 </>
//             )}

//             {/* Summary and detailed results */}
//             {showSummary && showResult && (
//                 <Card className="mt-5 shadow">
//                     <Card.Header>
//                         <h3>Summary</h3>
//                     </Card.Header>
//                     <Card.Body className="p-4 bg-light">
//                         <Table bordered hover>
//                             <tbody>
//                                 <tr>
//                                     <td className="font-weight-bold text-primary">Total Questions</td>
//                                     <td>{questions.length}</td>
//                                 </tr>
//                                 <tr>
//                                     <td className="font-weight-bold text-success">Answered Questions</td>
//                                     <td>{getAnsweredQuestionsCount()}</td>
//                                 </tr>
//                                 <tr>
//                                     <td className="font-weight-bold text-warning">Unanswered Questions</td>
//                                     <td>{getUnansweredQuestionsCount()}</td>
//                                 </tr>
//                                 <tr>
//                                     <td className="font-weight-bold text-danger">Wrong Answers</td>
//                                     <td>{getWrongAnswersCount()}</td>
//                                 </tr>
//                                 <tr>
//                                     <td className="font-weight-bold text-info">Marks Obtained</td>
//                                     <td className='fs-4'>{obtainedMarks}</td>
//                                 </tr>
//                                 <tr>
//                                     <td className="font-weight-bold text-secondary">Total Marks</td>
//                                     <td>{totalMarks}</td>
//                                 </tr>
//                             </tbody>
//                         </Table>

//                         {/* Detailed results for each question */}
//                         <Table responsive bordered hover className="mt-4 ">
//                             <thead>
//                                 <tr>
//                                     <th>#</th>
//                                     <th>Question</th>
//                                     <th>Available Options</th>
//                                     <th>Your Answers</th>
//                                     <th>Correct Answers</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {questions.map((question, index) => (
//                                     <tr key={question.cumulative_question_id}>
//                                         <td>{index + 1}</td>
//                                         <td className='responsive'>
//                                             <pre className='lead text-dark' style={{ maxWidth: '40vw', whiteSpace: 'pre-wrap', fontFamily: 'inherit', marginBottom: '10px', fontSize: '1rem' }}>
//                                                 <code> {index + 1}. <br />{question.question_description}</code>
//                                             </pre>
//                                         </td>
//                                         <td>
//                                             <div className="d-grid gap-2">
//                                                 {question.options.map((option, idx) => (
//                                                     <div key={idx} className="p-2 border rounded">
//                                                         {option.option_description}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </td>
//                                         <td>
//                                             {answers[question.cumulative_question_id]?.length > 0
//                                                 ? answers[question.cumulative_question_id].map((answer, idx) => (
//                                                     <div key={idx} className={`p-2 rounded ${question.correct_answers.includes(answer) ? 'bg-success text-white' : 'bg-danger text-white'}`}>
//                                                         {answer}
//                                                     </div>
//                                                 ))
//                                                 : <div className="p-2 rounded bg-secondary text-white my-1">Not Attended</div>
//                                             }
//                                         </td>
//                                         <td>
//                                             {question.correct_answers.map((correctAnswer, idx) => (
//                                                 <div key={idx} className="p-2 rounded bg-success text-white my-1">
//                                                     {correctAnswer}
//                                                 </div>
//                                             ))}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </Table>
//                     </Card.Body>
//                 </Card>
//             )}


//             {/* Message if results are not available */}
//             {showSummary && !showResult && (
//                 <h3 className="text-info text-center">Your result will be updated soon.</h3>
//             )}

//             {/* Student details form modal */}
//             <Modal show={modalOpen}>
//                 <Modal.Header>
//                     <Modal.Title>Please Fill the Form</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form onSubmit={handleSaveStudent}>
//                         <Form.Group controlId="name">
//                             <Form.Label>Name</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group controlId="email">
//                             <Form.Label>Email</Form.Label>
//                             <Form.Control
//                                 type="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group controlId="phone_number">
//                             <Form.Label>Phone Number</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="phone_number"
//                                 value={formData.phone_number}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         {saveError && <p className="text-danger">{saveError}</p>}
//                         <Button variant="primary" type="submit" disabled={savingStudent} style={{ marginTop: '5px' }}>
//                             {savingStudent ? 'Saving...' : 'Submit'}
//                         </Button>
//                     </Form>
//                     <Alert variant="info" className="mt-4">
//                         <Alert.Heading>Info</Alert.Heading>
//                         <p>
//                             Please Allow the camera and microphone to attend the test.
//                         </p>
//                     </Alert>
//                     <Alert variant="danger" className="mt-4">
//                         <Alert.Heading>Warning</Alert.Heading>
//                         <div>
//                             Please be aware that any form of malpractice during the test, such as:
//                             <ul>
//                                 <li>Switching to a different tab or leaving the test window</li>
//                                 <li>Your face should always face towards the screen</li>
//                                 <li>Ensure that you stay within the test environment until you submit the test</li>
//                             </ul>
//                             The test will be monitored by the system. If any malpractice is found, the test will be TERMINATED! Adhere to the rules at all times to avoid disqualification.
//                         </div>
//                     </Alert>
//                 </Modal.Body>
//             </Modal>

//             {/* Submit button */}
//             {!showSummary && (
//                 <Button variant="success" onClick={handleSubmitTest}>
//                     Submit Test
//                 </Button>
//             )}

//             <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
//         </div>

//     );
// };

// export default PlacementTest;


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Modal, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';
import OnlineTestMonitoring from '../placementTest/OnlineTestMonitoring';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logoUrl from "./laralogo.png";
import qrCodeUrl from "./qr_code_whatsApp.png"
import { WhatsApp } from '@mui/icons-material';
import QRCodeDisplay from './QRCodeDisplay';
import PlacementTestStudentResults from './PlacementTestStudentResults';


const PlacementTest = () => {
    const [loading, setLoading] = useState(true);
    const [testDetails, setTestDetails] = useState()
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [totalMarks, setTotalMarks] = useState(0);
    const [modalOpen, setModalOpen] = useState(true); // Open modal on component load
    const [showForm, setShowForm] = useState(false);
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
    const [isIssueCertificate, setIsIssueCertificate] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);

    let marksForCertificate;

    const showAlert = () => {
        alert("Allow camera and microphone access inorder to attend the test")
    }

    //code to prevent open new tab and opening the context menu 

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (!showSummary && document.hidden) {
                setIsCameraOn(false);
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
        const disableRightClick = (event) => {
            event.preventDefault();
        };

        const disableDevTools = (event) => {
            // Block F12
            if (event.key === "F12") {
                event.preventDefault();
            }
            // Block Ctrl + Shift + I
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "I") {
                event.preventDefault();
            }
        };

        const disableSelection = (event) => {
            event.preventDefault();
        };

        const disableCopy = (event) => {
            event.preventDefault();
        };

        const setupListeners = () => {
            document.addEventListener("contextmenu", disableRightClick); // Disable right-click
            document.addEventListener("keydown", disableDevTools); // Block dev tools
            document.addEventListener("selectstart", disableSelection); // Disable text selection
            document.addEventListener("copy", disableCopy); // Disable copying
        };

        const cleanupListeners = () => {
            document.removeEventListener("contextmenu", disableRightClick);
            document.removeEventListener("keydown", disableDevTools);
            document.removeEventListener("selectstart", disableSelection);
            document.removeEventListener("copy", disableCopy);
        };

        setupListeners();

        return () => {
            cleanupListeners();
        };
    }, []);
    // code to prevent open new tab and opening the context menu ends 

    useEffect(() => {
        const fetchTestDetails = async () => {
            try {
                const response1 = await axios.post(`${baseURL}/api/placement-test/fetchTestTopicIdsAndQnNums`, {
                    encrypted_test_id: test_id,
                });
                console.log("Fetch test details ", response1.data)
                setTestDetails(response1.data)
                const { topic_ids, number_of_questions, show_result, is_Monitored, whatsAppChannelLink, test_title, certificate_name, issue_certificate } = response1.data;

                setShowResult(show_result);
                setIsMonitored(is_Monitored);
                setIsIssueCertificate(issue_certificate)

                if (!show_result) {
                    setShowSummary(false);
                }

                const response2 = await axios.post(`${baseURL}/api/cumulative-test/fetchQuestionsByTestId`, {
                    placement_test_id: test_id,
                });

                const questionsWithOptions = response2.data.map((question) => ({
                    ...question,
                    options: question.QuestionOptions.map((opt) => ({
                        option_id: opt.option_id,
                        option_description: opt.option_description,
                    })),
                    correct_answers: question.CorrectAnswers.map((ans) => ans.answer_description),
                }));

                // Shuffle questions
                const shuffledQuestions = shuffleArray(questionsWithOptions);

                setQuestions(shuffledQuestions);

                const totalMarks = shuffledQuestions.reduce(
                    (sum, question) => sum + question.no_of_marks_allocated,
                    0
                );
                setTotalMarks(totalMarks);

                // Set the timer based on the number of questions
                const initialTime = number_of_questions * 60; // 1 minute per question
                setRemainingTime(initialTime);

                setLoading(false);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 403) {
                        navigate('/test-not-active');
                    } else if (error.response.status === 404) {
                        navigate('/not-found');
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

    // Utility function to shuffle the array
    const shuffleArray = (array) => {
        const shuffled = [...array]; // Create a copy to avoid mutating the original array
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };


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
            marksForCertificate = obtainedMarks
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
            if (isIssueCertificate) {
                generateCertificate();
            }

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



    const sendPdfToEmail = async (pdfBlob) => {
        const { name, email } = formData;

        if (!name || !email) {
            alert("Name and email are required.");
            return;
        }

        const formPayload = new FormData();
        formPayload.append("pdf", pdfBlob, `${name}_Certificate.pdf`);
        formPayload.append("email", email);
        formPayload.append("name", name);

        try {
            const response = await axios.post(
                `${baseURL}/api/placement-test/send-certificate-to-email`,
                formPayload,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.status === 200) {
                toast.success("The certificate has been sent to your registered email")
            }
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            // alert("Failed to send the certificate.");
            toast.warning("Sorry!! We are Unable to send the certificate to you email!")
        }
    };




    const generateCertificate = () => {
        const doc = new jsPDF("landscape"); // Set landscape layout
        const presentDate = new Date().toLocaleString();
        const imgWidth = 40;
        const imgHeight = 40;

        // Validate formData
        if (!formData || !formData.name) {
            alert("Missing required data. Please ensure all fields are filled.");
            return;
        }

        // Draw Background Curves
        doc.setFillColor(76, 149, 228); // Blue color
        doc.rect(0, 0, 297, 210, "F"); // Cover full page
        doc.setFillColor(255, 173, 63); // Orange color
        doc.circle(297, 105, 150, "F"); // Orange curve on the right

        // Load Logo
        const loadImage = new Promise((resolve, reject) => {
            const image = new Image();
            image.src = logoUrl;
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error("Failed to load logo image."));
        });

        // Load QR Code Image
        const loadQRCode = new Promise((resolve, reject) => {
            const qrCode = new Image();
            qrCode.src = qrCodeUrl;  // Provide the URL for the QR code image
            qrCode.onload = () => resolve(qrCode);
            qrCode.onerror = () => reject(new Error("Failed to load QR code image."));
        });

        Promise.all([loadImage, loadQRCode])
            .then(([logoImage, qrCodeImage]) => {
                // Add Logo
                doc.addImage(logoImage, "PNG", 20, 15, imgWidth, imgHeight);

                const pageWidth = doc.internal.pageSize.getWidth();
                const centerX = pageWidth / 2;

                // Header Details
                doc.setFont("times", "bold");
                doc.setFontSize(28);
                doc.setTextColor(255); // White text for header
                doc.text("LARA TECHNOLOGIES", 80, 25);
                doc.setFont("times", "normal");
                doc.setFontSize(12);
                doc.setTextColor(40, 40, 40); // Dark gray text for address and contact
                doc.text(
                    "8, 100 Feet Ring Road, 2nd Stage, BTM Layout, Bengaluru, Karnataka 560076",
                    80,
                    32
                );
                doc.text("+91 79759 38871 | ramesh@lara.co.in", 80, 39);

                // Certificate Title
                doc.setFont("times", "bold");
                doc.setFontSize(28);
                doc.setTextColor(255); // White text for certificate title
                doc.text(
                    "CERTIFICATE OF RECOGNITION",
                    centerX,
                    60,
                    null,
                    null,
                    "center"
                );

                doc.setFont("times", "italic");
                doc.setFontSize(18); // Slightly smaller font for additional line
                doc.setTextColor(255); // White text

                // Fallback to "Logical Reasoning" if certificate_name is not available
                const certificateName = testDetails.certificate_name || "Logical Reasoning";

                doc.text(
                    `in ${certificateName}`,
                    centerX,
                    70, // Adjusted Y position to be below the title
                    null,
                    null,
                    "center"
                );


                // Recipient Details
                doc.setFont("times", "italic");
                doc.setFontSize(26);
                doc.setTextColor(255); // White text for recipient section
                doc.text(
                    "This certificate is hereby bestowed upon",
                    centerX,
                    80,
                    null,
                    null,
                    "center"
                );

                doc.setFont("times", "bold");
                doc.setFontSize(28);
                doc.setTextColor(0, 0, 0); // Black text for the recipient's name
                doc.text(formData.name, centerX, 95, null, null, "center");

                // Marks
                doc.setFont("times", "normal");
                doc.setFontSize(16);
                doc.text(
                    `Marks Obtained: ${marksForCertificate} out of ${totalMarks}`,
                    148.5,
                    105,
                    null,
                    null,
                    "center"
                );

                // Description
                doc.setFont("times", "normal");
                doc.setFontSize(14);
                doc.setTextColor(40, 40, 40); // Dark gray text for description
                doc.text(
                    "For successfully completing the Test conducted by Lara Technologies.",
                    centerX,
                    112,
                    null,
                    null,
                    "center"
                );

                // Table Content
                const tableStartY = 125; // Start position for the table
                const columnSpacing = 70;
                const rowSpacing = 8;
                const tableData = [
                    { label: "Email:", value: formData.email },
                    { label: "College Name:", value: formData.college_name },
                    { label: "University Name:", value: formData.university_name },
                ];

                doc.setFontSize(14);
                doc.setFont("times", "bold")
                tableData.forEach((row, index) => {
                    let yPos = tableStartY + index * rowSpacing;
                    if (yPos > 180) {
                        doc.addPage();
                        yPos = 20; // Reset position for new page
                    }
                    doc.setTextColor(40, 40, 40); // Dark gray text for table labels and values
                    doc.text(row.label, 80, yPos); // Label column
                    const wrappedValue = doc.splitTextToSize(row.value || "N/A", 100);
                    doc.text(wrappedValue, 80 + columnSpacing, yPos); // Value column
                });

                // Footer
                doc.setFont("times", "italic");
                doc.setFontSize(10);
                doc.setTextColor(200, 200, 200); // Light gray text for footer
                doc.text(
                    "Certificate generated on " + presentDate,
                    centerX,
                    190,
                    null,
                    null,
                    "center"
                );

                // QR Code and Message
                const qrCodeX = 10; // X position for QR code (left bottom corner)
                const qrCodeY = 150; // Y position for QR code
                const qrCodeWidth = 40; // Width of QR code
                const qrCodeHeight = 40; // Height of QR code
                doc.addImage(qrCodeImage, "PNG", qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

                // Message below QR Code
                doc.setFont("times", "italic");
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0); // Black text for message
                doc.text("Join our whatsApp channel for more updates", qrCodeX + 0, qrCodeY + 45);

                // // Save Certificate
                // doc.save(`${formData.name}_Lara_Technologies_Certificate.pdf`);

                // const pdfBlob = doc.output("blob"); // Generate PDF as a Blob

                const pdfBlob = doc.output("blob");
                const pdfObjectUrl = URL.createObjectURL(pdfBlob);
                setPdfUrl(pdfObjectUrl);
                sendPdfToEmail(pdfBlob);
            })
            .catch((err) => {
                console.error(err.message);
                alert("Unable to load the logo or QR code. Please check the URLs.");
            });
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
            console.log(studentData, "----------------------student");
            const response = await axios.post(`${baseURL}/api/placement-test/save-placement-test-student`, studentData);

            if (response.status === 200) {
                if (response.data.existingStudent) {
                    toast.success('Details saved Successfully: Continue to attend the test');
                    setPlacementTestStudentId(response.data.existingStudent.placement_test_student_id);
                } else {
                    toast.success('Details saved Successfully: Continue to attend the test');
                    setPlacementTestStudentId(response.data.newStudent.placement_test_student_id);
                }

                // setFormData({
                //     name: '',
                //     email: '',
                //     phone_number: '',
                //     university_name: '',
                //     college_name: '',
                // });
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

            <h2>{
                testDetails ? (
                    <>{testDetails.test_title}</>
                ) : (
                    <>Test</>
                )
            }</h2>

            {/* Total Marks and Timer */}
              {/* Fixed Total Marks and Time Remaining */}
    <div style={{ marginLeft: '80%', marginTop: '-6rem', position: 'fixed' }}>
    {/* Total Marks */}
    <div>
        Total Marks: {totalMarks}
    </div>

    {/* Time Remaining */}
    <div >
        Time Remaining: {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}
    </div>
</div>

            {/* Questions and options */}
            {!showSummary && !testResults && (
                <>
                    {questions.map((question, index) => (
                        <>
                            <Form key={question.cumulative_question_id} className="mb-4 p-3 rounded shadow-sm border">
                                <Form.Group as={Row} className="align-items-start">
                                    <Form.Label column sm="12" className="position-relative">
                                        <pre style={{ maxWidth: '90%', whiteSpace: 'pre-wrap', fontFamily: 'inherit', marginBottom: '10px', fontSize: '1rem' }}>
                                            <code> {index + 1}. <br />{question.question_description}</code>
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
            label={<pre>{option.option_description}</pre>} 
            name={`question-${index}`}
            value={option.option_description}
            checked={answers[question.cumulative_question_id]?.includes(option.option_description)}
            onChange={(e) => handleAnswerChange(question.cumulative_question_id, e.target.value, e.target.checked)}
            className="mb-2 lead "
            style={{ paddingLeft: '1.5rem', fontSize: '0.95rem', fontWeight: '400' }}/>
              ))}
              </Col>
                                </Form.Group>
                            </Form>

                        </>
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
                            <h4 className='text-center my-3'>
                                To View Your Previouslsy attended test results
                                <Link to="/external-test-results" target="_blank" rel="noopener noreferrer">
                                    Click Here
                                </Link>

                            </h4>
                        </Table>

                        <div className='text-center'>
                            {/* <button onClick={generateCertificate} className="btn btn-primary">
                Generate Certificate
            </button> */}
                            {pdfUrl && (
                                <a href={pdfUrl} download={`${formData.name}_Lara_Technologies_Certificate.pdf`} className="btn btn-success mt-3">
                                    Download Certificate
                                </a>
                            )}
                        </div>

                        <div className="container">
                            {testDetails ? (
                                <>
                                    <p className='h4 my-3'>Scan the QR code and join our WhatsApp channel where we share valuable knowledge, tips, and free resources to help you improve and succeed.</p>
                                    <QRCodeDisplay link={testDetails.whatsAppChannelLink} />
                                </>
                            ) : (
                                <>
                                    <p className='h4 my-3'>Scan the QR code and join our WhatsApp channel where we share valuable knowledge, tips, and free resources to help you improve and succeed.</p>
                                    <img src={qrCodeUrl} alt="WhatsApp channel link" width={200} height={200} />
                                </>
                            )
                            }
                        </div>



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
                                                <code> {index + 1}. <br />{question.question_description}</code>
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
            <Modal show={modalOpen} >
                <Modal.Header >
                    <Modal.Title>{showForm ? "Please Fill the Form" : `Please adhere to the rules`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!showForm ? (
                        <div className="container ">
                            {/* {testDetails ? (
                                <>
                                    <p className='h6 my-3'>Scan the QR code and join our WhatsApp channel where we share valuable knowledge, tips, and free resources to help you improve and succeed.</p>
                                    <QRCodeDisplay link={testDetails.whatsAppChannelLink} />
                                </>
                            ) : (
                                <>
                                    <p className='h6 my-3'>Scan the QR code and join our WhatsApp channel where we share valuable knowledge, tips, and free resources to help you improve and succeed.</p>
                                    <img src={qrCodeUrl} alt="WhatsApp channel link" width={200} height={200} />
                                </>
                            )
                            } */}
                            <Alert variant="info" className="mt-4">
                                <Alert.Heading>Info</Alert.Heading>
                                <p>Please Allow the camera and microphone to attend the test. If asked.</p>
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
                            <Button variant="primary my-3" onClick={() => setShowForm(true)}>
                                Next
                            </Button>
                        </div>
                    ) : (
                        <>
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
                                <Form.Group controlId="university_name">
                                    <Form.Label>University Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="university_name"
                                        value={formData.university_name}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="college_name">
                                    <Form.Label>College Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="college_name"
                                        value={formData.college_name}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                {saveError && <p className="text-danger">{saveError}</p>}
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={savingStudent}
                                    style={{ marginTop: "5px" }}
                                >
                                    {savingStudent ? "Saving..." : "Submit"}
                                </Button>
                            </Form>
                            {/* <Alert variant="info" className="mt-4">
                                <Alert.Heading>Info</Alert.Heading>
                                <p>Please Allow the camera and microphone to attend the test.</p>
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
                            </Alert> */}
                        </>
                    )}
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

