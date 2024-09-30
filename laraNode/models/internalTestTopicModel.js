module.exports = (sequelize, DataTypes) => {
    const InternalTestTopic = sequelize.define('InternalTestTopic', {
        internal_test_topic_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        internal_test_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Internaltests', // Reference to the InternalTest table
                key: 'internal_test_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        topic_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Topics',
                key: 'topic_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    }, {
        timestamps: true, // Enable timestamps for tracking purposes
        tableName: 'Internaltesttopics' // Specify the actual table name
    });

    InternalTestTopic.associate = (models) => {
        InternalTestTopic.belongsTo(models.InternalTest, {
            foreignKey: 'internal_test_id',
            as: 'InternalTests'
        });
        InternalTestTopic.belongsTo(models.Topic, {
            foreignKey: 'topic_id',
            as: 'Topics'
        });
    };

    return InternalTestTopic;
};
