const db = require('../models');
const jwt = require('jsonwebtoken');

const Student = db.Student;
const Profile = db.Profile;
const Batch = db.Batch;
const StudentBatch = db.Student_Batch
const jwtSecret = process.env.JWT_SECRET;

const saveBatch = async (req, res) => {
    try {
        const { batch_name } = req.body;
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role
        console.log("role :"+userRole)
        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }
        // Create the batch
        const batch = await Batch.create({
            batch_name
        });

        res.status(200).send(batch);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

const getAllBatches = async (req, res) => {
    try {
        // Fetch all batches from the database
        const batches = await Batch.findAll();
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role
        console.log("role :"+userRole)
        // Check if the user role is either "ADMIN" or 
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }
        // Send the batches as a response
        res.status(200).json(batches);
    } catch (error) {
        console.error('Failed to fetch batches.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const assignBatchesToStudent = async (req, res) => {
    try {
        const { studentId, batchIds } = req.body; // Extract studentId and batchIds from the request body
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role
        console.log("role :"+userRole)
        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        // if (userRole !== 'ADMIN') {
        //     return res.status(403).json({ error: 'Access forbidden' });
        // }

        if (!studentId) {
            return res.status(400).json({ error: 'Missing studentId in request body' });
        }

        // Fetch the student from the database using the studentId
        const student = await Student.findByPk(studentId);

        // Ensure the student exists
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }      

        // Fetch the batches from the database using the batchIds
        const batches = await Batch.findAll({
            where: {
                batch_id: batchIds
            }
        });

        // Ensure at least one batch is found
        if (batches.length === 0) {
            return res.status(404).json({ error: 'No batches found' });
        }

        // Associate the student with the batches
        await Promise.all(batches.map(async batch => {
            // Create association in Student_Batch table
            await student.addBatch(batch);
        }));

        res.status(200).json({ message: 'Batches assigned to student successfully.' });
    } catch (error) {
        console.error('Failed to assign batches to student.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const deassignBatchesFromStudent = async (req, res) => {
    try {
        const { studentId, batchIds } = req.body; // Extract studentId and batchIds from the request body

        if (!studentId) {
            return res.status(400).json({ error: 'Missing studentId in request body' });
        }

        // Ensure at least one batchId is provided
        if (!batchIds || batchIds.length === 0) {
            return res.status(400).json({ error: 'No batchIds provided' });
        }

        // Delete the associations from student_batch table
        await StudentBatch.destroy({
            where: {
                student_id: studentId,
                batch_id: batchIds
            }
        });

        res.status(200).json({ message: 'Batches de-assigned from student successfully.' });
    } catch (error) {
        console.error('Failed to de-assign batches from student.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const getStudentBatches = async (req, res) => {
    try {
        const studentId = req.studentId; 
        console.log('student id :',studentId)
        // Fetch the student from the database using the studentId
        const student = await Student.findByPk(studentId);
        console.log('student :',student)
        // Ensure the student exists
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Fetch batch details of the student
        const studentBatches = await student.getBatches();

        res.status(200).json({ studentBatches });
    } catch (error) {
        console.error('Failed to fetch student batches.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller function to fetch all students and their batches
const getAllStudentsWithBatches = async (req, res) => {
    try {
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role
        console.log("role :"+userRole)
        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }
        // Fetch all students with their associated batches
        const students = await Student.findAll({
            include: Batch // Include the Batch model to fetch associated batches
        });

        // Format the response data as needed
        const studentsWithBatches = students.map(student => ({
            id: student.id,
            name: student.name,
            email: student.email,
            phoneNumber: student.phoneNumber,
            role: student.role,
            batches: student.Batches // Array of associated batches
        }));

        // Send the response
        res.status(200).json({ students: studentsWithBatches });
    } catch (error) {
        console.error('Failed to fetch students with batches:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    saveBatch,
    assignBatchesToStudent,
    getStudentBatches,
    getAllStudentsWithBatches,
    getAllBatches,
    deassignBatchesFromStudent
}
