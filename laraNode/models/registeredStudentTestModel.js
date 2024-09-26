// // registeredStudentTestsModel.js

// module.exports = (sequelize, DataTypes) => {
//     const RegisteredStudentTest = sequelize.define('RegisteredStudentTest', {
//         registered_student_test_id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true
//         },
//         user_id: {  // Reference to the registered user (student)
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: 'Students', // Specify your actual Users table
//                 key: 'id'
//             },
//             onDelete: 'CASCADE',
//             onUpdate: 'CASCADE'
//         },
//         placement_test_id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: 'Placementtests',  // Specify actual Placementtests table
//                 key: 'placement_test_id'
//             },
//             onDelete: 'CASCADE',
//             onUpdate: 'CASCADE'
//         },
//         placement_test_result_id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: 'Placementtestresults',  // Specify actual Placementtestresults table
//                 key: 'placement_test_result_id'
//             },
//             onDelete: 'CASCADE',
//             onUpdate: 'CASCADE'
//         }
//     }, {
//         timestamps: true,  // Enable timestamps
//         tableName: 'RegisteredStudentTests' // Specify actual table name
//     });

//     return RegisteredStudentTest;
// };
