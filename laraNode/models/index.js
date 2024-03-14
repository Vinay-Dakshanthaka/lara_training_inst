const dbConfig = require('../config/dbConfig.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
}
);

sequelize.authenticate()
    .then(() => {
        console.log('Connected to the database.');
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Define models
db.Student = require('./studentModel.js')(sequelize, DataTypes);
db.Profile = require('./profileModel.js')(sequelize, DataTypes);
db.Batch = require('./batchModel.js')(sequelize, DataTypes); // Import Batch model
db.Student_Batch = require('./studentBatchModel.js')(sequelize, DataTypes); // Import Student_Batch model
db.BatchTrainer = require('./batchTrainerModel.js')(sequelize, DataTypes);
db.Review = require('./studentReviewModel.js')(sequelize, DataTypes);
db.Questions = require('./questionsModel.js')(sequelize, DataTypes);
db.TestCase = require('./testCaseModel.js')(sequelize, DataTypes); 
db.StudentSubmission = require('./studentSubmissionModel.js')(sequelize, DataTypes); 
// Define associations
db.Student.hasOne(db.Profile, {
    foreignKey: 'student_id',
    as: 'profile',
    onDelete: 'CASCADE'
});

db.Profile.belongsTo(db.Student, {
    foreignKey: 'student_id',
    onDelete: 'CASCADE'
});


// db.Student.belongsToMany(db.Batch, { through: db.Student_Batch }); // Define many-to-many association
// db.Batch.belongsToMany(db.Student, { through: db.Student_Batch }); // Define many-to-many association

// db.Student.belongsToMany(db.Batch, {
//     through: db.Student_Batch,
//     foreignKey: 'student_id',
//     otherKey: 'batch_id'
// });
// db.Batch.belongsToMany(db.Student, {
//     through: 'Student_Batch',
//     foreignKey: 'student_id',
//     otherKey: 'batch_id'
// });


// Define the association between Student and Batch
db.Student.belongsToMany(db.Batch, { through: 'Student_Batch', foreignKey: 'student_id' });
db.Batch.belongsToMany(db.Student, { through: 'Student_Batch', foreignKey: 'batch_id' });

// Define associations for Student (Trainer) to Batch
db.Student.belongsToMany(db.Batch, {
    through: {
        model: 'BatchTrainer',
        unique: false // Allow duplicate pairs (batch_id, trainer_id)
    },
    foreignKey: 'trainer_id', // Foreign key in the association table pointing to trainer_id
    otherKey: 'batch_id', // Foreign key in the association table pointing to batch_id
    // scope: {
    //     role: 'TRAINER' // Filter trainers based on role
    // }
});

// Define associations for Batch to Student (Trainer)
db.Batch.belongsToMany(db.Student, {
    through: {
        model: 'BatchTrainer',
        unique: false // Allow duplicate pairs (batch_id, trainer_id)
    },
    foreignKey: 'batch_id', // Foreign key in the association table pointing to batch_id
    otherKey: 'trainer_id', // Foreign key in the association table pointing to trainer_id
    // scope: {
    //     role: 'TRAINER' // Filter trainers based on role
    // }
});


// Sync models with the database
db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synchronized.');
    })
    .catch(err => {
        console.error('Error synchronizing database:', err);
    });

module.exports = db;
