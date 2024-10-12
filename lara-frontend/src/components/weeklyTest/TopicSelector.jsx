import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';

const TopicSelector = ({ baseURL, selectedTopics, setSelectedTopics }) => {
  const [topics, setTopics] = useState([]);
  const [selectAllTopics, setSelectAllTopics] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    if (selectedSubject) {
      fetchTopics(selectedSubject);
    }
  }, [selectedSubject]);

  const fetchTopics = async (subjectId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${baseURL}/api/cumulative-test/getTopicsBySubjectId`, { params: { subject_id: subjectId }, ...config });
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleTopicChange = (topicId) => {
    setSelectedTopics((prevSelectedTopics) => {
      if (prevSelectedTopics.includes(topicId)) {
        return prevSelectedTopics.filter((id) => id !== topicId);
      } else {
        return [...prevSelectedTopics, topicId];
      }
    });
  };

  const handleSelectAllTopics = () => {
    setSelectAllTopics(!selectAllTopics);
    if (!selectAllTopics) {
      const allTopicIds = topics.map((topic) => topic.topic_id);
      setSelectedTopics(allTopicIds);
    } else {
      setSelectedTopics([]);
    }
  };

  return (
    <div>
      <h5>Select Topics</h5>
      <Form.Group>
        <Form.Check
          type="checkbox"
          label="Select All"
          checked={selectAllTopics}
          onChange={handleSelectAllTopics}
        />
        <div className="row mt-2">
          {topics.map((topic) => (
            <div className="col-3" key={topic.topic_id}>
              <Form.Check
                type="checkbox"
                label={topic.name}
                checked={selectedTopics.includes(topic.topic_id)}
                onChange={() => handleTopicChange(topic.topic_id)}
              />
            </div>
          ))}
        </div>
      </Form.Group>
    </div>
  );
};

export default TopicSelector;
