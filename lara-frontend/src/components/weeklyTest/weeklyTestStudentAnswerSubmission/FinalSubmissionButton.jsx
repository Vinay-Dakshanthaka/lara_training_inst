import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import FinalSubmissionRules from './FinalSubmissionRules';

const FinalSubmissionButton = ({ handleFinalSubmission, finalSubmissionLoading }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Handle when the student confirms the final submission
  const handleConfirmFinalSubmission = () => {
    setShowModal(false);  // Close the modal
    handleFinalSubmission();  // Proceed with the final submission
  };

  return (
    <>
      <Row>
        <Col>
          <Button
            variant="danger"
            className="btn-block"
            onClick={handleShowModal}
            disabled={finalSubmissionLoading}
          >
            {finalSubmissionLoading ? 'Submitting...' : 'Final Submission'}
          </Button>
        </Col>
      </Row>

      {/* Final Submission Modal */}
      <FinalSubmissionRules 
        show={showModal} 
        handleClose={handleCloseModal} 
        handleConfirm={handleConfirmFinalSubmission} 
      />
    </>
  );
};

export default FinalSubmissionButton;
