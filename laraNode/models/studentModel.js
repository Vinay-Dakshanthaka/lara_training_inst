module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define("Student", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true 
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('ADMIN', 'STUDENT', 'SUPER ADMIN'),
            allowNull: false
        }
    },
    {
        timestamps: false // Disable createdAt and updatedAt
    }
    );

    return Student;
};
