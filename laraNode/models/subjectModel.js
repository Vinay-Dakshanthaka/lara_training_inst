module.exports = (sequelize, DataTypes) => {
    const Subject = sequelize.define('Subject', {
        subject_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: true // Enabling timestamps for tracking purposes
    });

    Subject.associate = (models) => {
        Subject.hasMany(models.Topic, {
            foreignKey: 'subject_id',
            as: 'topics'
        });
    };

    return Subject;
};
