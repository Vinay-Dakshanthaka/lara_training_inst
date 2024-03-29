import React, { useState, useEffect } from 'react';
import { Pagination, Button, Form, Table } from 'react-bootstrap';
import { baseURL } from '../config';

const StudentReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(10);
  const [trainerReviews, setTrainerReviews] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredReviews, setFilteredReviews] = useState([]);

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
        const response = await fetch(`${baseURL}/api/student/getAllReviews`, config);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        const formattedReviews = data.map(review => ({
          ...review,
          reviewDate: new Date(review.reviewDate).toLocaleDateString(), // Convert to simple format
          reviewTime: review.reviewTime.substring(0, 5) // Extract HH:mm format from reviewTime
        }));
        setReviews(formattedReviews);
        setFilteredReviews(formattedReviews);
        setTrainerReviews(calculateTrainerReviews(formattedReviews));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderStars = (numStars) => {
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push(
        <span key={i} className="text-success">&#9733;</span>
      );
    }
    return stars;
  };

  const handleViewAllReviews = () => {
    setFilteredReviews(reviews);
    setCurrentPage(1);
  };

  const handleFilterByDate = () => {
    const formattedSelectedDate = new Date(selectedDate).toLocaleDateString();
    const filteredByDate = reviews.filter(review => review.reviewDate === formattedSelectedDate);
    setFilteredReviews(filteredByDate);
    setCurrentPage(1);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="container mt-4">
      <h2>Student Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews available</p>
      ) : (
        <>

          <div className="mb-3 row">
            <div className="col-md-6 mb-3 mb-md-0">
              <Button variant="primary" onClick={handleViewAllReviews}>View All Reviews</Button>
            </div>
            <Form.Group controlId="dateFilter" className="col-md-6 my-0 d-flex align-items-center">
              <Form.Label className="mr-2">View Review By Date:</Form.Label>
              <div className="d-flex">
                <Form.Control type="date" onChange={handleDateChange} />
                <Button variant="success" className="ml-2" onClick={handleFilterByDate}>Apply Filter</Button>
              </div>
            </Form.Group>
          </div>

          <Table striped bordered hover>
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
                  <td>{trainer.averageStars.toFixed(1)} &#9733;</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Batch Name</th>
                <th>Trainer Name</th>
                <th>Review Date</th>
                <th>Review Time</th>
                <th>Ratings</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="7">N/A</td>
                </tr>
              ) : (
                filteredReviews.map((review, index) => (
                  <tr key={index}>
                    <td>{review.student?.name || 'N/A'}</td>
                    <td>{review.batch?.batch_name || 'N/A'}</td>
                    <td>{review.trainer?.name || 'N/A'}</td>
                    <td>{review.reviewDate}</td>
                    <td>{review.reviewTime}</td>
                    <td>{renderStars(review.stars)}</td>
                    <td>{review.review}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          <Pagination>
            {Array.from({ length: Math.ceil(filteredReviews.length / reviewsPerPage) }).map((_, index) => (
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
