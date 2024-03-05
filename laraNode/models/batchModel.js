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
    }, {
        timestamps: false 
    }
    );
    return Batch;
}

