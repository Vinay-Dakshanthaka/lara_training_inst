module.exports = (sequelize, DataTypes) => {
    const PaperBasedTestResult = sequelize.define("PaperBasedTestResult", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Students", 
                key: "id"
            },
            onDelete: "CASCADE"
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            
        },
        obtainedMarks: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        totalMarks: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        subjectName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        topicName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        conducted_date: {  // Updated field name to camelCase for consistency
            type: DataTypes.DATE, // Use DATE or DATEONLY if time is not required
            allowNull: true
        },
        testName: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        timestamps: true
    });

    return PaperBasedTestResult;
};

// ALTER TABLE laradb.paperbasedtestresults
// ADD COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// ADD COLUMN updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
// ADD COLUMN conducted_date DATE;
// ALTER TABLE laradb.paperbasedtestresults
// ADD COLUMN testName VARCHAR(255);