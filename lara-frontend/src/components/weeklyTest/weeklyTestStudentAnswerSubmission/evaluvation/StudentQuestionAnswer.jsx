// import React, { useState, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { Button, Form, Container, Row, Col, Card, Collapse } from "react-bootstrap";
// import { toast,ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { baseURL } from "../../../config";
// import StudentDetailsByWeeklyTestId from "../../StudentDetailsByWeeklyTestId";
// import { cosineSimilarity, tokenizeAndVectorize } from "./autoEvaluvateUtils";

// const StudentQuestionAnswer = () => {
//   const { wt_id, student_id } = useParams();
//   const [questionsWithAnswers, setQuestionsWithAnswers] = useState([]);
//   const [correctAnswers, setCorrectAnswers] = useState({});
//   const [answerKeywords, setAnswerKeywords] = useState({});
//   const [updatedMarks, setUpdatedMarks] = useState({});
//   const [updatedComment, setUpdatedComment] = useState({});
//   const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
//   const [showUnanswered, setShowUnanswered] = useState(false);
//   const questionRefs = useRef([]);
//   const [evaluation, setIsFinalSubmitted] = useState(false);

//   useEffect(() => {
//     axios
//       .get(`${baseURL}/api/weekly-test/getQuestionAnswerDataByStudentId/${wt_id}/${student_id}`)
//       .then((response) => {
//         const questions = response.data.questions;
//         setQuestionsWithAnswers(questions);

//         questions.forEach((question) => {
//           fetchCorrectAnswer(question.question_id);
//         });
//       })
//       .catch(() => {
//         toast.error("Error fetching data");
//       });
//   }, [wt_id, student_id]);

//   const fetchCorrectAnswer = (question_id) => {
//     axios
//       .get(`${baseURL}/api/weekly-test/getCorrectAnswerForQuestion/${question_id}`)
//       .then((response) => {
//         setCorrectAnswers((prev) => ({
//           ...prev,
//           [question_id]: response.data.answer,
//         }));
//         setAnswerKeywords((prev) => ({
//           ...prev,
//           [question_id]: response.data.keywords, // Storing keywords
//         }));
//       })
//       .catch(() => {
//         toast.error("Error fetching correct answer.");
//       });
//   };

//   const handleUpdate = (question_id, maxMarks) => {
//     const marks = updatedMarks[question_id];
//     let comment = updatedComment[question_id];

//     if (marks > maxMarks) {
//       toast.error(`Marks cannot exceed the maximum of ${maxMarks}`);
//       return;
//     }

//     if (marks === undefined) {
//       toast.error("Marks cannot be empty.");
//       return;
//     }

//     if (!comment) {
//       comment = "N/A";
//     }

//     axios
//       .put(`${baseURL}/api/weekly-test/updateMarksAndCommentByStudentId/${wt_id}/${student_id}/${question_id}`, {
//         marks,
//         comment,
//       })
//       .then(() => {
//         toast.success("Marks and comments updated successfully!");

//         setQuestionsWithAnswers((prev) =>
//           prev.map((item) =>
//             item.question_id === question_id
//               ? {
//                 ...item,
//                 studentAnswer: {
//                   ...item.studentAnswer,
//                   marks,
//                   comment,
//                 },
//               }
//               : item
//           )
//         );
//       })
//       .catch(() => {
//         toast.error("Error updating marks and comments.");
//       });
//   };

 
//   const handleScrollToQuestion = (index) => {
//     setActiveQuestionIndex(index);
//     questionRefs.current[index].scrollIntoView({ behavior: "smooth" });
//   };

//   // Filter out questions where the student's answer is "Not Attempted" or null
//   const answeredQuestions = questionsWithAnswers.filter(
//     (item) => item.studentAnswer && item.studentAnswer.answer && item.studentAnswer.answer !== "Not Attempted"
//   );
//   const unansweredQuestions = questionsWithAnswers.filter(
//     (item) => !item.studentAnswer || !item.studentAnswer.answer
//   );


 
//   const autoEvaluateAnswers = async () => {
//     try {
//       // Check if final submission is already done
//       const response = await axios.get(`${baseURL}/api/weekly-test/getWeeklyTestFinalSubmissionDetails/${wt_id}/${student_id}`);
//       const evaluation = response.data[0].evaluation; // Assuming API returns { isSubmitted: true/false }
      
//       console.log(evaluation, "-------------------------finalsubmitted");
//       console.log(response.data, "-------------------------data");
  
//       if (evaluation) {
//         toast.error("Final evalution already done. Cannot re-evaluate.");
//         return;
//       }
  
//       let allUpdated = true;
//       console.log("Starting auto evaluation of answers...");
  
//       // Loop through the answered questions and evaluate them
//       for (const item of answeredQuestions) {
//         console.log(`Processing question ID ${item.question_id}`);
//         const studentAnswer = item.studentAnswer.answer;
//         const correctAnswer = correctAnswers[item.question_id];
//         const answerKeyword = answerKeywords[item.question_id];
  
//         if (studentAnswer && correctAnswer) {
//           const studentVector = tokenizeAndVectorize(studentAnswer);
//           const correctVector = tokenizeAndVectorize(correctAnswer);
//           const similarity = cosineSimilarity(studentVector, correctVector);
  
//           const threshold = answerKeyword === "1" ? 0.8 : 0.6;
//           const isCorrect = similarity >= threshold;
//           const marks = isCorrect ? item.marks : 0;
//           const comment = isCorrect ? "Correct Answer" : "Incorrect Answer";
  
//           try {
//             // 2-second delay before evaluating the next question
//             await new Promise(resolve => setTimeout(resolve, 2000));
  
//             await axios.put(
//               `${baseURL}/api/weekly-test/updateMarksAndCommentByStudentId/${wt_id}/${student_id}/${item.question_id}`,
//               { marks, comment }
//             );
//             console.log(`Successfully updated marks for question ID ${item.question_id}`);
//           } catch (error) {
//             allUpdated = false;
//             console.error(`Error updating marks for question ID ${item.question_id}:`, error);
  
//             if (error.response && error.response.status === 403) {
//               toast.error("Final submission already done. Cannot re-evaluate.");
//               return;  // Stop further processing if final submission is detected
//             } else {
//               toast.error("Error updating marks and comments.");
//             }
//           }
//         }
//       }
  
//       if (allUpdated) {
//         console.log("Auto evaluation completed successfully!");
//         toast.success("Answers auto-evaluated successfully!");
//       } else {
//         console.error("Errors occurred during auto evaluation.");
//         toast.error("There was an error during auto evaluation.");
//       }
//     } catch (error) {
//       console.error("Error fetching final submission status:", error);
//       toast.error("Error checking final submission status.");
//     }
//   };
  

//   const handleFinalEvaluation = () => {
//     axios
//       .put(`${baseURL}/api/weekly-test/updateEvaluationStatus`, {
//         student_id,
//         test_id: wt_id,
//         evaluation: true, // Sending true to update evaluation status to 1
//         final_submission:true,
//       })
//       .then(() => {
//         toast.success("Final Evaluation Completed Successfully!");
//       })
//       .catch(() => {
//         toast.error("Error completing final evaluation.");
//       });
//   };
  
//   return (
//     <Container fluid className="my-4">
//       <Row>
//         <Col md={9} className="overflow-auto" style={{ maxHeight: "100vh" }}>
//           <StudentDetailsByWeeklyTestId />
//           <Button variant="primary" onClick={autoEvaluateAnswers} className="my-3 mx-3" title="Automated Evaluation">
//             Automated Evaluation 
//           </Button>
//          <Button
//   variant="success"
//   onClick={handleFinalEvaluation}
//   className="my-3 mx-3"
//   title="Final Evaluation"
//   disabled={evaluation}
// >
//   Final Evaluation
// </Button>

//           <ToastContainer />
//           <h2 className="mb-4">Student Answer Details</h2>

//           {answeredQuestions.length === 0 ? (
//             <Card>
//               <Card.Body>
//                 <h5>No answered questions found for this student.</h5>
//               </Card.Body>
//             </Card>
//           ) : (
//             answeredQuestions.map((item, index) => (
//               <Card
//                 key={item.question_id}
//                 className={`mb-4 ${index === activeQuestionIndex ? "border-primary" : ""}`}
//                 ref={(el) => (questionRefs.current[index] = el)}
//               >
//                 <Card.Body>
//                   <Card.Subtitle className="mb-2 text-muted">Topic: {item.topic || "N/A"}</Card.Subtitle>
//                   <pre style={{ whiteSpace: "pre-wrap" }}>Question: {item.question_text}</pre>

//                   <p><strong>Marks: </strong>{item.marks}</p>

//                   <Row>
//                     <Col md={6}>
//                       <div>
//                         <p><strong>Student's Answer: </strong></p>
//                         <div
//                           dangerouslySetInnerHTML={{ __html: item.studentAnswer.answer }}
//                           style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
//                         />
//                       </div>
//                     </Col>

//                     <Col md={6}>
//                       <div>
//                         <p><strong>Correct Answer: </strong></p>
//                         <div
//                           dangerouslySetInnerHTML={{ __html: correctAnswers[item.question_id] || "N/A" }}
//                           style={{ border: "1px solid #28a745", padding: "10px", marginBottom: "10px" }}
//                         />
//                       </div>
//                     </Col>
//                   </Row>

//                   <Form.Group controlId={`marks_${item.question_id}`}>
//                     <Form.Label>Marks</Form.Label>
//                     <Form.Control
//                       type="number"
//                       placeholder="Enter marks"
//                       value={updatedMarks[item.question_id] || item.studentAnswer.marks}
//                       onChange={(e) => setUpdatedMarks({ ...updatedMarks, [item.question_id]: e.target.value })}
//                     />
//                   </Form.Group>

//                   <Form.Group controlId={`comment_${item.question_id}`}>
//                     <Form.Label>Comment</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={6}
//                       placeholder="Enter comments (Optional)"
//                       value={updatedComment[item.question_id] || item.studentAnswer.comment}
//                       onChange={(e) => setUpdatedComment({ ...updatedComment, [item.question_id]: e.target.value })}
//                     />
//                   </Form.Group>

//                   <Button
//                     variant={item.studentAnswer.marks ? "success" : "warning"}
//                     onClick={() => handleUpdate(item.question_id, item.marks)}
//                     className="my-2"
//                   >
//                     Update
//                   </Button>
//                 </Card.Body>
//               </Card>
//             ))
//           )}

//           <Button
//             onClick={() => setShowUnanswered(!showUnanswered)}
//             aria-controls="unanswered-collapse"
//             aria-expanded={showUnanswered}
//             className="my-3"
//           >
//             {showUnanswered ? "Hide Unanswered Questions" : "Show Unanswered Questions"}
//           </Button>

//           <Collapse in={showUnanswered}>
//             <div id="unanswered-collapse">
//               {unansweredQuestions.length === 0 ? (
//                 <Card>
//                   <Card.Body>
//                     <h5>No unanswered questions found.</h5>
//                   </Card.Body>
//                 </Card>
//               ) : (
//                 unansweredQuestions.map((item, index) => (
//                   <Card key={item.question_id} className="mb-4">
//                     <Card.Body>
//                       <Card.Subtitle className="mb-2 text-muted">Topic: {item.topic || "N/A"}</Card.Subtitle>
//                       <pre style={{ whiteSpace: "pre-wrap" }}>Question: {item.question_text}</pre>
//                       <p><strong>Marks: </strong>{item.marks}</p>
//                       <p><strong>Student's Answer: </strong> Not Answered</p>
//                     </Card.Body>
//                   </Card>
//                 ))
//               )}
//             </div>
//           </Collapse>

          
//         </Col>

//         <Col md={3} className="overflow-auto" style={{ maxHeight: "100vh" }}>
//           <div className="d-flex flex-column align-items-end">
//             <Row>
//               {answeredQuestions.map((item, index) => (
//                 <Col xs={6} key={index} className="mb-2 d-flex justify-content-center">
//                   <Button
//                     variant={index === activeQuestionIndex ? "primary" : item.studentAnswer.marks ? "success" : "warning"}
//                     onClick={() => handleScrollToQuestion(index)}
//                     className="text-nowrap"
//                   >
//                     Q{index + 1}
//                   </Button>
//                 </Col>
//               ))}
//             </Row>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default StudentQuestionAnswer;

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Form, Container, Row, Col, Card, Collapse } from "react-bootstrap";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../../config";
import StudentDetailsByWeeklyTestId from "../../StudentDetailsByWeeklyTestId";
import { cosineSimilarity, tokenizeAndVectorize } from "./autoEvaluvateUtils";

const StudentQuestionAnswer = () => {
  const { wt_id, student_id } = useParams();
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [answerKeywords, setAnswerKeywords] = useState({});
  const [updatedMarks, setUpdatedMarks] = useState({});
  const [updatedComment, setUpdatedComment] = useState({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showUnanswered, setShowUnanswered] = useState(false);
  const questionRefs = useRef([]);
  const [evaluation, setIsFinalSubmitted] = useState(false);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/weekly-test/getQuestionAnswerDataByStudentId/${wt_id}/${student_id}`)
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
  }, [wt_id, student_id]);

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
      .put(`${baseURL}/api/weekly-test/updateMarksAndCommentByStudentId/${wt_id}/${student_id}/${question_id}`, {
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
      .catch(() => {
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
  const unansweredQuestions = questionsWithAnswers.filter(
    (item) => !item.studentAnswer || !item.studentAnswer.answer
  );

  useEffect(() => {
  axios.get(`${baseURL}/api/weekly-test/getWeeklyTestFinalSubmissionDetails/${wt_id}/${student_id}`)
    .then((response) => {
      setIsFinalSubmitted(response.data[0].evaluation);
    })
    .catch((error) => {
      console.error("Error fetching final submission status:", error);
      toast.error("Error checking final submission status.");
    });
}, [wt_id, student_id]);


 
  // const autoEvaluateAnswers = async () => {
  //   try {
  //     // Check if final submission is already done
  //     const response = await axios.get(`${baseURL}/api/weekly-test/getWeeklyTestFinalSubmissionDetails/${wt_id}/${student_id}`);
  //     const evaluation = response.data[0].evaluation; // Assuming API returns { isSubmitted: true/false }
      
  //     console.log(evaluation, "-------------------------finalsubmitted");
  //     console.log(response.data, "-------------------------data");
  
  //     if (evaluation) {
  //       toast.error("Final evalution already done. Cannot re-evaluate.");
  //       return;
  //     }
  
  //     let allUpdated = true;
  //     console.log("Starting auto evaluation of answers...");
  
  //     // Loop through the answered questions and evaluate them
  //     for (const item of answeredQuestions) {
  //       console.log(`Processing question ID ${item.question_id}`);
  //       const studentAnswer = item.studentAnswer.answer;
  //       const correctAnswer = correctAnswers[item.question_id];
  //       const answerKeyword = answerKeywords[item.question_id];
  
  //       if (studentAnswer && correctAnswer) {
  //         const studentVector = tokenizeAndVectorize(studentAnswer);
  //         const correctVector = tokenizeAndVectorize(correctAnswer);
  //         const similarity = cosineSimilarity(studentVector, correctVector);
  
  //         const threshold = answerKeyword === "1" ? 0.8 : 0.6;
  //         const isCorrect = similarity >= threshold;
  //         const marks = isCorrect ? item.marks : 0;
  //         const comment = isCorrect ? "Correct Answer" : "Incorrect Answer";
  
  //         try {
  //           // 2-second delay before evaluating the next question
  //           await new Promise(resolve => setTimeout(resolve, 2000));
  
  //           await axios.put(
  //             `${baseURL}/api/weekly-test/updateMarksAndCommentByStudentId/${wt_id}/${student_id}/${item.question_id}`,
  //             { marks, comment }
  //           );
  //           console.log(`Successfully updated marks for question ID ${item.question_id}`);
  //         } catch (error) {
  //           allUpdated = false;
  //           console.error(`Error updating marks for question ID ${item.question_id}:`, error);
  
  //           if (error.response && error.response.status === 403) {
  //             toast.error("Final submission already done. Cannot re-evaluate.");
  //             return;  // Stop further processing if final submission is detected
  //           } else {
  //             toast.error("Error updating marks and comments.");
  //           }
  //         }
  //       }
  //     }
  
  //     if (allUpdated) {
  //       console.log("Auto evaluation completed successfully!");
  //       toast.success("Answers auto-evaluated successfully!");
  //     } else {
  //       console.error("Errors occurred during auto evaluation.");
  //       toast.error("There was an error during auto evaluation.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching final submission status:", error);
  //     toast.error("Error checking final submission status.");
  //   }
  // };
  
  const autoEvaluateAnswers = async () => {
    if (evaluation) {
      toast.error("Final evaluation already done. Cannot re-evaluate.");
      return;
    }
  
    let allUpdated = true;
    console.log("Starting auto evaluation of answers...");
  
    for (const item of answeredQuestions) {
      console.log(`Processing question ID ${item.question_id}`);
      const studentAnswer = item.studentAnswer.answer;
      const correctAnswer = correctAnswers[item.question_id];
      const answerKeyword = answerKeywords[item.question_id];
  
      if (studentAnswer && correctAnswer) {
        const studentVector = tokenizeAndVectorize(studentAnswer);
        const correctVector = tokenizeAndVectorize(correctAnswer);
        const similarity = cosineSimilarity(studentVector, correctVector);
  
        const threshold = answerKeyword === "1" ? 0.8 : 0.6;
        const isCorrect = similarity >= threshold;
        const marks = isCorrect ? item.marks : 0;
        const comment = isCorrect ? "Correct Answer" : "Incorrect Answer";
  
        try {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Delay for smoother updates
          await axios.put(
            `${baseURL}/api/weekly-test/updateMarksAndCommentByStudentId/${wt_id}/${student_id}/${item.question_id}`,
            { marks, comment }
          );
          console.log(`Successfully updated marks for question ID ${item.question_id}`);
        } catch (error) {
          allUpdated = false;
          console.error(`Error updating marks for question ID ${item.question_id}:`, error);
          toast.error("Error updating marks and comments.");
        }
      }
    }
  
    if (allUpdated) {
      toast.success("Answers auto-evaluated successfully!");
    } else {
      toast.error("There was an error during auto evaluation.");
    }
  };
  

  const handleFinalEvaluation = () => {
    axios
      .put(`${baseURL}/api/weekly-test/updateEvaluationStatus`, {
        student_id,
        test_id: wt_id,
        evaluation: true, // Sending true to update evaluation status to 1
        final_submission:true,
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
          <StudentDetailsByWeeklyTestId />
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
                  >
                    Q{index + 1}
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

export default StudentQuestionAnswer;
