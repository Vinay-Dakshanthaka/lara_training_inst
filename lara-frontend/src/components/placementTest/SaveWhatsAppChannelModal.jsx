// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import { baseURL } from "../config";
// import "react-toastify/dist/ReactToastify.css";
// import { BsPencil, BsTrash } from "react-icons/bs";

// const SaveWhatsAppChannelModal = ({ showModal, onClose }) => {
//     const [channelName, setChannelName] = useState("");
//     const [link, setLink] = useState("");
//     const [channelLinks, setChannelLinks] = useState([]);
//     const [updateModal, setUpdateModal] = useState(false);
//     const [currentChannel, setCurrentChannel] = useState(null);

//     // Fetch all WhatsApp channel links
//     const fetchChannelLinks = async () => {
//         try {
//             const response = await axios.get(`${baseURL}/api/placement-test/fetchWhatsAppChannelLinks`);
//             setChannelLinks(response.data.channels || []);
//         } catch (error) {
//             toast.error("Failed to fetch WhatsApp channel links.");
//         }
//     };

//     useEffect(() => {
//         if (showModal) {
//             fetchChannelLinks();
//         }
//     }, [showModal]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post(`${baseURL}/api/placement-test/saveWhatsAppChannelLink`, {
//                 channel_name: channelName,
//                 link,
//             });
//             toast.success("New WhatsApp Channel link saved!");
//             setChannelName("");
//             setLink("");
//             fetchChannelLinks();
//         } catch (error) {
//             if (error.response?.status === 400) {
//                 const serverMessage = error.response?.data?.message;
//                 toast.warn(serverMessage || "Invalid input. Please check the data and try again.");
//             } else {
//                 toast.error("Failed to save WhatsApp channel link.");
//             }
//         }
//     };

//     const openUpdateModal = (channel) => {
//         setCurrentChannel(channel);
//         setUpdateModal(true);
//     };

//     const handleUpdateSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.put(`${baseURL}/api/placement-test/updateWhatsAppChannelLink/${currentChannel.channel_id}`, {
//                 channel_name: currentChannel.channel_name,
//                 link: currentChannel.link,
//             });
//             toast.success("WhatsApp Channel link updated successfully!");
//             setUpdateModal(false);
//             fetchChannelLinks();
//         } catch (error) {
//             toast.error("Failed to update WhatsApp channel link.");
//         }
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to delete this channel link?")) {
//             try {
//                 await axios.delete(`${baseURL}/api/placement-test/deleteWhatsAppChannelLink/${id}`);
//                 toast.success("WhatsApp Channel link deleted successfully!");
//                 fetchChannelLinks();
//             } catch (error) {
//                 toast.error("Failed to delete WhatsApp channel link.");
//             }
//         }
//     };

//     if (!showModal) return null;

//     return (
//         <>
//             <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
//                 <ToastContainer />
//                 <div className="modal-dialog modal-dialog-scrollable" role="document">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h5 className="modal-title">Add WhatsApp Channel Link</h5>
//                             <button type="button" className="close" onClick={onClose} aria-label="Close">
//                                 <span aria-hidden="true">&times;</span>
//                             </button>
//                         </div>
//                         <div className="modal-body">
//                             <form onSubmit={handleSubmit}>
//                                 <div className="form-group">
//                                     <label htmlFor="channelName">Channel Name</label>
//                                     <input
//                                         type="text"
//                                         id="channelName"
//                                         className="form-control"
//                                         value={channelName}
//                                         onChange={(e) => setChannelName(e.target.value)}
//                                         placeholder="Enter channel name"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <label htmlFor="link">Link</label>
//                                     <input
//                                         type="url"
//                                         id="link"
//                                         className="form-control"
//                                         value={link}
//                                         onChange={(e) => setLink(e.target.value)}
//                                         placeholder="Enter link"
//                                         required
//                                     />
//                                 </div>
//                                 <button type="submit" className="btn btn-primary">
//                                     Save
//                                 </button>
//                             </form>
//                             <hr />
//                             <h5>Available WhatsApp Channel Links</h5>
//                             <div className="table-responsive">
//                                 <table className="table table-striped table-bordered">
//                                     <thead>
//                                         <tr>
//                                             <th>#</th>
//                                             <th>Channel Link</th>
//                                             <th>Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {channelLinks.map((channel, index) => (
//                                             <tr key={channel.id}>
//                                                 <td>{index + 1}</td>
//                                                 <td>
//                                                     <a href={channel.link} target="_blank" rel="noopener noreferrer">
//                                                         {channel.channel_name}
//                                                     </a>
//                                                 </td>
//                                                 <td>
//                                                     <button
//                                                         className="btn btn-sm btn-warning mx-2"
//                                                         onClick={() => openUpdateModal(channel)}
//                                                     >
//                                                        <BsPencil />
//                                                     </button>
//                                                     <button
//                                                         className="btn btn-sm btn-danger mx-2"
//                                                         onClick={() => handleDelete(channel.channel_id)}
//                                                     >
//                                                        <BsTrash />
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Update Modal */}
//             {updateModal && (
//                 <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
//                     <div className="modal-dialog" role="document">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title">Update WhatsApp Channel Link</h5>
//                                 <button type="button" className="close" onClick={() => setUpdateModal(false)} aria-label="Close">
//                                     <span aria-hidden="true">&times;</span>
//                                 </button>
//                             </div>
//                             <div className="modal-body">
//                                 <form onSubmit={handleUpdateSubmit}>
//                                     <div className="form-group">
//                                         <label htmlFor="updateChannelName">Channel Name</label>
//                                         <input
//                                             type="text"
//                                             id="updateChannelName"
//                                             className="form-control"
//                                             value={currentChannel.channel_name}
//                                             onChange={(e) =>
//                                                 setCurrentChannel({ ...currentChannel, channel_name: e.target.value })
//                                             }
//                                             required
//                                         />
//                                     </div>
//                                     <div className="form-group">
//                                         <label htmlFor="updateLink">Link</label>
//                                         <input
//                                             type="url"
//                                             id="updateLink"
//                                             className="form-control"
//                                             value={currentChannel.link}
//                                             onChange={(e) =>
//                                                 setCurrentChannel({ ...currentChannel, link: e.target.value })
//                                             }
//                                             required
//                                         />
//                                     </div>
//                                     <button type="submit" className="btn btn-primary">
//                                         Update
//                                     </button>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default SaveWhatsAppChannelModal;


import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import RecruitersTable from "./RecruitersTable";
import axios from "axios";
import { baseURL } from "../config";

const SaveWhatsAppChannelModal = () => {
  const [channelName, setChannelName] = useState("");
  const [link, setLink] = useState("");
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!channelName || !link) {
      setErrorMessage("Channel name and link are required");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        channel_name: channelName,
        link,
        student_ids: selectedRecruiters,
      };

      const response = await axios.post(`${baseURL}/api/placement-test/saveWhatsAppChannelLink`, payload);
      setSuccessMessage(response.data.message);
      setChannelName("");
      setLink("");
      setSelectedRecruiters([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error saving WhatsApp channel link:", error.message);
      setErrorMessage(error.response?.data?.message || "Failed to save WhatsApp channel link");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add WhatsApp Channel Link</h2>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="channelName" className="mb-3">
          <Form.Label>Channel Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter channel name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="link" className="mb-3">
          <Form.Label>Channel Link</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter WhatsApp channel link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </Form.Group>

        <RecruitersTable
          selectedRecruiters={selectedRecruiters}
          setSelectedRecruiters={setSelectedRecruiters}
        />

        <Button variant="primary" type="submit" disabled={loading} className="my-3">
          {loading ? "Saving..." : "Save Channel Link"}
        </Button>
      </Form>
    </div>
  );
};

export default SaveWhatsAppChannelModal;

