module.exports = (sequelize, DataTypes) => {
    const Student_Batch = sequelize.define('Student_Batch', {
        student_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Students',
                key: 'id'
            }
        },
        batch_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Batches',
                key: 'batch_id'
            }
        },
       
    }, {
        tableName: 'Student_Batch',
        timestamps: false 
    });
    return Student_Batch;
};
