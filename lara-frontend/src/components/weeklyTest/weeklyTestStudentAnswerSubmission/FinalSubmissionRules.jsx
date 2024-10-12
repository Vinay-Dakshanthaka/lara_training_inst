import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const FinalSubmissionRules = ({ show, handleClose, handleConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Before Final Submission </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {/* Use a paragraph and strong for emphasis */}
          <p className="text-danger" style={{ fontWeight: 'bold' }}>
            Please read the following carefully before making your final submission:
          </p>
          <ul>
            <li>
              Ensure that you have submitted answers for all the questions. Any unanswered questions will not be considered.
            </li>
            <li>
              You can go back and review or modify any question. Once you make changes, don't forget to submit the new answers. If you do not resubmit, your previously saved answers will be considered.
            </li>
            <li>
              Once you make the final submission, <strong>you will not be allowed to edit answers</strong> or attend any new questions.
            </li>
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Go Back and Review
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Confirm Final Submission
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FinalSubmissionRules;
