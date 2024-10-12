module.exports = (sequelize, DataTypes) => {
    const WeeklyTestQuestionAnswer = sequelize.define('WeeklyTestQuestionAnswer', {
        wt_answers_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        answer: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false,
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
