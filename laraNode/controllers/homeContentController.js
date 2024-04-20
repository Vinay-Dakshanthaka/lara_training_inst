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
        const { date, email, question_no } = req.body; // Added question_no
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

        // Check if a record already exists for the provided date and studentId
        const existingRecord = await BestPerformer.findOne({
            where: {
                date,
                studentId: student.id
            }
        });

        // If a record already exists, return an error
        if (existingRecord) {
            return res.status(400).json({ error: 'Record already exists for the same date and student' });
        }

        // Save the BestPerformer record for the provided date, student, and question_no
        const bestPerformer = await BestPerformer.create({
            date,
            studentId: student.id,
            question_no // Include question_no in the creation
        });

        res.status(200).send(bestPerformer);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};





const getBestPerformersByDate = async (req, res) => {
    try {
        // Find the latest date
        const latestDate = await BestPerformer.max('date');

        if (!latestDate) {
            return res.status(404).json({ error: 'No best performer found' });
        }

        // Retrieve all best performers for the latest date
        const bestPerformers = await BestPerformer.findAll({
            where: { date: latestDate }
        });

        if (!bestPerformers || bestPerformers.length === 0) {
            return res.status(404).json({ error: 'Best performers not found for the latest date' });
        }
        console.log(" best performers :", bestPerformers)
        // Fetch details for each best performer
        const performersDetails = await Promise.all(bestPerformers.map(async (performer) => {
            // Fetch student details
            const student = await Student.findByPk(performer.studentId, {
                attributes: { exclude: ['password'] }
            });

            // Fetch profile details
            const profile = await Profile.findOne({ where: { student_id: performer.studentId } });

            // Fetch college details
            let collegeName = null;
            if (student.college_id) {
                const collegeDetails = await CollegeDetails.findByPk(student.college_id);
                if (collegeDetails) {
                    collegeName = collegeDetails.college_name;
                }
            }

            return { bestPerformers:bestPerformers, bestPerformer: performer, student, profile: profile || null, collegeName };
        }));

        // Return best performers details
        res.status(200).json(performersDetails);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};


module.exports = {
    saveOrUpdateHomeContent,
    saveOrUpdateBestPerformer,
    fetchHomeContent,
    getBestPerformersByDate
}