import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Toast, ToastContainer } from 'react-bootstrap';
import {baseURL}  from '../config';

const QuestionList = ({ batchId }) => {
  const [questions, setQuestions] = useState([]);
  const [editedQuestion, setEditedQuestion] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // New state for delete confirmation modal
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [questionError, setQuestionError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [deleteIndex, setDeleteIndex] = useState(null); // State to track the index of the question to delete

  useEffect(() => {
    const fetchQuestionsByBatchId = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token provided.");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.post(
          `${baseURL}/api/student/getQuestionsByBatchId`,
          { batch_id: batchId },
          config
        );

        setQuestions(response.data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };

    fetchQuestionsByBatchId();
  }, [batchId]);

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleEdit = (index) => {
    setEditedQuestion(questions[index]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditedQuestion({});
  };

  const handleDelete = async (index) => {
    setDeleteIndex(index); // Set the index of the question to delete
    setShowDeleteModal(true); // Open delete confirmation modal
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const formData = { id: questions[deleteIndex].id };
      const response = await axios.delete(`${baseURL}/api/student/deleteQuestion`, { ...config, data: formData });
      console.log('Question deleted successfully:', response.data);
      // Remove the deleted question from the list
      const updatedQuestions = questions.filter((_, i) => i !== deleteIndex);
      setQuestions(updatedQuestions);
      // Show success toast
      setShowSuccessToast(true);
      // Hide success toast after 3 seconds
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      console.error('Failed to delete question:', error);
      // Show error toast
      setShowErrorToast(true);
      // Hide error toast after 3 seconds
      setTimeout(() => setShowErrorToast(false), 3000);
    }
    setShowDeleteModal(false); // Close delete confirmation modal after deletion
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // Reset error messages
    setQuestionError('');
    setDescriptionError('');
    // Validate textarea fields
    if (!editedQuestion.question.trim()) {
      setQuestionError('Question is required');
      return;
    }
    if (!editedQuestion.description.trim()) {
      setDescriptionError('Description is required');
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const formData = { id: editedQuestion.id, question: editedQuestion.question, description: editedQuestion.description };
      const response = await axios.put(`${baseURL}/api/student/updateQuestion`, formData, config);
      console.log('Question updated successfully:', response.data);
      // Reset form fields after successful submission
      setEditedQuestion({});
      // Show success toast
      setShowSuccessToast(true);
      // Hide success toast after 3 seconds
      setTimeout(() => setShowSuccessToast(false), 3000);
      // Reload QuestionList component to show updated question
      window.location.reload();
    } catch (error) {
      console.error('Failed to update question:', error);
      // Show error toast
      setShowErrorToast(true);
      // Hide error toast after 3 seconds
      setTimeout(() => setShowErrorToast(false), 3000);
    }
    handleCloseModal();
  };

  return (
    <div>
      <h2 className='m-4'>Questions Assigned to Batch</h2>
      <ul className="list-group m-4">
        {questions.map((question, index) => (
          <li key={index} className="list-group-item">
            <div>
              <h4
                onClick={() => toggleQuestion(index)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {question.question}
                <span style={{ marginLeft: 'auto' }}>
                  {activeIndex === index ? '▼' : '►'}
                </span>
              </h4>
              <div>
                <button className="btn btn-primary mr-2 m-2" onClick={() => handleEdit(index)}>Edit</button>
                <button className="btn btn-danger m-2" onClick={() => handleDelete(index)}>Delete</button>
              </div>
              {activeIndex === index && (
                <p><hr />{question.description}<hr /></p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Bootstrap Modal for Edit Question */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="editedQuestion">Question:</label>
            <input
              type="text"
              className="form-control"
              id="editedQuestion"
              value={editedQuestion.question || ''}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, question: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="editedDescription">Description:</label>
            <textarea
              className="form-control"
              id="editedDescription"
              rows="3"
              value={editedQuestion.description || ''}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, description: e.target.value })}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleUpdate}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* Bootstrap Modal for Delete Confirmation */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this question?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer className="p-3" position="top-end" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: '1000' }}>
        <Toast bg="success" show={showSuccessToast} onClose={() => setShowSuccessToast(false)} delay={3000} autohide>
          <Toast.Body>Success!</Toast.Body>
        </Toast>
        <Toast bg="danger" show={showErrorToast} onClose={() => setShowErrorToast(false)} delay={3000} autohide>
          <Toast.Body>Something Went wrong. Please try again later.</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default QuestionList;
