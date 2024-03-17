const db = require('../models');
const jwt = require('jsonwebtoken');

const Student = db.Student;
const Profile = db.Profile;
const Batch = db.Batch;
const StudentBatch = db.Student_Batch
const BatchTrainer = db.BatchTrainer
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

const getBatchById = async (req, res) => {
    try {
        const studentId = req.studentId;
        const {batch_id} = req.body; 
        // console.log("batchid ",batch_id)
        
        // Fetch user from database
        const user = await Student.findByPk(studentId);
        // const userRole = user.role; // Get the user's role

        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        // if (userRole !== 'ADMIN') {
        //     return res.status(403).json({ error: 'Access forbidden' });
        // }

        // Find batch by ID in the database
        const batch = await Batch.findByPk(batch_id);

        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        res.status(200).json(batch);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
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
        console.log("role :" + userRole)
        // Check if the user role is either "ADMIN" or "SUPER ADMIN"
        if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: 'Access forbidden' });
        }
        console.log("batch id :", batch_id)
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
        console.log("role :" + userRole)
        // Check if the user role is either "ADMIN" or 
        if (userRole !== 'ADMIN' && userRole !== 'SUPER ADMIN') {
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

        // Ensure all batchIds exist
        if (batches.length !== batchIds.length) {
            return res.status(404).json({ error: 'One or more batches not found' });
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



// const getStudentBatches = async (req, res) => {
//     try {
//         const studentId = req.studentId;
//         console.log('Student ID:', studentId);

//         // Step 1: Fetch all batches with their associated trainers
//         const allBatches = await Batch.findAll({
//             include: [
//                 {
//                     model: Student, // Trainer details
//                     as: 'trainer',
//                     where: {
//                         role: 'TRAINER'
//                     },
//                     attributes: ['id', 'name', 'email', 'phoneNumber'] // Trainer details to retrieve
//                 }
//             ]
//         });

//         // Step 2: Filter the batches to include only those associated with the student
//         const studentBatches = allBatches.filter(batch => {
//             // Check if the students property exists and is an array
//             if (batch.students && Array.isArray(batch.students)) {
//                 // Check if the student is associated with this batch
//                 return batch.students.some(student => student.id === studentId);
//             }
//             // Return false if students property is not defined or is not an array
//             return false;
//         });

//         res.status(200).json({ studentBatches });
//     } catch (error) {
//         console.error('Failed to fetch student batches:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };







// Controller function to fetch all students and their batches

const getStudentBatches = async (req, res) => {
    try {
        const studentId = req.studentId; // Extract studentId from the request parameters

        if (!studentId) {
            return res.status(400).json({ error: 'Missing studentId' });
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


const getAllStudentsWithBatches = async (req, res) => {
    try {
        // Fetch all students with role 'STUDENT'
        const students = await Student.findAll({
            where: {
                role: 'STUDENT'
            },
            attributes: ['id', 'name', 'email'] // Include only required attributes
        });

        // Ensure at least one student exists
        if (students.length === 0) {
            return res.status(404).json({ error: 'No students found' });
        }

        // Fetch batch details for each student
        const studentsWithBatches = await Promise.all(students.map(async (student) => {
            // Fetch all batch details associated with the student
            const studentBatches = await StudentBatch.findAll({
                where: {
                    student_id: student.id
                }
            });

            // Fetch batch and trainer details for each batch
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

            return { student, batchesDetails };
        }));

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
        console.log("role :" + userRole)
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

// const assignTrainersToBatch = async (req, res) => {
//     try {
//         const { trainerIds, batchId } = req.body; // Extract trainerIds and batchId from the request body

//         if (!trainerIds || !batchId) {
//             return res.status(400).json({ error: 'Missing trainerIds or batchId in request body' });
//         }

//         // Fetch the batch from the database using the batchId
//         const batch = await Batch.findByPk(batchId);

//         // Ensure the batch exists
//         if (!batch) {
//             return res.status(404).json({ error: 'Batch not found' });
//         }

//         // Associate the trainers with the batch by creating records in the BatchTrainer table
//         await Promise.all(trainerIds.map(async trainerId => {
//             await BatchTrainer.create({
//                 batch_id: batchId,
//                 trainer_id: trainerId
//             });
//         }));

//         res.status(200).json({ message: 'Trainers assigned to batch successfully.' });
//     } catch (error) {
//         console.error('Failed to assign trainers to batch.', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

const assignTrainersToBatch = async (req, res) => {
    try {
        const { trainerId, batchIds } = req.body; // Extract trainerId and batchIds from the request body

        if (!trainerId || !batchIds || batchIds.length === 0) {
            return res.status(400).json({ error: 'Missing trainerId or batchIds in request body' });
        }

        // Fetch the trainer from the database using the trainerId
        const trainer = await Student.findByPk(trainerId);

        // Ensure the trainer exists
        if (!trainer) {
            return res.status(404).json({ error: 'Trainer not found' });
        }

        // Fetch all batches from the database using the batchIds
        const batches = await Batch.findAll({
            where: {
                id: batchIds
            }
        });

        // Ensure all batches exist
        if (batches.length !== batchIds.length) {
            return res.status(404).json({ error: 'One or more batches not found' });
        }

        // Associate the trainer with the batches by creating records in the BatchTrainer table
        await Promise.all(batchIds.map(async batchId => {
            await BatchTrainer.create({
                batch_id: batchId,
                trainer_id: trainerId
            });
        }));

        res.status(200).json({ message: 'Batches assigned to trainer successfully.' });
    } catch (error) {
        console.error('Failed to assign batches to trainer.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const deassignBatchFromTrainer = async (req, res) => {
    try {
        const { trainerId, batchId } = req.body; // Extract trainerId and batchId from the request body

        if (!trainerId || !batchId) {
            return res.status(400).json({ error: 'Missing trainerId or batchId in request body' });
        }

        // Find and delete the entry in BatchTrainer table
        await BatchTrainer.destroy({
            where: {
                batch_id: batchId,
                trainer_id: trainerId
            }
        });

        res.status(200).json({ message: 'Batch de-assigned from trainer successfully.' });
    } catch (error) {
        console.error('Failed to de-assign batch from trainer.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const assignBatchesToTrainer = async (req, res) => {
    try {
        const { trainerId, batchIds } = req.body; // Extract trainerId and batchIds from the request body

        if (!trainerId || !batchIds || batchIds.length === 0) {
            return res.status(400).json({ error: 'Missing trainerId or batchIds in request body' });
        }

        // Fetch the trainer from the database using the trainerId
        const trainer = await Student.findByPk(trainerId);

        // Ensure the trainer exists
        if (!trainer) {
            return res.status(404).json({ error: 'Trainer not found' });
        }

        // Fetch all batches from the database using the batchIds
        // Fetch all batches from the database using the batchIds
        const batches = await Batch.findAll({
            where: {
                batch_id: batchIds // Use batch_id instead of id
            }
        });


        // Ensure all batches exist
        if (batches.length !== batchIds.length) {
            return res.status(404).json({ error: 'One or more batches not found' });
        }

        // Associate the trainer with the batches by creating records in the BatchTrainer table
        await Promise.all(batchIds.map(async batchId => {
            await BatchTrainer.create({
                batch_id: batchId,
                trainer_id: trainerId
            });
        }));

        res.status(200).json({ message: 'Batches assigned to trainer successfully.' });
    } catch (error) {
        console.error('Failed to assign batches to trainer.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const fetchBatchesAssignedToTrainer = async (req, res) => {
    try {
        const studentId = req.studentId; // Extract studentId from the request
        console.log('student id :', studentId)

        if (!studentId) {
            return res.status(400).json({ error: 'Missing studentId in request parameters' });
        }

        // Fetch all batch_ids associated with the trainer_id from the batchTrainer table
        const batchTrainerEntries = await BatchTrainer.findAll({
            where: {
                trainer_id: studentId
            }
        });
        console.log("batchTrainerEntries :", batchTrainerEntries);

        // Extract batch_ids from the fetched entries
        const batchIds = batchTrainerEntries.map(entry => entry.batch_id);

        // Fetch all batches associated with the retrieved batchIds
        const batches = await Batch.findAll({
            where: {
                batch_id: batchIds
            }
        });
        console.log("batches :", batches);

        res.status(200).json({ batches });
    } catch (error) {
        console.error('Failed to fetch batches assigned to trainer.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const fetchAllTrainerAndBatch = async (req, res) => {
    try {
        // Fetch all trainers from the database
        const trainers = await Student.findAll({
            where: {
                role: 'TRAINER'
            }
        });

        if (!trainers || trainers.length === 0) {
            return res.status(404).json({ error: 'No trainers found' });
        }

        // Fetch batch IDs for each trainer from the BatchTrainers table
        const trainersWithBatches = await Promise.all(trainers.map(async trainer => {
            // Find all BatchTrainer entries associated with the current trainer
            const batchTrainers = await BatchTrainer.findAll({
                where: {
                    trainer_id: trainer.id
                }
            });

            // Extract batch IDs from the batchTrainers
            const batchIds = batchTrainers.map(batchTrainer => batchTrainer.batch_id);

            // Fetch batch details for each batch ID
            const batches = await Batch.findAll({
                where: {
                    batch_id: batchIds // Use batch_id instead of id
                }
            });

            return { trainer, batches };
        }));

        res.status(200).json(trainersWithBatches);
    } catch (error) {
        console.error('Failed to fetch trainers and their batches.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




// const fetchTrainerDetailsFromBatch = async (req, res) => {
//     try {
//         const { batchId } = req.body; // Extract batchId from the request parameters

//         if (!batchId) {
//             return res.status(400).json({ error: 'Missing batchId ' });
//         }

//         // Fetch the batch details along with the trainer details
//         const batch = await Batch.findOne({
//             where: {
//                 batch_id: batchId
//             },
//             include: [
//                 {
//                     model: Student, // Include the Student (trainer) model
//                     attributes: ['id', 'name', 'email'] // Include only required attributes
//                 }
//             ]
//         });

//         // Ensure the batch exists
//         if (!batch) {
//             return res.status(404).json({ error: 'Batch not found' });
//         }

//         // Extract trainer details from the batch
//         const trainerDetails = batch.trainer;

//         res.status(200).json({ batch, trainerDetails });
//     } catch (error) {
//         console.error('Failed to fetch trainer details from batch.', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


const fetchTrainerAndBatchFromStudent = async (req, res) => {
    try {
        // const { studentId } = req.body;
        const studentId = req.studentId;

        // Step 1: Check if the provided studentId exists
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Step 2: Fetch all batch details associated with the student
        const studentBatches = await StudentBatch.findAll({
            where: { student_id: studentId },
            attributes: ['batch_id']
        });

        // Step 3: Extract batch IDs
        const batchIds = studentBatches.map(studentBatch => studentBatch.batch_id);

        // Step 4: Retrieve all batches with the extracted batch IDs
        const batches = await Batch.findAll({
            where: { batch_id: batchIds }
        });

        // Step 5: Fetch all trainer IDs associated with the batches from BatchTrainer table
        const batchTrainers = await BatchTrainer.findAll({
            where: { batch_id: batchIds },
            attributes: ['batch_id', 'trainer_id']
        });

        // Step 6: Map trainer IDs to batches
        const trainerIdsMap = {};
        batchTrainers.forEach(batchTrainer => {
            const batchId = batchTrainer.batch_id;
            const trainerId = batchTrainer.trainer_id;
            if (!trainerIdsMap[batchId]) {
                trainerIdsMap[batchId] = [];
            }
            trainerIdsMap[batchId].push(trainerId);
        });

        // Step 7: Fetch trainer details for each batch
        const batchesDetails = await Promise.all(batches.map(async batch => {
            const trainersForBatch = trainerIdsMap[batch.batch_id] || [];
            if (trainersForBatch.length > 0) {
                // Fetch trainer details using Promise.all
                const trainers = await Student.findAll({
                    where: { id: trainersForBatch },
                    attributes: ['id', 'name', 'email']
                });
                return {
                    batch,
                    trainerDetails: trainers
                };
            } else {
                return {
                    batch,
                    trainerDetails: null
                };
            }
        }));


        res.status(200).json({ batchesDetails });
    } catch (error) {
        console.error('Failed to fetch student, batch, and trainer details.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getStudentsByBatchId = async (req, res) => {
    try {
        const { batchId } = req.body; // Extract batchId from the request parameters

        if (!batchId) {
            return res.status(400).json({ error: 'Missing batchId' });
        }

        // Fetch all student IDs associated with the batch ID from the studentBatch table
        const studentBatchIds = await StudentBatch.findAll({
            where: {
                batch_id: batchId
            }
        });

        // Ensure at least one student is associated with the batch
        if (studentBatchIds.length === 0) {
            return res.status(404).json({ error: 'No students found for the provided batch ID' });
        }

        // Extract student IDs from the fetched studentBatchIds
        const studentIds = studentBatchIds.map(studentBatch => studentBatch.student_id);

        // Fetch student details for each student ID
        const students = await Promise.all(studentIds.map(async (studentId) => {
            const student = await Student.findOne({
                where: {
                    id: studentId
                },
                attributes: ['id', 'name', 'email'] // Include only required attributes
            });
            return student;
        }));

        res.status(200).json({ students });
    } catch (error) {
        console.error('Failed to fetch students by batch ID.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// const fetchStudentsAndBatchFromTrainer = async (req, res) => {
//     try {
//         const { studentId } = req.body; // Extract studentId from the request parameters

//         if (!studentId) {
//             return res.status(400).json({ error: 'Missing studentId ' });
//         }

//         // Fetch the student details
//         const student = await Student.findOne({
//             where: {
//                 id: studentId
//             },
//             attributes: ['id', 'name', 'email'] // Include only required attributes
//         });

//         // Ensure the student exists
//         if (!student) {
//             return res.status(404).json({ error: 'Student not found' });
//         }

//         // Fetch all batch details associated with the student
//         const studentBatches = await StudentBatch.findAll({
//             where: {
//                 student_id: studentId
//             }
//         });

//         // Ensure the student is associated with at least one batch
//         if (studentBatches.length === 0) {
//             return res.status(404).json({ error: 'Student is not associated with any batch' });
//         }

//         // Fetch all batch details and their respective trainer details
//         const batchesDetails = await Promise.all(studentBatches.map(async (studentBatch) => {
//             const batchId = studentBatch.batch_id;
//             const batch = await Batch.findOne({
//                 where: {
//                     batch_id: batchId
//                 }
//             });

//             // Fetch the trainer details associated with the batch
//             const trainerDetails = await Student.findOne({
//                 where: {
//                     id: batch.trainer_id
//                 },
//                 attributes: ['id', 'name', 'email', 'role'] // Include only required attributes
//             });
//             return { batch, trainerDetails };
//         }));

//         res.status(200).json({ student, batchesDetails });
//     } catch (error) {
//         console.error('Failed to fetch student, batch, and trainer details.', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


module.exports = {
    saveBatch,
    getBatchById,
    assignBatchesToStudent,
    getStudentBatches,
    getAllStudentsWithBatches,
    getAllBatches,
    deassignBatchesFromStudent,
    getStudentsByBatches,
    deleteBatch,
    updateBatch,
    assignTrainersToBatch,
    deassignBatchFromTrainer,
    fetchBatchesAssignedToTrainer,
    // fetchTrainerDetailsFromBatch,
    fetchTrainerAndBatchFromStudent,
    fetchAllTrainerAndBatch,
    // fetchStudentsAndBatchFromTrainer,
    assignBatchesToTrainer,
    getStudentsByBatchId
}
