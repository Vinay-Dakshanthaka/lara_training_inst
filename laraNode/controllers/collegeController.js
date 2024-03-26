const db = require('../models');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const xlsx = require('xlsx');
const { File } = require('buffer');

const Student = db.Student;
const CollegeDetails = db.CollegeDetails;

const saveCollegeDetails = async (req, res) => {
    try {
        const { college_name, place } = req.body;
        const studentId = req.studentId;
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role

        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Create the batch
        const collegeDetails = await CollegeDetails.create({
            college_name,
            place
        });

        res.status(200).send(collegeDetails);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

const updateCollegeDetails = async (req, res) => {
    try {
        const { collegeId, college_name, place } = req.body;
        const studentId = req.studentId;
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role

        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Check if collegeId is provided
        if (!collegeId) {
            return res.status(400).json({ error: 'College ID is required' });
        }

        // Fetch the college details to update
        const collegeDetails = await CollegeDetails.findByPk(collegeId);

        // Check if college details exist
        if (!collegeDetails) {
            return res.status(404).json({ error: 'College details not found' });
        }

        // Update college details
        await collegeDetails.update({
            college_name,
            place
        });

        res.status(200).send(collegeDetails);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

const deleteCollegeDetails = async (req, res) => {
    try {
        const { collegeId } = req.body;
        const studentId = req.studentId;
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role

        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Check if collegeId is provided
        if (!collegeId) {
            return res.status(400).json({ error: 'College ID is required' });
        }

        // Fetch the college details to delete
        const collegeDetails = await CollegeDetails.findByPk(collegeId);

        // Check if college details exist
        if (!collegeDetails) {
            return res.status(404).json({ error: 'College details not found' });
        }

        // Delete college details
        await collegeDetails.destroy();

        res.status(200).json({ message: 'College details deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


const assignPlacementOfficerToCollege = async (req, res) => {
    try {
        const { college_id, placement_officer_id } = req.body; // Extract college_id and placement_officer_id from the request body
        const studentId = req.studentId;

        // Fetch user from database
        const user = await Student.findByPk(studentId);
        const userRole = user.role; // Get the user's role

        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        if (!college_id || !placement_officer_id) {
            return res.status(400).json({ error: 'Missing college_id or placement_officer_id in request body' });
        }

        // Check if the placement officer is already assigned to any college
        const existingCollege = await CollegeDetails.findOne({
            where: { placement_officer_id: placement_officer_id }
        });

        // If placement officer is already assigned to a college, return an error
        if (existingCollege) {
            return res.status(409).json({ error: 'Placement officer is already assigned to a college' });
        }

        // Fetch the placement officer from the database using the provided placement_officer_id
        const placementOfficer = await Student.findByPk(placement_officer_id);

        // Ensure that the placement officer exists and has the role "PLACEMENT OFFICER"
        if (!placementOfficer || placementOfficer.role !== 'PLACEMENT OFFICER') {
            return res.status(404).json({ error: 'Invalid placement officer ID or role' });
        }

        // Update the placement officer ID for the specified college in the collegeDetails table
        await CollegeDetails.update(
            { placement_officer_id: placement_officer_id },
            { where: { id: college_id } }
        );

        res.status(200).json({ message: 'Placement officer assigned to college successfully.' });
    } catch (error) {
        console.error('Failed to assign placement officer to college.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deassignPlacementOfficerFromCollege = async (req, res) => {
    try {
        const { college_id } = req.body; // Extract college_id from the request body
        const studentId = req.studentId;

        // Fetch user from database
        const user = await Student.findByPk(studentId);
        const userRole = user.role; // Get the user's role

        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        if (!college_id) {
            return res.status(400).json({ error: 'Missing college_id in request body' });
        }

        // Check if the college exists
        const college = await CollegeDetails.findByPk(college_id);

        if (!college) {
            return res.status(404).json({ error: 'College not found' });
        }

        // Remove the placement officer association by setting placement_officer_id to null
        await CollegeDetails.update(
            { placement_officer_id: null },
            { where: { id: college_id } }
        );

        res.status(200).json({ message: 'Placement officer de-assigned from college successfully.' });
    } catch (error) {
        console.error('Failed to de-assign placement officer from college.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getAllCollegeDetails = async (req, res) => {
    try {
        const studentId = req.studentId;

        // Fetch user from database
        const user = await Student.findByPk(studentId);
        const userRole = user.role; // Get the user's role

        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Fetch all college details from the database
        const collegeDetails = await CollegeDetails.findAll();

        // Send the college details as a response
        res.status(200).json(collegeDetails);
    } catch (error) {
        console.error('Failed to fetch college details.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllCollegeDetailsForPlacemmentOfficer = async (req, res) => {
    try {
        const studentId = req.studentId;

        // Fetch user from database
        const user = await Student.findByPk(studentId);
        const userRole = user.role; // Get the user's role

        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'PLACEMENT OFFICER') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Check if the student is a placement officer by checking if their ID is present in any college's placement_officer_id
        const collegeDetails = await CollegeDetails.findAll({
            where: {
                placement_officer_id: studentId
            }
        });

        // Send the college details as a response
        res.status(200).json(collegeDetails);
    } catch (error) {
        console.error('Failed to fetch college details.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Multer configuration
const upload = multer({ dest: 'uploads/' }); // Set destination folder for file uploads

// Endpoint to assign students to colleges
const assignStudentsToColleges = async (req, res) => {
    try {
        console.log("inside assign students to college ");
        
        // Check if a file is uploaded
        if (!req.file) {
            throw new Error('No file uploaded.');
        }

        // console.log("file is uploaded ");
        // console.log("file ", req.file);

        // Parse the uploaded Excel sheet
        const workbook = xlsx.readFile(req.file.path); // Use file path instead of buffer
        // console.log("workbook: ", workbook);

        // Check if workbook and SheetNames are defined
        if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
            throw new Error('Invalid Excel file or no sheets found.');
        }

        const sheetName = workbook.SheetNames[0];
        // console.log("sheet name :", sheetName);
        const sheet = workbook.Sheets[sheetName];

        // Extract college names and student email IDs from the Excel sheet
        const data = xlsx.utils.sheet_to_json(sheet);
        // console.log("data :", data);

        // Logic to assign college names to students
        for (const row of data) {
            const collegeName = row.collegeName;
            const studentEmail = row.email;

            // Find student and college details from the database
            const student = await Student.findOne({ where: { email: studentEmail } });
            const college = await CollegeDetails.findOne({ where: { college_name: collegeName } });

            if (student && college) {
                // Update student's college_id
                await Student.update({ college_id: college.id }, { where: { id: student.id } });
            }
        }

        res.status(200).json({ message: 'Students assigned to colleges successfully.' });
    } catch (error) {
        console.error('Failed to assign students to colleges.', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

const getAllStudentsByCollegeId = async (req, res) => {
    try {
        const { collegeId } = req.body; 

        // Fetch students from the database based on the college_id, excluding the password field
        const students = await Student.findAll({
            where: { college_id: collegeId },
            attributes: { exclude: ['password'] } // Exclude the 'password' field from the results
        });

        // Send the list of students as a response
        res.status(200).json(students);
    } catch (error) {
        console.error('Failed to fetch students by college ID.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



module.exports = {
    assignStudentsToColleges,
    upload,
    saveCollegeDetails,
    assignPlacementOfficerToCollege,
    getAllCollegeDetails,
    assignStudentsToColleges,
    updateCollegeDetails,
    deleteCollegeDetails,
    getAllStudentsByCollegeId,
    deassignPlacementOfficerFromCollege,
    getAllCollegeDetailsForPlacemmentOfficer
}