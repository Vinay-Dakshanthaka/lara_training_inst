import React, { useState } from 'react';
import { Toast } from 'react-bootstrap';
import {baseURL}  from '../config';
const FeedbackButton = ({ onClick }) => {
  return (
    <button type="button" className="btn btn-primary" onClick={onClick}>Feedback</button>
  );
};

const FeedbackModal = ({ show, onHide, batchId, trainerId, onSuccess }) => {
  const [stars, setStars] = useState(0);
  const [reviewDate, setReviewDate] = useState('');
  const [reviewTime, setReviewTime] = useState('');
  const [review, setReview] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleSubmit = async () => {
    const formData = {
      batchId,
      trainerId,
      stars,
      review,
      reviewDate,
      reviewTime
    };

    try {
      const response = await fetch(`${baseURL}/api/student/saveReview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowSuccessToast(true);
        onSuccess();
      } else {
        setShowErrorToast(true);
        // Handle error
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setShowErrorToast(true);
      // Handle error
    }
  };

  return (
    <div>
      <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Feedback</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onHide}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="stars">Stars:</label>
                <input type="number" className="form-control" id="stars" value={stars} onChange={(e) => setStars(e.target.value)} min={0} max={5} />
              </div>
              <div className="form-group">
                <label htmlFor="reviewDate">Date:</label>
                <input type="date" className="form-control" id="reviewDate" value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="reviewTime">Time:</label>
                <input type="time" className="form-control" id="reviewTime" value={reviewTime} onChange={(e) => setReviewTime(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="review">Feedback:</label>
                <textarea className="form-control" id="review" rows="3" value={review} onChange={(e) => setReview(e.target.value)}></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={onHide}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </div>

      <Toast show={showSuccessToast} onClose={() => setShowSuccessToast(false)} className="bg-success" style={{ position: 'absolute', top: 10, right: 10 }}>
        <Toast.Header closeButton={false}>
          <strong className="mr-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>Feedback submitted successfully.</Toast.Body>
      </Toast>

      <Toast show={showErrorToast} onClose={() => setShowErrorToast(false)} className="bg-danger" style={{ position: 'absolute', top: 10, right: 10 }}>
        <Toast.Header closeButton={false}>
          <strong className="mr-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>Error submitting feedback. Please try again later.</Toast.Body>
      </Toast>
    </div>
  );
};

export default FeedbackModal;
