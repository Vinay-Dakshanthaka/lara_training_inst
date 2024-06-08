module.exports = (sequelize, DataTypes) => {
    const Topic = sequelize.define('Topic', {
        topic_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        subject_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Subjects',
                key: 'subject_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    }, {
        timestamps: true // Enabling timestamps for tracking purposes
    });

    Topic.associate = (models) => {
        Topic.belongsTo(models.Subject, {
            foreignKey: 'subject_id',
            as: 'subject'
        });
        Topic.hasMany(models.CumulativeQuestion, {
            foreignKey: 'topic_id',
            as: 'questions'
        });
    };
 
    return Topic;
};
