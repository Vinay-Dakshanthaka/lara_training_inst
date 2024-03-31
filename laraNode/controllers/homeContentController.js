const db = require('../models');

const HomeContent = db.HomeContent
const Student = db.Student
const BestPerformer = db.BestPerformer
const Profile = db.Profile
const CollegeDetails = db.CollegeDetails;

const saveOrUpdateHomeContent = async (req, res) => {
    try {
        const { today_schedule, tomorrow_schedule } = req.body;
        const studentId = req.studentId;
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role

        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Check if there's existing data in HomeContent
        let homeContent = await HomeContent.findOne();

        // If no existing data, create a new entry
        if (!homeContent) {
            homeContent = await HomeContent.create({
                today_schedule,
                tomorrow_schedule
            });
        } else {
            // If data exists, update it
            homeContent = await homeContent.update({
                today_schedule,
                tomorrow_schedule
            });
        }

        res.status(200).send(homeContent);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};


const fetchHomeContent = async (req, res) => {
    try {
        // Find the home content for the given date
        const homeContent = await HomeContent.findAll();

        if (!homeContent) {
            return res.status(404).json({ error: 'HomeContent not found for the specified date' });
        }

        res.status(200).json(homeContent);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};


const saveOrUpdateBestPerformer = async (req, res) => {
    try {
        const { date, email } = req.body;
        const loggedInStudentId = req.studentId;
        const loggedInUser = await Student.findByPk(loggedInStudentId);
        const userRole = loggedInUser.role;

        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Find the student by email
        const student = await Student.findOne({ where: { email: email } });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Check if a BestPerformer record already exists for the provided date
        let bestPerformer = await BestPerformer.findOne({ where: { date: date } });

        // If a BestPerformer record exists, update it; otherwise, create a new one
        if (bestPerformer) {
            // Update the BestPerformer
            bestPerformer = await bestPerformer.update({
                date,
                studentId: student.id
            });
        } else {
            // Create a new BestPerformer record
            bestPerformer = await BestPerformer.create({
                date,
                studentId: student.id
            });
        }

        res.status(200).send(bestPerformer);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};


const getBestPerformerByDate = async (req, res) => {
    try {
        // Find the nearest date to the present date
        const nearestDate = await BestPerformer.findOne({
            order: [['date', 'DESC']], // Order by date descending to get the nearest date
            attributes: ['date'], // Select only the date column
            raw: true // Retrieve the result as a plain object
        });

        if (!nearestDate) {
            return res.status(404).json({ error: 'No best performer found' });
        }

        // Retrieve the best performer for the nearest date
        const bestPerformer = await BestPerformer.findOne({
            where: { date: nearestDate.date }
        });

        if (!bestPerformer) {
            return res.status(404).json({ error: 'Best performer not found for the nearest date' });
        }

        // Fetch student details
        const student = await Student.findByPk(bestPerformer.studentId, {
            attributes: { exclude: ['password'] }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Fetch profile details
        const profile = await Profile.findOne({ where: { student_id: bestPerformer.studentId } });

        // Fetch college details
        let collegeName = null;
        if (student.college_id) {
            const collegeDetails = await CollegeDetails.findByPk(student.college_id);
            if (collegeDetails) {
                collegeName = collegeDetails.college_name;
            }
        }

        // Return student, profile, and college details along with best performer data
        res.status(200).json({ bestPerformer, student, profile: profile || null, collegeName });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};


module.exports = {
    saveOrUpdateHomeContent,
    saveOrUpdateBestPerformer,
    fetchHomeContent,
    getBestPerformerByDate
}