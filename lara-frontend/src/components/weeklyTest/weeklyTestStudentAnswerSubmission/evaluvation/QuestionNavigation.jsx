import React from "react";
import { Button } from "react-bootstrap";

const QuestionNavigation = ({ questions, currentIndex, setCurrentIndex }) => {
  return (
    <div className="d-flex flex-wrap gap-2 my-3">
      {questions.map((_, index) => (
        <Button
          key={index}
          variant={currentIndex === index ? "primary" : "outline-secondary"}
          onClick={() => setCurrentIndex(index)}
          className="px-3"
        >
          {index + 1}
        </Button>
      ))}
    </div>
  );
};

export default QuestionNavigation;
