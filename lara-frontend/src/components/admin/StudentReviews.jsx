import React, { useState, useEffect } from 'react';
import { Pagination } from 'react-bootstrap';
import {baseURL}  from '../config';

const StudentReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(10);

  useEffect(() => {
    const fetchReviews = async () => {
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
        const response = await fetch(`${baseURL}/api/student/getAllReviews`,config);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

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
    <div className="container mt-4">
      <h2>Student Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews available</p>
      ) : (
        <>
          <table className="table table-bordered mt-3">
            <thead className="thead-dark">
              <tr>
                <th>Student Name</th>
                <th>Batch Name</th>
                <th>Trainer Name</th>
                <th>Review Date</th>
                <th>Ratings</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.map((review, index) => (
                <tr key={index}>
                  <td>{review.student.name}</td>
                  <td>{review.batch.batch_name}</td>
                  <td>{review.trainer.name}</td>
                  <td>{new Date(review.reviewDate).toLocaleDateString()}</td>
                  <td>{renderStars(review.stars)}</td> {/* Render stars */}
                  <td>{review.review}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination>
            {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }).map((_, index) => (
              <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </div>
  );
};

export default StudentReviews;
