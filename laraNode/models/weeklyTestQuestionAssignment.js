module.exports = (sequelize, DataTypes) => {
    const WeeklyTestQuestionAssignment = sequelize.define('WeeklyTestQuestionAssignment', {
        wtqa_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        wt_id: {  // Foreign key for WeeklyTest
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'WeeklyTests',
                key: 'wt_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        wt_question_id: {  // Foreign key for WeeklyTestQuestion
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'WeeklyTestQuestions',
                key: 'wt_question_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    }, {
        timestamps: false,
        tableName: 'WeeklyTestQuestionAssignments'
    });

    WeeklyTestQuestionAssignment.associate = (models) => {
        // Associate with WeeklyTest
        WeeklyTestQuestionAssignment.belongsTo(models.WeeklyTest, {
            foreignKey: 'wt_id',
            as: 'TestDetails'  // Alias for WeeklyTest association
        });

        // Associate with WeeklyTestQuestion
        WeeklyTestQuestionAssignment.belongsTo(models.WeeklyTestQuestion, {
            foreignKey: 'wt_question_id',
            as: 'QuestionDetails'  // Alias for WeeklyTestQuestion association
        });
    };

    return WeeklyTestQuestionAssignment;
};
