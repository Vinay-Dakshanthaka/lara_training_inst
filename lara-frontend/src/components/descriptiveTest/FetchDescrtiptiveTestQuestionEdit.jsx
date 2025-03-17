import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap'; // Import Button from react-bootstrap
import { baseURL } from '../config';
import BackButton from '../BackButton';
import { toast, ToastContainer } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css';
import DescriptiveTestDetails from './DescriptiveTestDetails';

const FetchDescrtiptiveTestQuestionEdit = () => {
  const { placement_test_id } = useParams();
  const [testDetails, setTestDetials] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/weekly-test/getDescriptiveTestById/${placement_test_id}`);
        setTestDetials(response.data.test);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [placement_test_id]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/weekly-test/getQuestionsByPlacementTestId/${placement_test_id}`);
        setQuestions(response.data.questions);
        console.log(response.data,"----------------------questions")
        setLoading(false);
      } catch (error) {
        console.log("erroro fetching descriptive question ", error)
        setError(error.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [placement_test_id]);

  const handleDelete = async (question_id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this question?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${baseURL}/api/weekly-test/deleteQuestionById/${question_id}`);
      toast.success('Question deleted successfully!');
      // Update the question list after deletion
      setQuestions(questions.filter((question) => question.wt_question_id !== question_id));
    } catch (error) {
      toast.error(`Error deleting question: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p>Error fetching questions: {error}</p>;
  }

  return (
    <Container className="mt-4">
      <BackButton />
      <DescriptiveTestDetails />
      <h2>Questions </h2>
      <ToastContainer />
      {questions.length === 0 ? (
        <p>No questions found for this test.</p>
      ) : (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Keywords</th>
              <th>Marks</th>
              <th>Minutes</th>
              <th>Topic</th>
              <th>Edit</th>
              <th>Delete</th> {/* Added Delete Column */}
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr key={question.wt_question_id}>
                <td>{index + 1}</td>
                <td><pre>{question.wt_question_description}</pre></td>
                <td>
                  {question.TestQuestionAnswerDetails.length > 0 
                    ? question.TestQuestionAnswerDetails[0].keywords 
                    : "N/A"}
                </td>

                <td>{question.marks}</td>
                <td>{question.minutes}</td>
                <td>{question.TopicDetails.name}</td>
                <td>
                  <Link to={`/edit-weekly-test-question/${question.wt_question_id}`}>Edit</Link>
                </td>
                <td>
                  {/* Delete Button */}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(question.wt_question_id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default FetchDescrtiptiveTestQuestionEdit;
