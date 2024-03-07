module.exports = (sequelize, DataTypes) => {
    const Batch = sequelize.define('Batch', {
        batch_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        batch_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: true
        },
        price: {
            type: DataTypes.STRING,
            allowNull: true
        },
        trainer_id: {
            type:DataTypes.STRING,
            allowNull:true
        }
    },{
        timestamps: false 
    }
    );
    return Batch;
}

