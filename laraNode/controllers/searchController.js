const db = require('../models');
const { Op } = require('sequelize');

const Student = db.Student;

const searchByEmail = async (req, res) => {
    try {
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role

        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        const { email } = req.query;
        
        // Find the student by email, excluding SUPER ADMIN
        const student = await Student.findAll({ 
            where: { 
                email,
                role: { [Op.ne]: 'SUPER ADMIN' } // Exclude SUPER ADMIN
            } 
        });

        if (student) {
            // If a student with the given email is found, return it
            res.status(200).send(student);
        } else {
            // If no student with the given email is found, return a 404 error
            res.status(404).send({ message: 'Student not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};



const searchByName = async (req, res) => {
    try {
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role

        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        const { name } = req.query; // Access the name query parameter
        
        // Find the student by partial match on name and excluding SUPER ADMIN
        const students = await Student.findAll({ 
            where: {
                name: { [Op.like]: `%${name}%` },
                role: { [Op.ne]: 'SUPER ADMIN' } // Exclude SUPER ADMIN
            } 
        });

        if (students && students.length > 0) {
            // If students with the given name are found, return them
            res.status(200).send(students);
        } else {
            // If no students with the given name are found, return a 404 error
            res.status(404).send({ message: 'Students not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};


const searchByPhoneNumber = async (req, res) => {
    try {
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role
        
        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }
        
        const { phoneNumber } = req.query;
        
        // Find the student by phone number, excluding SUPER ADMIN
        const student = await Student.findAll({ 
            where: { 
                phoneNumber,
                role: { [Op.ne]: 'SUPER ADMIN' } // Exclude SUPER ADMIN
            } 
        });

        if (student) {
            // If a student with the given phone number is found, return it
            res.status(200).send(student);
        } else {
            // If no student with the given phone number is found, return a 404 error
            res.status(404).send({ message: 'Student not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};


const profilePhoneNumberr = async (req, res) => {
    try {
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role
        console.log("role :"+userRole)
        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }
        const { mobile_number } = req.query;
        
        // Find the student by email
        const student = await db.Profile.findAll({ where: { mobile_number } });

        if (student) {
            // If a student with the given email is found, return it
            res.status(200).send(student);
        } else {
            // If no student with the given email is found, return a 404 error
            res.status(404).send({ message: 'Student not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

const searchByQualification = async (req, res) => {
    try {
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId);
        const userRole = user.role;

        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        const { highest_education } = req.body;

        const profiles = await db.Profile.findAll({ 
            where: { 
                highest_education: { [Op.like]: `%${highest_education}%` } 
            }
        });

        if (profiles && profiles.length > 0) {
            res.status(200).send(profiles);
        } else {
            res.status(404).send({ message: 'Profiles with the given qualification not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

const searchBySpecialization = async (req, res) => {
    try {
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId);
        const userRole = user.role;

        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        const { specialization } = req.body;

        const profiles = await db.Profile.findAll({ 
            where: { 
                specialization: { [Op.like]: `%${specialization}%` } 
            }
        });

        if (profiles && profiles.length > 0) {
            res.status(200).send(profiles);
        } else {
            res.status(404).send({ message: 'Profiles with the given qualification not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

// Export all controllers
module.exports = {
    searchByEmail,
    searchByName,
    searchByPhoneNumber,
    profilePhoneNumberr,
    searchByQualification,
    searchBySpecialization
}