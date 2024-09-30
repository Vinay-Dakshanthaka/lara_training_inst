// module.exports = (sequelize, DataTypes) => {
//     const InternalTestResult = sequelize.define('InternalTestResult', {
//         internal_test_result_id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true
//         },
//         internal_test_id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: 'Internaltests', // Reference to the InternalTest table
//                 key: 'internal_test_id'
//             },
//             onDelete: 'CASCADE',
//             onUpdate: 'CASCADE'
//         },
//         student_id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: 'Students', // Reference to the Student table
//                 key: 'id' 
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
//         tableName: 'Internaltestresults' // Specify the actual table name
//     });

//     InternalTestResult.associate = (models) => {
//         InternalTestResult.belongsTo(models.InternalTest, {
//             foreignKey: 'internal_test_id',
//             as: 'InternalTests'
//         });
//         InternalTestResult.belongsTo(models.Student, {
//             foreignKey: 'student_id',
//             as: 'Students'
//         });
//     };

//     return InternalTestResult;
// };

module.exports = (sequelize, DataTypes) => {
    const InternalTestResult = sequelize.define('InternalTestResult', {
        internal_test_result_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        internal_test_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Internaltests',
                key: 'internal_test_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Students',
                key: 'id'
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
        // Storing detailed test results in JSON format
        detailed_results: {
            type: DataTypes.JSON, // MySQL supports the JSON type
            allowNull: true // Allow null if detailed results are optional
        }
    }, {
        timestamps: true,
        tableName: 'Internaltestresults'
    });

    InternalTestResult.associate = (models) => {
        InternalTestResult.belongsTo(models.InternalTest, {
            foreignKey: 'internal_test_id',
            as: 'InternalTests'
        });
        InternalTestResult.belongsTo(models.Student, {
            foreignKey: 'student_id',
            as: 'Students'
        });
    };

    return InternalTestResult;
};
