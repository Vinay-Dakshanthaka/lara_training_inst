import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from 'react-bootstrap';

const QuestionDisplay = ({ question, answers, handleEditorChange, handleSubmit }) => {
  if (!question) return null;

  return (
    <div key={question.wt_question_id} className="mb-4">
      <h5>Question: </h5>
      <pre>{question.wt_question_description}</pre>
      
      <ReactQuill
        theme="snow"
        value={answers[question.wt_question_id] || ''}
        onChange={(value) => handleEditorChange(question.wt_question_id, value)}
        style={{minHeight:'300px'}}
      />

      <Button variant="primary" type="submit" className="mt-3" onClick={(e) => handleSubmit(e, question.wt_question_id)}>
        Submit
      </Button>
    </div>
  );
};

export default QuestionDisplay;
