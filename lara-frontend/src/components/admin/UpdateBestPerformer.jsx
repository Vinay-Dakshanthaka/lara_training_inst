import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';
import { ToastContainer, toast } from 'react-toastify';

const UpdateBestPerformer = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [email, setEmail] = useState('');
  const [bestPerformerData, setBestPerformerData] = useState(null);

  useEffect(() => {
    fetchBestPerformer();
  }, []);

  const fetchBestPerformer = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${baseURL}/api/student/getBestPerformersByDate`);
      const data = response.data;
      // console.log("data : ",data)
      setBestPerformerData(data);
    } catch (error) {
      console.error('Error fetching best performer:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(`${baseURL}/api/student/saveOrUpdateBestPerformer`, {
        date: date,
        email: email
      }, config);
      toast.success('Updated Successfully')
      // After updating, fetch the updated best performer
      fetchBestPerformer();
    } catch (error) {
      console.error('Error updating best performer:', error);
      toast.error('Something went wrong')
    }
  };

  return (
    <div>
      <h2>Update Best Performer</h2>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="dateInput" className="form-label">Date</label>
          <input type="date" className="form-control" id="dateInput" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">Email</label>
          <input type="email" className="form-control" id="emailInput" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
      {bestPerformerData && (
  <div className='my-3'>
    <h3>Best Performer Details</h3>
    {bestPerformerData.map((performer, index) => (
      <div key={index}>
        <p className='display-5'>Student Name: {performer.student ? performer.student.name || 'N/A' : 'N/A'}</p>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Highest Education</th>
              <th scope="col">Specialization</th>
              <th scope="col">College Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{performer.profile ? performer.profile.highest_education || 'N/A' : 'N/A'}</td>
              <td>{performer.profile ? performer.profile.specialization || 'N/A' : 'N/A'}</td>
              <td>{performer.collegeName || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default UpdateBestPerformer;
