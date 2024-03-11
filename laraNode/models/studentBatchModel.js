module.exports = (sequelize, DataTypes) => {
    const Student_Batch = sequelize.define('Student_Batch', {
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Student',
                key: 'id'
            }
        },
        batch_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Batch',
                key: 'batch_id'
            }
        }
    }, {
        tableName: 'Student_Batch',
        timestamps: false 
    });

    return Student_Batch;
};