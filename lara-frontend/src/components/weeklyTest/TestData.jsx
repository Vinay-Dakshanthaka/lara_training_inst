import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { baseURL } from '../config';

const TestData = () => {
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

  // Extracting topic names into a comma-separated string
  const topicNames = testDetails.TestWeekly.map(topicItem => topicItem.TopicAssociation.name).join(', ');

  return (
    <Container className="mt-4">
      {/* Display the test description */}
      <h4 className='text-center '>{testDetails.wt_description}</h4>

      {/* Display the associated topics */}
      {/* <h5>Topics</h5> */}
      {topicNames ? (
        <p className='lead fw-bold'><span className='fw-bolder'>Topics : </span>{topicNames}</p>
      ) : (
        <p>No topics associated with this test.</p>
      )}
    </Container>
  );
};

export default TestData;
