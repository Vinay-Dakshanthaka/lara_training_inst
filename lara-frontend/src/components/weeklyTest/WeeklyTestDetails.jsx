import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Table } from 'react-bootstrap';
import { baseURL } from '../config';

const WeeklyTestDetails = () => {
  const { wt_id } = useParams(); // Get the wt_id from the URL
  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/weekly-test/getWeeklyTestById/${wt_id}`);
        setTestDetails(response.data.test);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [wt_id]);

  if (loading) {
    return <p>Loading test details...</p>;
  }

  if (error) {
    return <p>Error fetching test details: {error}</p>;
  }

  if (!testDetails) {
    return <p>No test details found.</p>;
  }

  return (
    <Container className="mt-4">
      {/* Display the test description and link */}
      <h4>{testDetails.wt_description}</h4>
      <p className="lead fw-bold">
        <a href={testDetails.wt_link} target="_blank" rel="noopener noreferrer">
          {testDetails.wt_link}
        </a>
      </p>

      <div>
      <Link to={`/add-questoin-weekly-test/${testDetails.wt_id}`} className='btn btn-outline-primary'>Add Question</Link>
      </div>

      {/* Display the associated topics */}
      <h5>Associated Topics:</h5>
      {testDetails.TestWeekly && testDetails.TestWeekly.length > 0 ? (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Topic Name</th>
            </tr>
          </thead>
          <tbody>
            {testDetails.TestWeekly.map((topicItem, index) => (
              <tr key={topicItem.wt_topic_id}>
                <td>{index + 1}</td>
                <td>{topicItem.TopicAssociation.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No topics associated with this test.</p>
      )}
    </Container>
  );
};

export default WeeklyTestDetails;
