import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

const PaginationControls = ({ currentPage, handlePreviousPage, handleNextPage, totalQuestions }) => {
  return (
    <Row className="mb-4">
      <Col>
        <Button
          variant="secondary"
          disabled={currentPage === 0}
          onClick={handlePreviousPage}
        >
          Previous
        </Button>
      </Col>
      <Col className="text-right">
        <Button
          variant="secondary"
          disabled={currentPage === totalQuestions - 1}
          onClick={handleNextPage}
        >
          Next
        </Button>
      </Col>
    </Row>
  );
};

export default PaginationControls;
