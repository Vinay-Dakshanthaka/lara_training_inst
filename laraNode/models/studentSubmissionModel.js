module.exports = (sequelize, DataTypes) => {
    const StudentSubmission = sequelize.define('StudentSubmission', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        batch_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        code: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        submission_time: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        no_testcase_passed: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        execution_output: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: false
    });

    return StudentSubmission;
};