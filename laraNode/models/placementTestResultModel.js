// // placementTestResultsModel.js

// module.exports = (sequelize, DataTypes) => {
//     const PlacementTestResult = sequelize.define('PlacementTestResult', {
//         placement_test_result_id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true
//         },
//         placement_test_id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: 'Placementtests', // Specify the actual table name
//                 key: 'placement_test_id'
//             },
//             onDelete: 'CASCADE',
//             onUpdate: 'CASCADE'
//         },
//         placement_test_student_id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: 'Placementteststudents', // Specify the actual table name
//                 key: 'placement_test_student_id'
//             },
//             onDelete: 'CASCADE',
//             onUpdate: 'CASCADE'
//         },
//         marks_obtained: {
//             type: DataTypes.INTEGER,
//             allowNull: false
//         },
//         total_marks: {
//             type: DataTypes.INTEGER,
//             allowNull: false
//         }
//     }, {
//         timestamps: true, // Enabling timestamps for tracking purposes
//         tableName: 'Placementtestresults' // Specify the actual table name
//     });

//     PlacementTestResult.associate = (models) => {
//         PlacementTestResult.belongsTo(models.PlacementTest, {
//             foreignKey: 'placement_test_id',
//             as: 'Placementtests'
//         });
//         PlacementTestResult.belongsTo(models.PlacementTestStudent, {
//             foreignKey: 'placement_test_student_id',
//             as: 'Placementteststudents'
//         });
//     };

//     return PlacementTestResult;
// };


// placementTestResultsModel.js

module.exports = (sequelize, DataTypes) => {
    const PlacementTestResult = sequelize.define('PlacementTestResult', {
        placement_test_result_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        placement_test_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Placementtests', // Specify the actual table name
                key: 'placement_test_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        placement_test_student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Placementteststudents', // Specify the actual table name
                key: 'placement_test_student_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        marks_obtained: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_marks: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        university_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        college_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        timestamps: true, // Enabling timestamps for tracking purposes
        tableName: 'Placementtestresults' // Specify the actual table name
    });

    PlacementTestResult.associate = (models) => {
        PlacementTestResult.belongsTo(models.PlacementTest, {
            foreignKey: 'placement_test_id',
            as: 'Placementtests'
        });
        PlacementTestResult.belongsTo(models.PlacementTestStudent, {
            foreignKey: 'placement_test_student_id',
            as: 'Placementteststudents'
        });
    };

    return PlacementTestResult;
};