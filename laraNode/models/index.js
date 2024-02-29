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

// Define associations for one-to-one relationship
db.Student.hasOne(db.Profile, {
    foreignKey: 'student_id',
    as: 'profile', // Alias for the associated profile
    onDelete: 'CASCADE' // Delete the profile if the associated student is deleted
});

db.Profile.belongsTo(db.Student, {
    foreignKey: 'student_id',
    onDelete: 'CASCADE' // Cascade delete the associated profile if the student is deleted
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
