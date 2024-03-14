module.exports = (sequelize, DataTypes) => {
    const Questions = sequelize.define('Questions', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        batch_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        trainer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        question: {
            type: DataTypes.TEXT, 
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT, 
            allowNull: true
        }
    }, {
        timestamps: false
    });

    return Questions;
};
