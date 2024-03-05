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

db.Student.belongsToMany(db.Batch, { 
    through: db.Student_Batch,
    foreignKey: 'student_id',
    otherKey: 'batch_id'
});
db.Batch.belongsToMany(db.Student, { 
    through: db.Student_Batch,
    foreignKey: 'batch_id',
    otherKey: 'student_id'
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
