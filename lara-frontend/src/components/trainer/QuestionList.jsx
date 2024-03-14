import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuestionList = ({ batchId }) => {
  const [questions, setQuestions] = useState([]);
  console.log("batch id", batchId)

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
          'http://localhost:8080/api/student/getQuestionsByBatchId',
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
              {activeIndex === index && (
                <p><hr />{question.description}<hr /></p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;
