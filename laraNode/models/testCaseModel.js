module.exports = (sequelize, DataTypes) => {
    const Testcases = sequelize.define('Testcases', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        input: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        expected_output: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return Testcases;
};
