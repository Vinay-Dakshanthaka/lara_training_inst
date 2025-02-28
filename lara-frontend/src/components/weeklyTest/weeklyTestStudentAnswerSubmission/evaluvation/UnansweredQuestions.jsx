import React from "react";
import { Button, Card, Collapse } from "react-bootstrap";

const UnansweredQuestions = ({ unansweredQuestions, showUnanswered, setShowUnanswered }) => {
  return (
    <>
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
            unansweredQuestions.map((item) => (
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
    </>
  );
};

export default UnansweredQuestions;
