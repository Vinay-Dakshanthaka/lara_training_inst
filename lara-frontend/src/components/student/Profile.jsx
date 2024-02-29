// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';

// const Profile = () => {
//   const { studentId } = useParams();
//   const [profileDetails, setProfileDetails] = useState({});
//   const [error, setError] = useState('');
//   const {navigate} = useNavigate()

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Include studentId in profileDetails object
//       const updatedProfileDetails = { ...profileDetails, student_id: studentId };
  
//       // Send POST request with updated profile details
//       await axios.post(`http://localhost:8080/api/student/${studentId}/saveProfile`, updatedProfileDetails);
//       console.log('Profile updated successfully');
  
//       // Redirect to StudentHome.jsx page
//       navigate('/login');
//     } catch (error) {
//       setError('Failed to update profile');
//     }
//   };
  

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfileDetails({ ...profileDetails, [name]: value });
//   };

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       <h2>Profile Details</h2>
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="name">Name:</label>
//         <input type="text" name="name" value={profileDetails.name || ''} onChange={handleChange} /><br />
//         <label htmlFor="address">Address:</label>
//         <input type="text" name="address" value={profileDetails.address || ''} onChange={handleChange} /><br />
//         <label htmlFor="city">City:</label>
//         <input type="text" name="city" value={profileDetails.city || ''} onChange={handleChange} /><br />
//         <label htmlFor="state">State:</label>
//         <input type="text" name="state" value={profileDetails.state || ''} onChange={handleChange} /><br />
//         <label htmlFor="country">Country:</label>
//         <input type="text" name="country" value={profileDetails.country || ''} onChange={handleChange} /><br />
//         <label htmlFor="postal_code">Postal Code:</label>
//         <input type="text" name="postal_code" value={profileDetails.postal_code || ''} onChange={handleChange} /><br />
//         <button type="submit">Update Prfile</button>
//       </form>
//     </div>
//   );
// };

// export default Profile;
