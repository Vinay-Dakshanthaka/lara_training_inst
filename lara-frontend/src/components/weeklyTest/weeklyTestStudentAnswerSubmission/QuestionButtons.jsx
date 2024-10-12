import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

const QuestionButtons = ({ questions, savedAnswers, handlePageChange, currentPage }) => {
  const getButtonColor = (questionId, index) => {
    if (index === currentPage) return 'primary'; // Blue for current question
    else if (savedAnswers[questionId]) return 'success'; // Green for saved answers
    else if (savedAnswers[questionId] === false) return 'warning'; // Yellow for unsaved answers
    else return 'danger'; // Red for unanswered questions
  };

  return (
    <Row className="mb-4">
      <Col>
        {/* Button "0" to display rules */}
        <div className="d-flex flex-wrap">
          <Button
            variant="info"
            className="mr-2 mb-2 mx-1"
            onClick={() => handlePageChange(-1)} // -1 for the rules page
            disabled={currentPage === -1}
          >
            0
          </Button>
          
          {/* Render the pagination buttons for each question */}
          {questions.map((question, index) => (
            <Button
              key={index}
              variant={getButtonColor(question.wt_question_id, index)}
              className="mr-2 mb-2 mx-1"
              onClick={() => handlePageChange(index)}
              disabled={index === currentPage}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </Col>
    </Row>
  );
};

export default QuestionButtons;
