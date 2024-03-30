import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import moment from 'moment';

const ReviewsByStudents = () => {
  const [collegeDetails, setCollegeDetails] = useState({});
  const [students, setStudents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [trainerReviews, setTrainerReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const fetchCollegeDetails = async () => {
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
        const response = await axios.get(`${baseURL}/api/student/getAllCollegeDetailsForPlacemmentOfficer`, config);
        setCollegeDetails(response.data[0]); 
        const collegeId = response.data[0].id; 
        fetchStudentsByCollegeId(collegeId);
      } catch (error) {
        console.error('Error fetching college details:', error);
      }
    };

    const fetchStudentsByCollegeId = async (collegeId) => {
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
        const response = await axios.post(`${baseURL}/api/student/getAllStudentsByCollegeId`, { collegeId }, config);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    fetchCollegeDetails();
  }, []);

  useEffect(() => {
    const fetchReviews = async (studentIds) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error('Token not found');
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await fetch(`${baseURL}/api/student/getAllReviews`, config);
        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.statusText}`);
        }
        const data = await response.json();
  
        // Convert reviewDate and extract reviewTime
        const formattedReviews = data.map(review => ({
          ...review,
          reviewDate: moment(review.reviewDate).format('YYYY-MM-DD'), // Convert to simple format
          reviewTime: moment(review.reviewTime, 'HH:mm:ss').format('HH:mm') // Extract HH:mm format from reviewTime
        }));
  
        // Filter reviews based on student IDs
        const filteredReviews = formattedReviews.filter(review => studentIds.includes(review.student.id));
        setReviews(filteredReviews);
        setFilteredReviews(filteredReviews);
        setTrainerReviews(calculateTrainerReviews(filteredReviews));
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Handle error here (e.g., show error message to user)
      }
    };
  
    // Extract student IDs from fetched student data
    const studentIds = students.map(student => student.id);
    fetchReviews(studentIds);
  }, [students]);
  

  const calculateTrainerReviews = (reviews) => {
    const trainers = {};
    reviews.forEach(review => {
      const trainerName = review.trainer?.name || 'N/A';
      const stars = review.stars || 0;
      if (!trainers[trainerName]) {
        trainers[trainerName] = { totalStars: stars, reviewCount: 1 };
      } else {
        trainers[trainerName].totalStars += stars;
        trainers[trainerName].reviewCount++;
      }
    });

    return Object.keys(trainers).map(trainerName => ({
      name: trainerName,
      averageStars: trainers[trainerName].totalStars / trainers[trainerName].reviewCount
    }));
  };
  
  const handleSearch = () => {
    if (!searchDate) {
      setFilteredReviews(reviews);
      return;
    }
  
    const formattedSearchDate = moment(searchDate).format('YYYY-MM-DD');
    const filteredByDate = reviews.filter(review => review.reviewDate === formattedSearchDate);
  
    setFilteredReviews(filteredByDate);
  };

  const resetFilter = () => {
    setSearchDate('');
    setFilteredReviews(reviews);
  };

  const renderStars = (numStars) => {
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push(
        <span key={i} className="text-success">&#9733;</span>
      );
    }
    return stars;
  };

  return (
    <div>
      <h1>{collegeDetails.college_name}</h1>
      <table className="table my-4">
        <thead>
          <tr>
            <th>Trainer Name</th>
            <th>Average Rating</th>
          </tr>
        </thead>
        <tbody>
          {trainerReviews.map((trainer, index) => (
            <tr key={index}>
              <td>{trainer.name}</td>
              <td>{trainer.averageStars.toFixed(1)} {renderStars(trainer.averageStars)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-4">
        <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
        <button className="btn btn-primary mx-2" onClick={handleSearch}>Search</button>
        <button className="btn btn-secondary mx-2" onClick={resetFilter}>Reset Filter</button>
      </div>

      <h2>Student Reviews</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Batch Name</th>
            <th>Trainer Name</th>
            <th>Review Date</th>
            <th>Stars</th>
          </tr>
        </thead>
        <tbody>
          {filteredReviews.map((review, index) => (
            <tr key={index}>
              <td>{review.student.name}</td>
              <td>{review.batch ? review.batch.batch_name : 'N/A'}</td>
              <td>{review.trainer.name}</td>
              <td>{moment(review.reviewDate).format('DD/MM/YYYY')}</td>
              <td>{renderStars(review.stars)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsByStudents;
