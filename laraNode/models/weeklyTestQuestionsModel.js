module.exports = (sequelize, DataTypes) => {
    const WeeklyTestQuestion = sequelize.define('WeeklyTestQuestion', {
        wt_question_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        wt_question_description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        marks: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        minutes: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        topic_id: {  // Add topic_id as a foreign key
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
        timestamps: false,
        tableName: 'WeeklyTestQuestions'
    });

    WeeklyTestQuestion.associate = (models) => {
        WeeklyTestQuestion.belongsTo(models.Topic, {
            foreignKey: 'topic_id',
            as: 'TopicDetails'
        });
    
        WeeklyTestQuestion.hasMany(models.WeeklyTestQuestionAnswer, {
            foreignKey: 'wt_question_id',
            as: 'QuestionAnswersDetails'
        });
    
        // Association with WeeklyTestQuestionMapping
        WeeklyTestQuestion.hasMany(models.WeeklyTestQuestionMapping, {
            foreignKey: 'wt_question_id',
            as: 'TestMappings'  // Alias for the association
        });

        WeeklyTestQuestion.hasMany(models.PlacementTestWeeklyQuestionMapping, {
            foreignKey: 'wt_question_id',
            as: 'PlacementTestMappings'
        });
        
    };
    

    return WeeklyTestQuestion;
};
