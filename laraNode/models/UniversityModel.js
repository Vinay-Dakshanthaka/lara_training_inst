// models/University.js
module.exports = (sequelize, DataTypes) => {
    const University = sequelize.define('University', {
        university_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        university_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'Universities'
    });

    University.associate = (models) => {
        University.hasMany(models.College, {
            foreignKey: 'university_id',
            as: 'Colleges'
        });
    };

    return University;
};
