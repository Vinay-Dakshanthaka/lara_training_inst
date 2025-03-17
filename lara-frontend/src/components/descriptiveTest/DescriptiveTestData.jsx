// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Container, Card } from 'react-bootstrap';
// import { baseURL } from '../config';

// const DescriptiveTestData = () => {
//   const { placement_test_id } = useParams(); 
//   const [testDetails, setTestDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchTestDetails = async () => {
//       try {
//         const response = await axios.get(`${baseURL}/api/weekly-test/getDescriptiveTestById/${placement_test_id}`);
//         setTestDetails(response.data.test);
//         console.log("Fetched Test Data:", response.data);
//         setLoading(false);
//       } catch (error) {
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     fetchTestDetails();
//   }, [placement_test_id]);

//   if (loading) return <p>Loading test details...</p>;
//   if (error) return <p className="text-danger">Error fetching test details: {error}</p>;
//   if (!testDetails) return <p>No test details found.</p>;

//   // Extract topic names
//   const topicNames = testDetails.TestTopics?.map(topic => topic.TopicAssociation?.name).join(', ') || 'No topics assigned';

//   return (
//     <Container className="mt-4">
//       <Card className="shadow-lg p-4">
//         <h3 className="text-center text-primary">{testDetails.test_title}</h3>
//         <p className="text-muted text-center">{testDetails.description}</p>

//         {/* Test Details */}
//         <div className="mt-3">
//           <h5><strong>Test Description:</strong></h5>
//           <p>{testDetails.description || 'No description provided'}</p>

//           <h5><strong>Number of Questions:</strong> {testDetails.number_of_questions || 'N/A'}</h5>

//           <h5><strong>Start Time:</strong> {testDetails.start_time}</h5>
//           <h5><strong>End Time:</strong> {testDetails.end_time}</h5>
//         </div>

//         {/* Topics */}
//         <h5 className="mt-3"><strong>Topics:</strong></h5>
//         <p>{topicNames}</p>

//         {/* Certification */}
//         {testDetails.issue_certificate && (
//           <div className="mt-3">
//             <h5><strong>Certificate Name:</strong> {testDetails.certificate_name}</h5>
//           </div>
//         )}

//         {/* WhatsApp Channel */}
//         {testDetails.whatsAppChannelLink && (
//           <div className="mt-3">
//             <h5><strong>WhatsApp Channel:</strong></h5>
//             <a href={testDetails.whatsAppChannelLink} target="_blank" rel="noopener noreferrer">
//               {testDetails.whatsAppChannelLink}
//             </a>
//           </div>
//         )}
//       </Card>
//     </Container>
//   );
// };

// export default DescriptiveTestData;


import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { baseURL } from '../config';

const DescriptiveTestData = () => {
  const { placement_test_id } = useParams(); // Get the wt_id from the URL
  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/weekly-test/getDescriptiveTestById/${placement_test_id}`);
        setTestDetails(response.data.test);
        console.log("test Destails" , response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [placement_test_id]);

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
//   const topicNames = testDetails.TestWeekly.map(topicItem => topicItem.TopicAssociation.name).join(', ');
const topicNames = testDetails.TestTopics?.map(topic => topic.PlacementTestTopic?.name).join(', ') || 'No topics assigned';

  return (
    <Container className="mt-4">
      {/* Display the test description */}
      <h4 className='text-center '>{testDetails.description}</h4>

      
      {/* <h5>Topics</h5> */}
      {topicNames ? (
        <p className='lead fw-bold'><span className='fw-bolder'>Topics : </span>{topicNames}</p>
      ) : (
        <p>N/A</p>
      )}
    </Container>
  );
};

export default DescriptiveTestData;
