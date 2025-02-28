import React from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";

const QuestionCard = ({
  question,
  correctAnswer,
  active,
  questionRef,
  updatedMarks,
  updatedComment,
  setUpdatedMarks,
  setUpdatedComment,
  handleUpdate,
}) => {
  return (
    <Card ref={questionRef} className={`mb-4 ${active ? "border-primary" : ""}`}>
      <Card.Body>
        <Card.Subtitle className="mb-2 text-muted">Topic: {question.topic || "N/A"}</Card.Subtitle>
        <pre style={{ whiteSpace: "pre-wrap" }}>Question: {question.question_text}</pre>
        <p><strong>Marks: </strong>{question.marks}</p>

        <Row>
          <Col md={6}>
            <p><strong>Student's Answer: </strong></p>
            <div
              dangerouslySetInnerHTML={{ __html: question.studentAnswer.answer }}
              style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
            />
          </Col>

          <Col md={6}>
            <p><strong>Correct Answer: </strong></p>
            <div
              dangerouslySetInnerHTML={{ __html: correctAnswer || "N/A" }}
              style={{ border: "1px solid #28a745", padding: "10px", marginBottom: "10px" }}
            />
          </Col>
        </Row>

        <Form.Group controlId={`marks_${question.question_id}`}>
          <Form.Label>Marks</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter marks"
            value={updatedMarks[question.question_id] || question.studentAnswer.marks}
            onChange={(e) => setUpdatedMarks({ ...updatedMarks, [question.question_id]: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId={`comment_${question.question_id}`}>
          <Form.Label>Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            placeholder="Enter comments (Optional)"
            value={updatedComment[question.question_id] || question.studentAnswer.comment}
            onChange={(e) => setUpdatedComment({ ...updatedComment, [question.question_id]: e.target.value })}
          />
        </Form.Group>

        <Button
          variant={question.studentAnswer.marks ? "success" : "warning"}
          onClick={() => handleUpdate(question.question_id, question.marks)}
          className="my-2"
        >
          Update
        </Button>
      </Card.Body>
    </Card>
  );
};

export default QuestionCard;
