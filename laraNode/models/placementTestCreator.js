module.exports = (sequelize, DataTypes) => {
    const PlacementTestCreator = sequelize.define('PlacementTestCreator', {
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Students', // Reference the Students table
                key: 'id' // Assuming 'id' is the primary key for the Student model
            },
            onDelete: 'CASCADE' // Cascade delete if the student is deleted
        },
        placement_test_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Placementtests', // Reference the PlacementTest table
                key: 'placement_test_id' // Assuming 'placement_test_id' is the primary key for PlacementTest
            },
            onDelete: 'CASCADE' // Cascade delete if the placement test is deleted
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false, // No need for createdAt or updatedAt here
        tableName: 'PlacementTestCreators' // The name of the third table
    });

    PlacementTestCreator.associate = (models) => {
        // Define associations here if necessary
    };

    return PlacementTestCreator;
};
