import React from 'react';
import { Card, Button } from 'react-bootstrap';

const WeeklyTestRules = () => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="text-danger" style={{ fontWeight: 'bold' }}>Test Rules:</h5>
        <ul>
          <li>Ensure that you submit answers for all questions. Unanswered questions will not be considered.</li>
          <li>You can go back and review or modify any question. Don't forget to submit the new answers after making changes. If you do not resubmit, your previous answer will be considered.</li>
          <li>Once you make the final submission, <strong>no changes are allowed</strong>, and you cannot attend any new questions. 
            <strong> So make sure before submitting you have saved all the answers </strong>
          </li>
        </ul>
        <h6 className="mt-4"><strong>Button Information:</strong></h6>
        <ul>
          <li className='my-2 lead fw-bold'><Button variant="success" size="md" disabled>1</Button> - Answer has been saved.</li>
          <li className='my-2 lead fw-bold'><Button variant="warning" size="md" disabled>1</Button> - Answer has been attended but not submitted.</li>
          <li className='my-2 lead fw-bold'><Button variant="danger" size="md" disabled>1</Button> - Question is unanswered.</li>
          <li className='my-2 lead fw-bold'><Button variant="primary" size="md" disabled>1</Button> - Current question.</li>
        </ul>
      </Card.Body>
    </Card>
  );
};

export default WeeklyTestRules;
