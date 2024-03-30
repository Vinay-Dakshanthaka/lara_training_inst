const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Attendance = sequelize.define("Attendance", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('P', 'A'),
            allowNull: false,
            defaultValue: 'A'
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'attendance',
        timestamps: false
    });

    Attendance.associate = (models) => {
        Attendance.belongsTo(models.Student, {
            foreignKey: 'student_id'
        });
    };

    return Attendance;
};
   