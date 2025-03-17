import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Table } from "react-bootstrap";
import { baseURL } from "../config";

const DescriptiveTestDetails = () => {
  const { placement_test_id } = useParams();
  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/weekly-test/getDescriptiveTestById/${placement_test_id}`
        );
        setTestDetails(response.data.test);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [placement_test_id]);

  if (loading) return <p>Loading test details...</p>;
  if (error) return <p>Error fetching test details: {error}</p>;
  if (!testDetails) return <p>No test details found.</p>;

  return (
    <Container className="mt-4">
      <h4>{testDetails.description}</h4>
      <p className="lead fw-bold">
        <a href={testDetails.test_link} target="_blank" rel="noopener noreferrer">
          {testDetails.test_link}
        </a>
      </p>

      <div>
        {/* <Link
          to={`/add-question-descriptive-test/${testDetails.placement_test_id}`}
          className="btn btn-outline-primary"
        >
          Add Question
        </Link> */}
      </div>

      <h5>Associated Topics:</h5>
      {testDetails.TestTopics && testDetails.TestTopics.length > 0 ? (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Topic Name</th>
            </tr>
          </thead>
          <tbody>
            {testDetails.TestTopics.map((topicItem, index) => (
              <tr key={topicItem.placement_test_topic_id}>
                <td>{index + 1}</td>
                <td>{topicItem.PlacementTestTopic?.name || "N/A"}</td>
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

export default DescriptiveTestDetails;
