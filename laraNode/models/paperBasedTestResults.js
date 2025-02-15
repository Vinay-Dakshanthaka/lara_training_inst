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
        }
    }, {
        timestamps: false
    });

    return PaperBasedTestResult;
};
