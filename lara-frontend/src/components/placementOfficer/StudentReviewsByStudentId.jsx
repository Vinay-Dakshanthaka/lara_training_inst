import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import { Pagination } from 'react-bootstrap';

const StudentReviewsByStudentId = ({ studentId }) => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);

  useEffect(() => {
    const fetchReviewsByStudentId = async () => {
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
  
        const response = await axios.get(`${baseURL}/api/student/getReviewsByStudentId/${studentId}`, config);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviewsByStudentId();
  }, [studentId]);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderStars = (numStars) => {
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push(
        <span key={i} className="text-success">&#9733;</span> // Render star icon as green color
      );
    }
    return stars;
  };

  return (
    <div className="container">
      {reviews.length === 0 ? (
        <p>No reviews available</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered mt-3">
            <thead className="thead-dark">
              <tr>
                <th>Batch Name</th>
                <th>Trainer Name</th>
                <th>Review Date</th>
                <th>Ratings</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody className='table-responsive'>
              {currentReviews.map((review, index) => (
                <tr key={index}>
                  <td>{review.batch?.batch_name || 'N/A'}</td>
                  <td>{review.trainer?.name || 'N/A'}</td>
                  <td>{new Date(review.reviewDate).toLocaleDateString()}</td>
                  <td>{renderStars(review.stars)}</td>
                  <td>{review.review}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination>
            {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }).map((_, index) => (
              <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default StudentReviewsByStudentId;
