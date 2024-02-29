import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar, Nav, Toast } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import { BsFillEnvelopeFill, BsPhone } from "react-icons/bs";
import defaultProfileImage from "../default-profile.png";
const StudentHome = () => {
  const { studentId } = useParams();
  const [profileDetails, setProfileDetails] = useState({});
  const [studentDetails, setStudentDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const  navigate  = useNavigate();
  const [imagePath, setImagePath] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchProfileDetails = async () => {
      console.log("inside fetch profile details ");
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
          `http://localhost:8080/api/student/getProfileDetails`,
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
          console.log("Token not found")
          navigate('/')
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          `http://localhost:8080/api/student/getStudentDetails`,
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
    
    // Validate image size and format
    if (file.size > 1024 * 1024 || !['image/jpeg', 'image/png'].includes(file.type)) {
      // Display warning toast if image size exceeds 1MB or format is not JPEG or PNG
      setShowWarningToast(true);
      return;
    }
  
    const formData = new FormData();
    formData.append("image", file);
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/student/uploadProfileImage",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = response.data;
      
      // Display success toast after successful image upload
      setShowSuccessToast(true)
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
        const response = await axios.get('http://localhost:8080/api/student/profile/image', {
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
        console.log("image "+image)
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };
  
    fetchProfileImage();
  }, []);

  return (
    <div className="container mt-4">
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
                      <th scope="row">Highest Qalification:</th>
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
        <Link to={`/updateProfile`} className="btn btn-primary">
          Update Profile
        </Link>
      </div>
                  <Toast
              style={{
                position: 'fixed',
                top: 10,
                left: 10,
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

    </div>
  );
};

export default StudentHome;
