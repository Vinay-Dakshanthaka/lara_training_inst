import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../config";


const AssignWhatsAppChannel = () => {
  const [students, setStudents] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannels, setSelectedChannels] = useState({});

  // Fetch students and channels on component mount
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);

        // Fetch students
        const studentResponse = await axios.get(
          `${baseURL}/api/placement-test/getAllStudentsWithWhatsAppChannelLinks`
        );
        setStudents(studentResponse.data.students);

        // Fetch channels
        const channelResponse = await axios.get(
          `${baseURL}/api/placement-test/fetchWhatsAppChannelLinks`
        );
        setChannels(channelResponse.data.channels);

        setLoading(false);
      } catch (error) {
        toast.error("Error fetching data. Please try again.");
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  // Handle channel assignment
  const handleAssignChannel = async (studentId) => {
    const selectedChannelId = selectedChannels[studentId];
    if (!selectedChannelId) {
      toast.warn("Please select a channel before assigning.");
      return;
    }

    try {
      await axios.post(`${baseURL}/api/placement-test/assignWhatsAppChannelToStudent`, {
        student_id: studentId,
        channel_id: selectedChannelId,
      });
      toast.success("Channel assigned successfully!");
    } catch (error) {
      if(error.response && error.response.status === 409){
        toast.warn("This channels already assigned to this Recruiter")
      }else{
        toast.error("Failed to assign channel. Please try again.");
      }
    }
  };

  // Handle dropdown change
  const handleChannelChange = (studentId, channelId) => {
    setSelectedChannels({ ...selectedChannels, [studentId]: channelId });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container my-4">
      <h3 className="mb-4">Assign WhatsApp Channels to Recruiters</h3>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Assigned Channel</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phoneNumber}</td>
              <td>
                <select
                  className="form-select"
                  value={selectedChannels[student.id] || ""}
                  onChange={(e) =>
                    handleChannelChange(student.id, e.target.value)
                  }
                >
                  <option value="">Select Channel</option>
                  {channels.map((channel) => (
                    <option
                      key={channel.channel_id}
                      value={channel.channel_id}
                      selected={
                        student.WhatsAppChannelLinks?.[0]?.channel_id ===
                        channel.channel_id
                      }
                    >
                      {channel.channel_name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAssignChannel(student.id)}
                >
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
};

export default AssignWhatsAppChannel;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Table, Form, Button, Alert, Spinner } from 'react-bootstrap';
// import { baseURL } from '../config';

// const AssignWhatsAppChannel = () => {
//     const [students, setStudents] = useState([]);
//     const [channels, setChannels] = useState([]);
//     const [selectedStudent, setSelectedStudent] = useState('');
//     const [selectedChannel, setSelectedChannel] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState({ type: '', text: '' });

//     // Fetch students with their WhatsApp channel links
//     const fetchStudents = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`${baseURL}/api/placement-test/getAllStudentsWithWhatsAppChannelLinks`);
//             setStudents(response.data.students);
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching students:', error);
//             setMessage({ type: 'danger', text: 'Failed to fetch students' });
//             setLoading(false);
//         }
//     };

//     // Fetch all WhatsApp channels
//     const fetchChannels = async () => {
//         try {
//             const response = await axios.get(`${baseURL}/api/placement-test//fetchWhatsAppChannelLinks`);
//             setChannels(response.data.channels);
//         } catch (error) {
//             console.error('Error fetching channels:', error);
//             setMessage({ type: 'danger', text: 'Failed to fetch WhatsApp channels' });
//         }
//     };

//     // Assign a WhatsApp channel to a student
//     const assignChannel = async () => {
//         if (!selectedStudent || !selectedChannel) {
//             setMessage({ type: 'warning', text: 'Please select both student and channel' });
//             return;
//         }

//         try {
//             const response = await axios.post(`${baseURL}/api/placement-test/assignWhatsAppChannelToStudent`, {
//                 student_id: selectedStudent,
//                 channel_id: selectedChannel,
//             });

//             setMessage({ type: 'success', text: response.data.message });
//             fetchStudents(); // Refresh the student list
//         } catch (error) {
//             console.error('Error assigning channel:', error);
//             setMessage({ type: 'danger', text: 'Failed to assign WhatsApp channel' });
//         }
//     };

//     useEffect(() => {
//         fetchStudents();
//         fetchChannels();
//     }, []);

//     return (
//         <div className="container mt-5">
//             <h2>Assign WhatsApp Channel to Students</h2>

//             {/* Message Alert */}
//             {message.text && (
//                 <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
//                     {message.text}
//                 </Alert>
//             )}

//             {loading ? (
//                 <div className="text-center">
//                     <Spinner animation="border" />
//                 </div>
//             ) : (
//                 <>
//                     {/* Students Table */}
//                     <h4 className="mt-4">Students</h4>
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Name</th>
//                                 <th>Email</th>
//                                 <th>Phone</th>
//                                 <th>Role</th>
//                                 <th>Assigned WhatsApp Channel</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {students.map((student) => (
//                                 <tr key={student.id}>
//                                     <td>{student.id}</td>
//                                     <td>{student.name}</td>
//                                     <td>{student.email}</td>
//                                     <td>{student.phoneNumber}</td>
//                                     <td>{student.role}</td>
//                                     <td>
//                                         {student.WhatsAppChannelLinks.length > 0 ? (
//                                             student.WhatsAppChannelLinks.map((channel) => (
//                                                 <div key={channel.channel_id}>
//                                                     <strong>{channel.channel_name}</strong>: {channel.link}
//                                                 </div>
//                                             ))
//                                         ) : (
//                                             <em>No channel assigned</em>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>

//                     {/* Assign Channel Form */}
//                     <h4 className="mt-4">Assign WhatsApp Channel</h4>
//                     <Form>
//                         <Form.Group className="mb-3">
//                             <Form.Label>Select Student</Form.Label>
//                             <Form.Select
//                                 value={selectedStudent}
//                                 onChange={(e) => setSelectedStudent(e.target.value)}
//                             >
//                                 <option value="">Select a student</option>
//                                 {students.map((student) => (
//                                     <option key={student.id} value={student.id}>
//                                         {student.name} (ID: {student.id})
//                                     </option>
//                                 ))}
//                             </Form.Select>
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label>Select WhatsApp Channel</Form.Label>
//                             <Form.Select
//                                 value={selectedChannel}
//                                 onChange={(e) => setSelectedChannel(e.target.value)}
//                             >
//                                 <option value="">Select a channel</option>
//                                 {channels.map((channel) => (
//                                     <option key={channel.channel_id} value={channel.channel_id}>
//                                         {channel.channel_name}
//                                     </option>
//                                 ))}
//                             </Form.Select>
//                         </Form.Group>

//                         <Button variant="primary" onClick={assignChannel}>
//                             Assign Channel
//                         </Button>
//                     </Form>
//                 </>
//             )}
//         </div>
//     );
// };

// export default AssignWhatsAppChannel;
