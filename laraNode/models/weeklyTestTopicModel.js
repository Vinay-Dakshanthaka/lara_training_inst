module.exports = (sequelize, DataTypes) => {
    const WeeklyTestTopics = sequelize.define('WeeklyTestTopics', {
        wt_topic_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        wt_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        topic_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'WeeklyTestTopics'
    });

    WeeklyTestTopics.associate = (models) => {
        WeeklyTestTopics.belongsTo(models.WeeklyTest, {
            foreignKey: 'wt_id',
            onDelete: 'CASCADE',
            as: 'TestWeekly'  // Alias must match the one used in the `WeeklyTest` model
        });

        WeeklyTestTopics.belongsTo(models.Topic, {
            foreignKey: 'topic_id',
            onDelete: 'CASCADE',
            as: 'TopicAssociation'  // Unique alias for the Topic association
        });
    };

    return WeeklyTestTopics;
};
