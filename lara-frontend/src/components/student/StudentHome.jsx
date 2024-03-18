import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar, Nav, Toast, Modal, Button } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import { BsFillEnvelopeFill, BsPhone } from "react-icons/bs";
import defaultProfileImage from "../default-profile.png";
import { BsStarFill, BsStar } from 'react-icons/bs'; // Import star icons
import {baseURL}  from '../config';

const FeedbackButton = ({ onClick }) => {
  return (
    <button type="button" className="btn btn-warning" onClick={onClick}>Give Feedback</button>
  );
};

const FeedbackModal = ({ show, onHide, batchId, trainerId, onSuccess }) => {
  const [stars, setStars] = useState(0);
  const [reviewDate, setReviewDate] = useState(getCurrentDate());
  const [reviewTime, setReviewTime] = useState(getCurrentTime());
  const [review, setReview] = useState('');
  const [starsError, setStarsError] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async () => {
    // Reset errors and success
    setStarsError('');
    setFeedbackError('');
    setShowSuccessToast(false);
    setShowErrorToast(false);

    // Validation
    let isValid = true;
    if (stars === 0) {
      setStarsError('Please rate by selecting stars');
      isValid = false;
    }
    if (!review) {
      setFeedbackError('Please write a feedback');
      isValid = false;
    }
    // Date validation
    const currentDate = new Date();
    const selectedDate = new Date(reviewDate);
    const differenceInTime = selectedDate.getTime() - currentDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays < -3 || differenceInDays > 0) {
      setStarsError('Please select a date within the last 3 days or today');
      isValid = false;
    }

    // Time validation
    const selectedTime = new Date(`01/01/2000 ${reviewTime}`);
    const currentTime = new Date(`01/01/2000 ${getCurrentTime()}`);
    // if (selectedTime > currentTime) {
    //   setStarsError('Please select a time before or equal to the current time');
    //   isValid = false;
    // }

    if (!isValid) {
      return;
    }

    // Form data
    const formData = {
      batchId,
      trainerId,
      stars,
      review,
      reviewDate,
      reviewTime
    };

    // POST request
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.post(`${baseURL}/api/student/saveReview`, formData, config);

      if (response.status === 200) {
        onSuccess();
        setShowSuccessToast(true);
        alert("Thanks for the Feedback")
        // Clear form fields
        setStars(0);
        setReview('');
        setReviewDate('');
        setReviewTime('');
      } else {
        setShowErrorToast(true);
        alert("OOP's!! Something went wrong!!")
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setShowErrorToast(true);
    }
  };


  const renderStarIcon = (index) => {
    const fillColor = index < stars ? 'yellow' : 'green';
    return <BsStarFill key={index} onClick={() => setStars(index + 1)} style={{ color: fillColor, fontSize:20 }} className="m-2"/>;
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}>
     <div className="modal-dialog bf-info" role="document">
  <div className="modal-content bg-info">
    <div className="modal-header">
      <h5 className="modal-title bg-info">Feedback</h5>
      <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onHide}>
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div className="modal-body bg-info">
      <div className="form-group">
        <label htmlFor="stars">Rate Your Experience with this trainer's class</label>
        <div>
          {[...Array(5)].map((_, index) => renderStarIcon(index))}
          {starsError && <div className="text-danger">{starsError}</div>}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="reviewDate">Date:</label>
        <input type="date" className="form-control" id="reviewDate" value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="reviewTime">Time:</label>
        <input type="time" className="form-control" id="reviewTime" value={reviewTime} onChange={(e) => setReviewTime(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="review">Write your Feedback:</label>
        <textarea className="form-control" id="review" rows="3" value={review} onChange={(e) => setReview(e.target.value)}></textarea>
        {feedbackError && <div className="text-danger">{feedbackError}</div>}
      </div>
    </div>
    <div className="modal-footer bg-info">
      <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={onHide}>Close</button>
      <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
    </div>
  </div>
</div>


      {/* Success toast */}
      <Toast
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        delay={3000}
        autohide
        style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: 'green' }}
      >
        <Toast.Header>
          <strong className="mr-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>Thanks for the Feedback</Toast.Body>
      </Toast>

      {/* Error toast */}
      <Toast
        show={showErrorToast}
        onClose={() => setShowErrorToast(false)}
        delay={3000}
        autohide
        style={{ position: 'fix', top: '20px', right: '20px', backgroundColor: 'red' }}
      >
        <Toast.Header>
          <strong className="mr-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>Something went wrong</Toast.Body>
      </Toast>
    </div>
  );
};

const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day = currentDate.getDate();
  day = day < 10 ? `0${day}` : day;
  return `${year}-${month}-${day}`;
};

const getCurrentTime = () => {
  const currentDate = new Date();
  let hours = currentDate.getHours();
  hours = hours < 10 ? `0${hours}` : hours;
  let minutes = currentDate.getMinutes();
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minutes}`;
};
const StudentHome = () => {
  const { studentId } = useParams();
  const [profileDetails, setProfileDetails] = useState({});
  const [studentDetails, setStudentDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [imagePath, setImagePath] = useState("");
  const [image, setImage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [studentBatches, setStudentBatches] = useState([]);


  useEffect(() => {
    const fetchProfileDetails = async () => {
      // console.log("inside fetch profile details ");
      try {

        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        if (!token) {
          // Handle case where token is not found in localStorage
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request headers
          },
        };

        const response = await axios.get(
          `${baseURL}/api/student/getProfileDetails`,
          config
        ); // Assuming endpoint to fetch profile details
        setProfileDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch profile details:", error);
        setErrorMessage("Please update your profile details");
      }
    };

    fetchProfileDetails();
  }, []);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // console.log("Token not found")
          navigate('/')
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          `${baseURL}/api/student/getStudentDetails`,
          config
        );
        const data = response.data || {};
        if (Object.keys(data).length === 0) {
          setErrorMessage("Please update profile details");
        } else {
          setStudentDetails(data);
        }
      } catch (error) {
        console.error("Failed to fetch student details:", error);
        setErrorMessage("OOP's! Something went wrong");
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    setShowConfirmModal(true);
  };

  const confirmImageUpload = async () => {
    // Validate image size and format
    if (imageFile.size > 1024 * 1024 || !['image/jpeg', 'image/png'].includes(imageFile.type)) {
      // Display warning toast if image size exceeds 1MB or format is not JPEG or PNG
      setShowConfirmModal(false);
      setShowWarningToast(true);
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseURL}/api/student/uploadProfileImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = response.data;
      setShowConfirmModal(false);
      // Display success toast after successful image upload
      setShowSuccessToast(true);

      window.location.reload();
      // Set the image path received from the response
      setImage(data.imagePath);
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  // State for showing warning toast
  const [showWarningToast, setShowWarningToast] = useState(false);

  // State for showing success toast
  const [showSuccessToast, setShowSuccessToast] = useState(false);


  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/student/profile/image`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'arraybuffer', // Receive the image as a buffer
        });

        // Convert the received image data to Base64
        const base64Image = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
        );

        // Set the image data to state
        setImage(`data:${response.headers['content-type']};base64,${base64Image}`);
        // console.log("image "+image)
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, []);

  useEffect(() => {
    const fetchStudentBatches = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Handle authentication error
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          `${baseURL}/api/student/fetchTrainerAndBatchFromStudent`,
          config
        );
        const data = response.data || {};
        if (data.batchesDetails) {
          setStudentBatches(data.batchesDetails);
          // console.log("batch id ",data.batchesDetails[0].batch.batch_id)
          // console.log("batch details ",data.batchesDetails)
        }
      } catch (error) {
        console.error('Failed to fetch student batches:', error);
      }
    };

    fetchStudentBatches();
  }, [studentId]);

  const [showModal, setShowModal] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [selectedTrainerId, setSelectedTrainerId] = useState(null);

  const handleFeedbackClick = (batchId, trainerId) => {
    setSelectedBatchId(batchId);
    setSelectedTrainerId(trainerId);
    setShowModal(true);
  };

  const handleAssignQuestionsClick = (batchId) => {
    // Redirect to the QuestionList component with the batch ID
    navigate(`/assignment-questions/${batchId}`);
  };

  return (
    <div className="container mt-4 mb-4">
      <div className="card p-4">
        {errorMessage && <div className="alert alert-info">{errorMessage}</div>}

        {/* Profile Details */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card text-center">
              <div className="card-body row">
                {/* Left side: Profile Image */}
                <div className="col-md-6 text-center">
                  {/* Display profile image */}
                  {image ? (
                    <img
                      src={image}
                      alt="Profile"
                      className="profile-image img-fluid rounded-circle mt-1"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <img
                      src={defaultProfileImage}
                      alt="Default Profile"
                      className="profile-image img-fluid rounded-circle mt-1"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />
                  )}
                  {/* Option to update profile picture */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                    id="upload"
                  />
                  <br />
                  <p className="small">Please upload only JPG/PNG files less than 1MB</p>
                  <label
                    htmlFor="upload"
                    className="btn btn-sm btn-primary mt-2"
                  >
                    Update Profile Picture
                  </label>
                </div>

                {/* Right side: Name, Email, Phone Number */}
                <div className="col-md-6 text-left mt-3">
                  <h1 className="card-title" style={{ textTransform: "uppercase" }}>
                    {profileDetails.name}
                  </h1>
                  <p className="card-text">
                    <BsFillEnvelopeFill size={20} className="text-primary m-2" />
                    {studentDetails.email}
                  </p>
                  <p className="card-text">
                    <BsPhone size={20} className="text-primary m-2" />
                    {studentDetails.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 card col-md-12">
          <h2 className="bg-primary rounded p-2 m-2">Batches</h2>
          <table className="table m-2">
        <thead>
          <tr>
            <th>Batch Name</th>
            <th>Trainer Name</th>
            <th>Assignment Questions</th> 
          </tr>
        </thead>
        <tbody>
          {studentBatches.map((batchDetail, index) => (
            <tr key={index}>
              <td>{batchDetail.batch.batch_name}</td>
              <td>
                {batchDetail.trainerDetails && batchDetail.trainerDetails.map((trainer, trainerIndex) => (
                  <div key={trainerIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <tr>
                    <td>
                    <div style={{ marginRight: '10px' }}>{trainer.name}</div>
                    </td>
                  </tr>
                    {/* Assuming FeedbackButton is imported */}
                    <tr>
                    <td>
                    <FeedbackButton
                      onClick={() => handleFeedbackClick(batchDetail.batch.batch_id, trainer.id)}
                    />
                    </td>
                    </tr>
                  </div>
                ))}
              </td>
              <td>
                {/* Render buttons for actions */}
                <button className="btn btn-primary" onClick={() => handleAssignQuestionsClick(batchDetail.batch.batch_id)}>
                  Assignment Questions
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


          <FeedbackModal
            show={showModal}
            onHide={() => setShowModal(false)}
            batchId={selectedBatchId}
            trainerId={selectedTrainerId}
            onSuccess={() => {
              setShowModal(false);
              // Show success toast
            }}
          />
        </div>

        {/* Education Details */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="bg-primary rounded p-2">
                  <h3 className="text-white">Education Details</h3>
                </div>
                <table className="table">
                  <tbody>
                    <tr>
                      <th scope="row">Highest Qualification:</th>
                      <td>{profileDetails.highest_education}</td>
                    </tr>
                    <tr>
                      <th scope="row">Year of Passout:</th>
                      <td>{profileDetails.year_of_passout}</td>
                    </tr>
                    <tr>
                      <th scope="row">Specialization :</th>
                      <td>{profileDetails.specialization}</td>
                    </tr>
                    <tr>
                      <th scope="row">Highest Education Percentage:</th>
                      <td>{profileDetails.highest_education_percent}</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        12<sup>th</sup> Percentage:
                      </th>
                      <td>{profileDetails.twelth_percentage}</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        10<sup>th</sup> Percentage:
                      </th>
                      <td>{profileDetails.tenth_percentage}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="bg-primary rounded p-2">
                  <h3 className="text-white">Contact Details</h3>
                </div>
                <table className="table">
                  <tbody>
                    <tr>
                      <th scope="row">Mobile Number:</th>
                      <td>{profileDetails.mobile_number}</td>
                    </tr>
                    <tr>
                      <th scope="row">Aadhaar Number:</th>
                      <td>{profileDetails.adhaar_number}</td>
                    </tr>
                    <tr>
                      <th scope="row">Father's Name:</th>
                      <td>{profileDetails.father_name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Father's Mobile Number:</th>
                      <td>{profileDetails.father_mobile_number}</td>
                    </tr>
                    <tr>
                      <th scope="row">Father's Occupation:</th>
                      <td>{profileDetails.father_occupation}</td>
                    </tr>
                    <tr>
                      <th scope="row">Mother's Name:</th>
                      <td>{profileDetails.mother_name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Mother's Mobile Number:</th>
                      <td>{profileDetails.mother_mobile_number}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="bg-primary rounded p-2">
                  <h3 className="text-white">Address</h3>
                </div>
                <table className="table">
                  <tbody>
                    <tr>
                      <th scope="row">Address:</th>
                      <td>{profileDetails.address}</td>
                    </tr>
                    <tr>
                      <th scope="row">City:</th>
                      <td>{profileDetails.city}</td>
                    </tr>
                    <tr>
                      <th scope="row">Pincode:</th>
                      <td>{profileDetails.pincode}</td>
                    </tr>
                    <tr>
                      <th scope="row">District:</th>
                      <td>{profileDetails.district}</td>
                    </tr>
                    <tr>
                      <th scope="row">State:</th>
                      <td>{profileDetails.state}</td>
                    </tr>
                    <tr>
                      <th scope="row">Country:</th>
                      <td>{profileDetails.country}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Update Profile Button */}
        <div className="text-center">
          <Link to={`/updateProfile`} className="btn btn-primary col-4 text-center">
            Update Profile
          </Link>
        </div>
      </div>
      <Toast
        style={{
          position: 'fixed',
          top: 10,
          left: 10,
          zIndex: 1000,
        }}
        show={showWarningToast}
        onClose={() => setShowWarningToast(false)}
        delay={3000}
        autohide
        bg="warning"
        text="light"
      >
        <Toast.Body>Image must be less than 1MB and Please upload only JPEG or PNG files</Toast.Body>
      </Toast>

      <Toast
        style={{
          position: 'fixed',
          top: 10,
          left: 10,
        }}
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        delay={3000}
        autohide
        bg="success"
        text="light"
      >
        <Toast.Body>Image uploaded successfully</Toast.Body>
      </Toast>
      {/* Modal for image upload confirmation */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Image Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to upload this image?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmImageUpload}>
            Confirm Upload
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default StudentHome;
