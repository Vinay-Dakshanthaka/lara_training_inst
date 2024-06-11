module.exports = (sequelize, DataTypes) => {
    const TestResults = sequelize.define("TestResults", {
        testResult_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        total_marks: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        completed_date_time: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        obtained_marks: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        question_ans_data: {
            type: DataTypes.JSON,
            allowNull: false
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        timestamps: false // Disable createdAt and updatedAt
    });

    return TestResults; 
};
