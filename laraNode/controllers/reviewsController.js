const db = require('../models');
const jwt = require('jsonwebtoken');

const Student = db.Student;
const Profile = db.Profile;
const Review = db.Review;
const Batch = db.Batch;
const jwtSecret = process.env.JWT_SECRET;


const saveReview = async (req, res) => {
    try {
        const { batchId, trainerId, review, stars, reviewDate, reviewTime } = req.body;
        const studentId = req.studentId;
        
        // Validate input parameters
        if (!batchId || !trainerId || !review || !stars || !reviewDate || !reviewTime) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Check if the student exists
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Format reviewDate to match database format (only year, month, day)
        const formattedReviewDate = new Date(reviewDate).toISOString().split('T')[0];

        // Convert database date string to JavaScript Date object
        const dbReviewDate = new Date(`${formattedReviewDate} ${reviewTime}`);

        // Check if a review with the same student ID, trainer ID, batch ID, and date already exists
        const existingReview = await Review.findOne({
            where: {
                studentId,
                trainerId,
                batchId,
                reviewDate: dbReviewDate
            }
        });
        
        if (existingReview) {
            return res.status(400).json({ error: 'Review already exists for the given parameters' });
        }

        // Create the review
        const newReview = await Review.create({
            studentId: studentId,
            batchId: batchId,
            trainerId: trainerId,
            review: review,
            stars: stars,
            reviewDate: formattedReviewDate,
            reviewTime: reviewTime
        });

        res.status(200).send(newReview);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const getAllReviews = async (req, res) => {
    try {
        // Retrieve all reviews from the Review table
        const reviews = await Review.findAll();

        // Fetch associated data for each review
        const reviewDetails = await Promise.all(reviews.map(async (review) => {
            const student = await Student.findByPk(review.studentId, { attributes: ['id', 'name', 'email'] });
            const batch = await Batch.findByPk(review.batchId, { attributes: ['batch_id', 'batch_name', 'description', 'duration'] });
            const trainer = await Student.findByPk(review.trainerId, { attributes: ['id', 'name', 'email'] }); // Assuming Trainer details are also stored in the Student table
            
            return {
                id: review.id,
                student,
                batch,
                trainer,
                reviewDate: review.reviewDate,
                reviewTime: review.reviewTime,
                stars: review.stars,
                review: review.review
            };
        }));

        // Send the reviews with associated data as a response
        res.status(200).json(reviewDetails);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = {
    saveReview,
    getAllReviews
}