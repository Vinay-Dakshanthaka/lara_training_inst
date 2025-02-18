module.exports = (sequelize, DataTypes) => {
    const WeeklyTestQuestionAnswer = sequelize.define('WeeklyTestQuestionAnswer', {
        wt_answers_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        answer: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        keywords : {
            type: DataTypes.TEXT,
            allowNull : true
        }
    },
    {
        timestamps: true,
        tableName: 'WeeklyTestQuestionAnswers'
    });

    WeeklyTestQuestionAnswer.associate = (models) => {
        WeeklyTestQuestionAnswer.belongsTo(models.WeeklyTestQuestion, {
            foreignKey: 'wt_question_id',
            onDelete: 'CASCADE'
        });
    };

    return WeeklyTestQuestionAnswer;
};

// ALTER TABLE WeeklyTestQuestionAnswers add COLUMN keywords TEXT;


// ALTER TABLE laradb.weeklytestquestionanswers
// ADD COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// ADD COLUMN updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;