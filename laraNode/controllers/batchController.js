const db = require('../models');
const jwt = require('jsonwebtoken');

const Student = db.Student;
const Profile = db.Profile;
const Batch = db.Batch;
const StudentBatch = db.Student_Batch
const jwtSecret = process.env.JWT_SECRET;

const saveBatch = async (req, res) => {
    try {
        const { batch_name, description, price, duration, trainer_id } = req.body;
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role

        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Create the batch
        const batch = await Batch.create({
            batch_name,
            description,
            price,
            duration,
            trainer_id
        });

        res.status(200).send(batch);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};


const deleteBatch = async (req, res) => {
    try {
        // Extract the batch_id from the request parameters
        const { batch_id } = req.body;
        const studentId = req.studentId; 
        console.log("student id :", studentId)
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role
        console.log("role :"+userRole)
        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }
        console.log("batch id :" , batch_id)
        const batch = await Batch.findByPk(batch_id);

        // Check if the batch exists
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        // Delete the batch
        await batch.destroy();

        // Respond with success message
        res.status(200).json({ message: 'Batch deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
};
const updateBatch = async (req, res) => {
    try {
        const { batch_id, batch_name, description, price, duration, trainer_id } = req.body;
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role

        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Find the batch by ID
        let batch = await Batch.findByPk(batch_id);

        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        // Update batch fields
        batch.batch_name = batch_name;
        batch.description = description;
        batch.price = price;
        batch.duration = duration;
        batch.trainer_id = trainer_id;

        // Save the updated batch
        await batch.save();

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

//controller function to get the students by batch wise 
const getStudentsByBatches = async (req, res) => {
    try {
        const studentId = req.studentId; 
        const user = await Student.findByPk(studentId); // Fetch user from database
        const userRole = user.role; // Get the user's role
        console.log("role :"+userRole)
        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }
        const batchNames = req.body.batchNames; 
        const students = await db.Student.findAll({
            include: [{
                model: db.Batch,
                where: {
                    batch_name: batchNames // Filter by batch names
                },
                through: {
                    attributes: [] // Exclude any additional attributes from the join table
                }
            }],
            attributes: ['id', 'name', 'email', 'phoneNumber', 'role'] // Only select necessary attributes
        });

        // Format the response data
        const studentsInBatches = students.map(student => ({
            id: student.id,
            name: student.name,
            email: student.email,
            phoneNumber: student.phoneNumber,
            role: student.role,
            batches: student.Batches // Array of associated batches
        }));

        // Send the response
        res.status(200).json({ students: studentsInBatches });
    } catch (error) {
        console.error('Failed to fetch students by batches:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const assignTrainerToBatch = async (req, res) => {
    try {
        //here studentId is nothing but trainer id 
        const { studentId, batchIds } = req.body; 
        
        if (!studentId) {
            return res.status(400).json({ error: 'Missing studentId in request body' });
        }

        // Fetch the student from the database using the studentId
        const student = await Student.findByPk(studentId);
        
        // Ensure the student exists
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }    

        //check for the role and then assign the batch
        const role = student.role;
        if (role !== 'TRAINER') {
            return res.status(403).json({ error: 'Only trainers can be assigned to batches' });
        }

        // Fetch the trainer's details
        const trainerId = student.id; // Assuming the trainer's ID is the same as student's ID
        
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

        // Update the batches with the trainer's ID
        await Promise.all(batches.map(async batch => {
            await batch.update({ trainer_id: trainerId });
        }));

        res.status(200).json({ message: 'Trainer assigned to batches successfully.' });
    } catch (error) {
        console.error('Failed to assign trainer to batches.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const fetchBatchesAssignedToTrainer = async (req, res) => {
    try {
        const { trainerId } = req.body; // Extract trainerId from the request parameters
        
        if (!trainerId) {
            return res.status(400).json({ error: 'Missing trainerId in request parameters' });
        }

        // Fetch the trainer from the database using the trainerId
        const trainer = await Student.findByPk(trainerId);
        
        // Ensure the trainer exists
        if (!trainer) {
            return res.status(404).json({ error: 'Trainer not found' });
        }    

        // Fetch the batches assigned to the trainer
        const batches = await Batch.findAll({
            where: {
                trainer_id: trainerId
            }
        });

        res.status(200).json({ batches });
    } catch (error) {
        console.error('Failed to fetch batches assigned to trainer.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// const fetchTrainerDetailsFromBatch = async (req, res) => {
//     try {
//         const { batchId } = req.body; // Extract batchId from the request parameters
        
//         if (!batchId) {
//             return res.status(400).json({ error: 'Missing batchId ' });
//         }

//         // Fetch the batch details
//         const batch = await Batch.findOne({
//             where: {
//                 batch_id: batchId
//             }
//         });

//         // Ensure the batch exists
//         if (!batch) {
//             return res.status(404).json({ error: 'Batch not found' });
//         }

//         // Extract trainer_id from the batch
//         const trainerId = batch.trainer_id;

//         // Fetch the trainer details from the student table using the trainer_id
//         const trainerDetails = await Student.findOne({
//             where: {
//                 id: trainerId
//             },
//             attributes: ['id', 'name', 'email'] // Include only required attributes
//         });

//         // Ensure the trainer details are found
//         if (!trainerDetails) {
//             return res.status(404).json({ error: 'Trainer details not found' });
//         }

//         res.status(200).json({ trainerDetails });
//     } catch (error) {
//         console.error('Failed to fetch trainer details from batch.', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

const fetchTrainerDetailsFromBatch = async (req, res) => {
    try {
        const { batchId } = req.body; // Extract batchId from the request parameters
        
        if (!batchId) {
            return res.status(400).json({ error: 'Missing batchId ' });
        }

        // Fetch the batch details along with the trainer details
        const batch = await Batch.findOne({
            where: {
                batch_id: batchId
            },
            include: [
                {
                    model: Student, // Include the Student (trainer) model
                    attributes: ['id', 'name', 'email'] // Include only required attributes
                }
            ]
        });

        // Ensure the batch exists
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        // Extract trainer details from the batch
        const trainerDetails = batch.trainer;

        res.status(200).json({ batch, trainerDetails });
    } catch (error) {
        console.error('Failed to fetch trainer details from batch.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const fetchTrainerAndBatchFromStudent = async (req, res) => {
    try {
        const { studentId } = req.body; // Extract studentId from the request parameters
        
        if (!studentId) {
            return res.status(400).json({ error: 'Missing studentId ' });
        }

        // Fetch the student details
        const student = await Student.findOne({
            where: {
                id: studentId
            },
            attributes: ['id', 'name', 'email'] // Include only required attributes
        });

        // Ensure the student exists
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Fetch all batch details associated with the student
        const studentBatches = await StudentBatch.findAll({
            where: {
                student_id: studentId
            }
        });

        // Ensure the student is associated with at least one batch
        if (studentBatches.length === 0) {
            return res.status(404).json({ error: 'Student is not associated with any batch' });
        }

        // Fetch all batch details and their respective trainer details
        const batchesDetails = await Promise.all(studentBatches.map(async (studentBatch) => {
            const batchId = studentBatch.batch_id;
            const batch = await Batch.findOne({
                where: {
                    batch_id: batchId
                }
            });

            // Fetch the trainer details associated with the batch
            const trainerDetails = await Student.findOne({
                where: {
                    id: batch.trainer_id
                },
                attributes: ['id', 'name', 'email'] // Include only required attributes
            });

            return { batch, trainerDetails };
        }));

        res.status(200).json({ student, batchesDetails });
    } catch (error) {
        console.error('Failed to fetch student, batch, and trainer details.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 




module.exports = {
    saveBatch,
    assignBatchesToStudent,
    getStudentBatches,
    getAllStudentsWithBatches,
    getAllBatches,
    deassignBatchesFromStudent,
    getStudentsByBatches,
    deleteBatch,
    updateBatch,
    assignTrainerToBatch,
    fetchBatchesAssignedToTrainer,
    fetchTrainerDetailsFromBatch,
    fetchTrainerAndBatchFromStudent,
}
