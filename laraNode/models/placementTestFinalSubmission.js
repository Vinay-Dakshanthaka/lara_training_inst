module.exports = (sequelize, DataTypes) => {
    const PlacementTestFinalSubmission = sequelize.define('PlacementTestFinalSubmission', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        placement_test_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Placementtests',
                key: 'placement_test_id'
            }
        },
        placement_test_student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'PlacementTestStudents',
                key: 'placement_test_student_id'
            }
        },
        final_submission: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false 
        },
        latitude: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: true, 
            comment: "Latitude of student's test location"
        },
        longitude: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: true, 
            comment: "Longitude of student's test location"
        },
        attended_in_institute: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false, 
            comment: "True if student attended from institute"
        },
        evaluation: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false 
        },
    });

    return PlacementTestFinalSubmission;
};
