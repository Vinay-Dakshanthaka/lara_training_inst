module.exports = (sequelize, DataTypes) => {
    const WeeklyTestFinalSubmission = sequelize.define('WeeklyTestFinalSubmission', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        wt_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'WeeklyTests',
                key: 'wt_id'
            }
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Students',
                key: 'id'
            }
        },
        final_submission: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false // Default to false, meaning not yet finalized
        }
    });
    return WeeklyTestFinalSubmission;
};
