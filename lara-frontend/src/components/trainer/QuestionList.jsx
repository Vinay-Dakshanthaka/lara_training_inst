import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Accordion, Button, Modal, ToastContainer, Toast } from 'react-bootstrap';
import { baseURL } from '../config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip } from '@mui/material';

const QuestionList = ({ batchId }) => {
  const [questions, setQuestions] = useState([]);
  const [editedQuestion, setEditedQuestion] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [questionError, setQuestionError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  
  const [questionImages, setQuestionImages] = useState({}); // State to store question images

  useEffect(() => {
    const fetchQuestionsByBatchId = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token provided.');
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

        // Sort questions in descending order based on question ID
        const sortedQuestions = response.data.sort((a, b) => b.id - a.id);
        setQuestions(sortedQuestions);

        // Fetch question images for each question
        const imageRequests = sortedQuestions.map(async (question) => {
          const image = await fetchQuestionImage(question.id); // Call fetchQuestionImage with question ID
          // Store the Base64 image in state
          setQuestionImages((prevImages) => ({
            ...prevImages,
            [question.id]: image,
          }));
        });

        await Promise.all(imageRequests);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };
    fetchQuestionsByBatchId();
  }, [batchId]);

  const fetchQuestionImage = async (questionId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'arraybuffer', // Receive the image as a buffer
      };

      // Fetch the image for the specified question ID
      const response = await axios.post(
        `${baseURL}/api/student/getQuestionImage`,
        { id: questionId },
        config
      );

      // Convert the received image data to Base64
      const base64Image = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      // Return the Base64 image data
      return `data:${response.headers['content-type']};base64,${base64Image}`;
    } catch (error) {
      console.error('Error fetching question image:', error);
      return null;
    }
  };

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
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const formData = { id: questions[deleteIndex].id };
      const response = await axios.delete(`${baseURL}/api/student/deleteQuestion`, { ...config, data: formData });
      // console.log('Question deleted successfully:', response.data);
      // Remove the deleted question from the list
      const updatedQuestions = questions.filter((_, i) => i !== deleteIndex);
      setQuestions(updatedQuestions);
      // Show success toast
      toast.success('Question deleted successfully');
    } catch (error) {
      console.error('Failed to delete question:', error);
      // Show error toast
      toast.error('Failed to delete question');
    }
    setShowDeleteModal(false); // Close delete confirmation modal after deletion
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // Reset error messages
    setQuestionError('');
    setDescriptionError('');
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Set content type for FormData
        },
      };
      const formData = new FormData(); // Create a FormData object
      // Add form data fields
      formData.append('id', editedQuestion.id);
      formData.append('question', editedQuestion.question);
      formData.append('description', editedQuestion.description);
      formData.append('solution', editedQuestion.solution);
      // Check if a new image file is selected
      if (editedQuestion.imageFile) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(editedQuestion.imageFile.type)) {
          toast.error('Upload only JPEG, JPG, or PNG files');
          return;
        }
        formData.append('image', editedQuestion.imageFile); // Add the new image file to form data
      }
      const response = await axios.put(`${baseURL}/api/student/updateQuestion`, formData, config);
      // console.log('Question updated successfully:', response.data);
      // Reset form fields after successful submission
      setEditedQuestion({});
      // Show success toast
      toast.success('Question updated successfully');
      // Reload QuestionList component to show updated question
      window.location.reload();
    } catch (error) {
      console.error('Failed to update question:', error);
      // Show error toast
      toast.error('Failed to update question');
    }
    handleCloseModal();
  };

  // Pagination Logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2 className="m-4">Questions Assigned to Batch</h2>
      <Accordion defaultActiveKey={null}>
  {currentQuestions.map((question, index) => (
    <Accordion.Item key={index} eventKey={index}>
      <Accordion.Header onClick={() => toggleQuestion(index)}>
        <b>
          {question.id} - {question.question}
          {!question.solution && (
  <Tooltip title="Solution Not Provided">
    <span className="float-end badge badge-danger m-2 bg-warning">!</span>
  </Tooltip>
)}
        </b>
      </Accordion.Header>
      <Accordion.Body>
        <div>
          <pre>Description: {question.description}</pre>
          {/* Display question image below description */}
          {questionImages[question.id] && (
            <img
              src={questionImages[question.id]}
              alt="Question Image"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          )}
        </div>
        <div>
          <button className="btn btn-primary mr-2 m-2" onClick={() => handleEdit(index)}>
            Edit
          </button>
          <button className="btn btn-danger m-2" onClick={() => handleDelete(index)}>
            Delete
          </button>
        </div>
      </Accordion.Body>
    </Accordion.Item>
  ))}
</Accordion>

      {/* Pagination */}
      <ul className="pagination">
        {Array.from({ length: Math.ceil(questions.length / questionsPerPage) }, (_, i) => (
          <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
            <button onClick={() => paginate(i + 1)} className="page-link">
              {i + 1}
            </button>
          </li>
        ))}
      </ul>

      {/* Bootstrap Modal for Edit Question */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
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
          {/* Add textarea for updating solution */}
          <div className="form-group">
            <label htmlFor="editedSolution">Solution:</label>
            <textarea
              className="form-control"
              id="editedSolution"
              rows="3"
              value={editedQuestion.solution || ''}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, solution: e.target.value })}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="imageFile">Question Image:</label>
            <input
              type="file"
              className="form-control-file"
              id="imageFile"
              accept="image/jpeg, image/jpg, image/png" // Accept only image files
              onChange={(e) => setEditedQuestion({ ...editedQuestion, imageFile: e.target.files[0] })}
            />
            {/* Display the current question image if available */}
            {editedQuestion.id && questionImages[editedQuestion.id] && (
              <img
                src={questionImages[editedQuestion.id]}
                alt="Question Image"
                style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Bootstrap Modal for Delete Confirmation */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this question?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer
        className="p-3"
        position="top-end"
        style={{ position: 'fixed', top: '20px', right: '20px', zIndex: '1000' }}
      />
    </div>
  );
};

export default QuestionList;
