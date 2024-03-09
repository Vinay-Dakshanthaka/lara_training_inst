module.exports = (sequelize, DataTypes) => {
    const BatchTrainer = sequelize.define('BatchTrainer', {
        batch_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Batches',
                key: 'batch_id' 
            }
        },
        trainer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Students',
                key: 'id'
            }
        }
    }, {
        tableName: 'BatchTrainers',
        timestamps: false 
    });

    return BatchTrainer;
};
