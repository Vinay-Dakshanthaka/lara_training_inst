const db = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const Attendance = db.Attendance;
const Student = db.Student;
const jwtSecret = process.env.JWT_SECRET;

const saveAttendance = async (req, res) => {
    try {
        const { attendanceData } = req.body;
        const studentId = req.studentId;
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role

        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Save attendance for each student
        for (const attendance of attendanceData) {
            await Attendance.create({
                date: attendance.date,
                status: attendance.status,
                student_id: attendance.student_id
            });
        }

        res.status(200).send({ message: 'Attendance saved successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

const getAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.params;

        // Fetch attendance records for the given date
        const attendance = await Attendance.findAll({
            where: {
                date: date
            }
        });

        res.status(200).json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch attendance data' });
    }
};


const getAttendanceByYearAndMonth = async (req, res) => {
    try {
        const { year, month } = req.params;

        // Construct start and end dates for the given year and month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        // Fetch attendance records for the given year and month
        const attendance = await Attendance.findAll({
            where: {
                date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        res.status(200).json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch attendance data' });
    }
};



const getAllAttendance = async (req, res) => {
    try {
        const { date } = req.params;

        // Fetch attendance records for the given date
        const attendance = await Attendance.findAll({
        });

        res.status(200).json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch attendance data' });
    }
};


module.exports = {
    saveAttendance,
    getAttendanceByDate,
    getAllAttendance,
    getAttendanceByYearAndMonth
}