import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import QuestionDisplay from '../weeklyTest/weeklyTestStudentAnswerSubmission/QuestionDisplay';
import QuestionButtons from '../weeklyTest/weeklyTestStudentAnswerSubmission/QuestionButtons';
import FinalSubmissionButton from '../weeklyTest/weeklyTestStudentAnswerSubmission/FinalSubmissionButton';
import { baseURL } from '../config';
import WeeklyTestRules from '../weeklyTest/weeklyTestStudentAnswerSubmission/WeeklyTestRules';
import PaginationControls from '../weeklyTest/weeklyTestStudentAnswerSubmission/PaginationControls';
import DescriptiveTestData from './DescriptiveTestData';
import SaveStudentForm from './SaveStudentForm';
import { cosineSimilarity, tokenizeAndVectorize } from '../weeklyTest/weeklyTestStudentAnswerSubmission/evaluvation/autoEvaluvateUtils';
import './StudentDescriptiveAnswerForm.css'
import DescriptiveTestOnlineMonitoring from './DescriptiveTestOnlineMonitoring';

const StudentDescriptiveAnswerForm = () => {
  const { placement_test_id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [savedAnswers, setSavedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(-1); // Show rules page first
  const [finalSubmissionLoading, setFinalSubmissionLoading] = useState(false);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [evaluationCompleted, setEvaluationCompleted] = useState(false);
  const [totalMarks, setTotalMarks] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [isAutoEvaluation, setIsAutoEvaluation] = useState();
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [answerKeywords, setAnswerKeywords] = useState({});
  const [loadingQuestions, setLoadingQuestions] = useState([]);
  const [testDetails, setTestDetails] = useState(null);
  const [isMonitored, setIsMonitored] = useState(false)




  const placement_test_student_id = localStorage.getItem('placement_test_student_id');

  const fetchTestDetails = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/weekly-test/getDescriptiveTestById/${placement_test_id}`);
      setTestDetails(response.data.test);
      console.log("test details", response.data.test.is_Monitored);
      setIsMonitored(response.data.test.is_Monitored)
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Ask for location permission
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationAllowed(true);
        },
        (error) => {
          alert("Location access is required to continue the test. Please allow location access.");
          setLocationAllowed(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setLocationAllowed(false);
    }
  }, []);

  // Check if browser is Chrome
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isChromeBrowser = /Chrome/.test(userAgent) && !/Edge|Edg|OPR/.test(userAgent);
    if (!isChromeBrowser) {
      alert("This test is supported only in Google Chrome.");
      navigate('/chrome-only');
    }
  }, [navigate]);

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
    // Fetch the data after the auto-evaluation is done
    if (isAutoEvaluation) {
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
    }
  }, [isAutoEvaluation]);

  const answeredQuestions = questionsWithAnswers.filter(
    (item) => item.studentAnswer && item.studentAnswer.answer && item.studentAnswer.answer !== "Not Attempted"
  );

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/weekly-test/getQuestionsByPlacementTestId/${placement_test_id}`);
        setQuestions(response.data.questions);
        setTotalMarks(response.data.totalMarks);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [placement_test_id]);

  // Load saved answers from session storage
  useEffect(() => {
    const storedAnswers = JSON.parse(sessionStorage.getItem('unsavedAnswers')) || {};
    setAnswers(storedAnswers);
  }, []);

  // Fetch saved answers for the current question
  useEffect(() => {
    const fetchExistingAnswer = async () => {
      if (questions.length > 0 && currentPage >= 0) {
        const currentQuestion = questions[currentPage];
        try {

          const response = await axios.post(`${baseURL}/api/weekly-test/getPlacementTestStudentAnswer/${placement_test_id}/${currentQuestion.wt_question_id}`, {
            placement_test_student_id
          });
          if (response.data.answer) {
            setAnswers((prevAnswers) => ({
              ...prevAnswers,
              [currentQuestion.wt_question_id]: response.data.answer,
            }));
            setSavedAnswers((prevSaved) => ({
              ...prevSaved,
              [currentQuestion.wt_question_id]: true,
            }));
          }
        } catch (error) {
          console.log("error fetching previous answer : ", error)
          console.error(`Error fetching existing answer: ${error.message}`);
        }
      }
    };

    fetchTestDetails();

    fetchExistingAnswer();
  }, [currentPage, questions, placement_test_id]);

  // Handle editor changes
  const handleEditorChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: value }));
    setSavedAnswers((prevSaved) => ({ ...prevSaved, [questionId]: false }));
    sessionStorage.setItem('unsavedAnswers', JSON.stringify({ ...answers, [questionId]: value }));
  };

  // Save answer
  const handleSubmit = async (e, questionId) => {
    e.preventDefault();
    const answerArray = [{ question_id: Number(questionId), answer: answers[questionId] || '' }];
    try {

      await axios.post(`${baseURL}/api/weekly-test/savePlacementTestStudentAnswer`, { placement_test_student_id, answers: answerArray, placement_test_id });
      toast.success('Answer saved successfully!');
      setSavedAnswers((prevSaved) => ({ ...prevSaved, [questionId]: true }));
      sessionStorage.removeItem('unsavedAnswers');
    } catch (error) {
      console.error("erroro saving student answer : ", error)
      toast.error(`Error saving answer: ${error.response?.data?.message || error.message}`);
    }
  };

  // Final Submission
  const handleFinalSubmission = async () => {
    if (!locationAllowed || !location.latitude || !location.longitude) {
      alert("Please allow location access before submitting the test.");
      return;
    }

    try {
      setFinalSubmissionLoading(true);

      // Save the final submission
      await axios.post(`${baseURL}/api/weekly-test/savePlacementTestFinalSubmission`, {
        placement_test_student_id,
        placement_test_id,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      toast.success('Final submission saved successfully!');
      sessionStorage.removeItem('unsavedAnswers');

      // **Fetch existing answers AFTER the final submission is saved**
      await fetchExistingAnswers();

      // **Trigger auto-evaluation after fetching answers**
      await autoEvaluateAnswers();

      setEvaluationCompleted(true);  // Mark evaluation as completed
      setIsMonitored(false);

      setTimeout(() => {
        navigate(`/descriptive-test-resulst/${placement_test_id}/${placement_test_student_id}`);
      }, 3000);
    } catch (error) {
      console.log("Error while final Submission : ", error);
      toast.error(`Error saving final submission: ${error.response?.data?.message || error.message}`);
    } finally {
      setFinalSubmissionLoading(false);
    }
  };


  // **Helper function to fetch existing answers before evaluation**
  const fetchExistingAnswers = async () => {
    if (questions.length > 0) {
      // Fetch answers for all questions
      for (const question of questions) {
        try {
          const response = await axios.post(
            `${baseURL}/api/weekly-test/getPlacementTestStudentAnswer/${placement_test_id}/${question.wt_question_id}`,
            { placement_test_student_id }
          );
          if (response.data.answer) {
            setAnswers((prevAnswers) => ({
              ...prevAnswers,
              [question.wt_question_id]: response.data.answer,
            }));
            setSavedAnswers((prevSaved) => ({
              ...prevSaved,
              [question.wt_question_id]: true,
            }));
          }
        } catch (error) {
          console.log(`Error fetching existing answer for question ${question.wt_question_id}:`, error);
        }
      }
    }
  };


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

  const autoEvaluateAnswers = async () => {
    setEvaluationLoading(true);  // Start loading animation

    try {
      const response = await axios.put(`${baseURL}/api/weekly-test/getPlacementTestFinalSubmissionDetails/${placement_test_id}/${placement_test_student_id}`);
      const isFinalEvaluation = response.data[0].evaluation;
      console.log("Final evaluation: ", isFinalEvaluation);
      setIsAutoEvaluation(isFinalEvaluation);

      if (isFinalEvaluation) {
        toast.error("Manual evaluation has been done. Excluded from auto-evaluation.");
        return;
      }

      let allUpdated = true;
      console.log("Starting auto-evaluation of answers...");

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const studentAnswer = answers[question.wt_question_id];  // Fetch the student's answer
        const correctAnswer = correctAnswers[question.wt_question_id];
        const answerKeyword = answerKeywords[question.wt_question_id];

        setLoadingQuestions(prevState => {
          const newState = [...prevState];
          newState[i] = true;
          return newState;
        });

        if (studentAnswer && correctAnswer) {
          const studentVector = tokenizeAndVectorize(studentAnswer);
          const correctVector = tokenizeAndVectorize(correctAnswer);
          const similarity = cosineSimilarity(studentVector, correctVector);
          const threshold = answerKeyword === "1" ? 0.7 : 0.4;
          const isCorrect = similarity >= threshold;
          const marks = isCorrect ? question.marks : 0;
          const comment = isCorrect ? "Correct Answer" : "Incorrect Answer";
          console.log("Student answer: ", studentAnswer);
          console.log("Correct answer: ", correctAnswer);
          console.log("Similarity: ", similarity);
          console.log("Threshold:", threshold);
          console.log("isCorrect:", isCorrect);

          try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const updateResponse = await axios.put(
              `${baseURL}/api/weekly-test/updatePlacementTestMarksAndCommentByStudentId/${placement_test_id}/${placement_test_student_id}/${question.wt_question_id}`,
              { marks, comment }
            );
            console.log(`Successfully updated marks for question ID ${question.wt_question_id}`);
          } catch (error) {
            allUpdated = false;
            console.error(`Error updating marks for question ID ${question.wt_question_id}:`, error);
            if (error.response && error.response.status === 403) {
              toast.error("Excluded from auto-evaluation...");
            } else {
              toast.error("Error updating marks and comments.");
            }
          }
        }

        setLoadingQuestions(prevState => {
          const newState = [...prevState];
          newState[i] = false;
          return newState;
        });
      }

      if (allUpdated) {
        console.log("Auto-evaluation completed successfully!");
        toast.success("Evaluation done!");
        setIsMonitored(false);
      } else {
        console.error("Errors occurred during auto-evaluation.");
        toast.error("There was an error during auto-evaluation.");
      }
    } catch (error) {
      console.error("Error fetching evaluation status or auto-evaluation:", error);
      toast.error("Error during auto-evaluation.");
    } finally {
      setEvaluationLoading(false);  // End loading animation
    }
  };


  if (!locationAllowed) {
    return (
      <Container className="text-center mt-5">
        <h3>⚠️ Location Access Required</h3>
        <p>Please allow location access in your browser settings to continue the test.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </Container>
    );
  }

  if (loading) return <p>Loading questions....</p>;
  if (error) return <p>Error fetching questions: {error}</p>;

  return (
    <Container className="" style={{ minHeight: '100vh', position: 'relative' }}>
      <SaveStudentForm />
      {isMonitored && (
        <DescriptiveTestOnlineMonitoring
          isCameraOn={isMonitored}
          style={{
            position: 'fixed',
            top: '10%',
            left: '90%',
            zIndex: 1000,
            opacity: 0.8,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '50%',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',  // Optional shadow for visibility
          }}
        />
      )}
      <h5>Total Marks: {totalMarks}</h5>
      <DescriptiveTestData />
      <ToastContainer />
      {questions.length === 0 ? (
        <p>No questions found for this test.</p>
      ) : (
        <Row>
          <Col lg={9} md={8} className="pr-4" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
            {currentPage === -1 ? <WeeklyTestRules /> : (
              <QuestionDisplay
                question={questions[currentPage]}
                answers={answers}
                handleEditorChange={handleEditorChange}
                handleSubmit={handleSubmit}
              />
            )}
          </Col>
          <Col lg={3} md={4} style={{ maxHeight: '100vh', overflowY: 'auto' }}>
            <PaginationControls
              currentPage={currentPage}
              handlePreviousPage={() => setCurrentPage(currentPage - 1)}
              handleNextPage={() => setCurrentPage(currentPage + 1)}
              totalQuestions={questions.length}
            />
            <QuestionButtons
              questions={questions}
              savedAnswers={savedAnswers}
              currentPage={currentPage}
              handlePageChange={setCurrentPage}
            />

            {finalSubmissionLoading || evaluationLoading ? (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dim the background
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999, // Ensure the spinner is above other elements
                }}
              >
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p
                  style={{
                    marginTop: '20px',
                    fontSize: '18px',
                    color: '#fff',
                    fontWeight: 'bold',
                  }}
                >
                  Evaluating answers... Please wait.
                </p>
              </div>
            ) : (
              <FinalSubmissionButton handleFinalSubmission={handleFinalSubmission} finalSubmissionLoading={finalSubmissionLoading} />
            )}
          </Col>
        </Row>
      )}
    </Container>

  );
};

export default StudentDescriptiveAnswerForm;