import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Form, Container, Row, Col, Card, Collapse, ToastContainer } from "react-bootstrap";
import { toast } from "react-toastify";
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

  // const autoEvaluateAnswers = () => {
  //   let allUpdated = true;
  
  //   answeredQuestions.forEach((item) => {
  //     const studentAnswer = item.studentAnswer.answer;
  //     const correctAnswer = correctAnswers[item.question_id];
  
  //     if (studentAnswer && correctAnswer) {
  //       // Get similarity values from the improved Levenshtein function
  //       const similarity = getImprovedLevenshteinDistance(studentAnswer, correctAnswer);
  
  //       // Assuming a threshold of 80% similarity for correct answers
  //       const wordSimilarity = parseFloat(similarity.wordSimilarityPercentage);
  //       const levenshteinSimilarity = parseFloat(similarity.levenshteinSimilarityPercentage);
  
  //       // You can choose either similarity metric or both depending on your requirement
  //       const isCorrect = levenshteinSimilarity >= 80; // or use wordSimilarity >= 80
  
  //       const marks = isCorrect ? item.marks : 0;
  //       const comment = isCorrect ? "Correct Answer" : "Incorrect Answer";
  
  //       axios
  //         .put(`${baseURL}/api/weekly-test/updateMarksAndCommentByStudentId/${wt_id}/${student_id}/${item.question_id}`, {
  //           marks,
  //           comment,
  //         })
  //         .then(() => {
  //           setQuestionsWithAnswers((prev) =>
  //             prev.map((q) =>
  //               q.question_id === item.question_id
  //                 ? {
  //                     ...q,
  //                     studentAnswer: {
  //                       ...q.studentAnswer,
  //                       marks,
  //                       comment,
  //                     },
  //                   }
  //                 : q
  //             )
  //           );
  //         })
  //         .catch(() => {
  //           allUpdated = false;
  //           toast.error("Error updating marks and comments.");
  //         });
  //     }
  //   });
  
  //   if (allUpdated) {
  //     toast.success("Answers auto-evaluated successfully!");
  //   } else {
  //     toast.error("There was an error during auto evaluation.");
  //   }
  // };
  
  const autoEvaluateAnswers = () => {
    let allUpdated = true;
    console.log("Starting auto evaluation of answers...");
  
    answeredQuestions.forEach((item, index) => {
      console.log(`Processing question ${index + 1}: ID ${item.question_id}`);
      const studentAnswer = item.studentAnswer.answer;
      const correctAnswer = correctAnswers[item.question_id];
      const answerKeyword = answerKeywords[item.question_id]
      console.log("keywords :", answerKeyword);
  
      if (studentAnswer && correctAnswer) {
        console.log(`Student Answer: ${studentAnswer}`);
        console.log(`Correct Answer: ${correctAnswer}`);
  
        // Convert answers into vectorized representations
        const studentVector = tokenizeAndVectorize(studentAnswer);
        const correctVector = tokenizeAndVectorize(correctAnswer);
  
        // Compute similarity
        const similarity = cosineSimilarity(studentVector, correctVector);
        console.log(`Computed Similarity: ${similarity.toFixed(2)}`);
        
        const threshold = answerKeyword === "1" ? 0.8 : 0.6;
        const isCorrect = similarity >= threshold;
        console.log(`Is Answer Correct? ${isCorrect}`);
  
        const marks = isCorrect ? item.marks : 0;
        const comment = isCorrect ? "Correct Answer" : "Incorrect Answer";
  
        console.log(`Assigning Marks: ${marks}, Comment: ${comment}`);
  
        axios
          .put(
            `${baseURL}/api/weekly-test/updateMarksAndCommentByStudentId/${wt_id}/${student_id}/${item.question_id}`,
            {
              marks,
              comment,
            }
          )
          .then(() => {
            console.log(`Successfully updated marks for question ID ${item.question_id}`);
            setQuestionsWithAnswers((prev) =>
              prev.map((q) =>
                q.question_id === item.question_id
                  ? {
                      ...q,
                      studentAnswer: {
                        ...q.studentAnswer,
                        marks,
                        comment,
                      },
                    }
                  : q
              )
            );
          })
          .catch((error) => {
            allUpdated = false;
            console.error(`Error updating marks for question ID ${item.question_id}:`, error);
            toast.error("Error updating marks and comments.");
          });
      } else {
        console.warn(`Skipping question ID ${item.question_id} due to missing answer.`);
      }
    });
  
    if (allUpdated) {
      console.log("Auto evaluation completed successfully!");
      toast.success("Answers auto-evaluated successfully!");
    } else {
      console.error("Errors occurred during auto evaluation.");
      toast.error("There was an error during auto evaluation.");
    }
  };
  

  return (
    <Container fluid className="my-4">
      <Row>
        <Col md={9} className="overflow-auto" style={{ maxHeight: "100vh" }}>
          <StudentDetailsByWeeklyTestId />
          <Button variant="primary" onClick={autoEvaluateAnswers} className="my-3 mx-3" title="Automated Evaluation">
            Automated Evaluation 
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
