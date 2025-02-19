import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../config";
import Paginate from "../../components/common/Paginate"; // Assuming you have Paginate component in the same folder

const AssignWhatsAppChannel = () => {
  const [students, setStudents] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannels, setSelectedChannels] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

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
        toast.warn("This channel is already assigned to this Recruiter");
      } else {
        toast.error("Failed to assign channel. Please try again.");
      }
    }
  };

  // Handle dropdown change
  const handleChannelChange = (studentId, channelId) => {
    setSelectedChannels({ ...selectedChannels, [studentId]: channelId });
  };

  // Pagination logic
  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

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
          {currentStudents.map((student, index) => (
            <tr key={student.id}>
              <td>{indexOfFirstStudent + index + 1}</td>
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

      {/* Pagination Component */}
      <Paginate
        currentPage={currentPage}
        totalItems={students.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}  // Update the page number when a new page is selected
      />

      <ToastContainer />
    </div>
  );
};

export default AssignWhatsAppChannel;