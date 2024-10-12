module.exports = (sequelize, DataTypes) => {
    const WeeklyTestQuestionMapping = sequelize.define('WeeklyTestQuestionMapping', {
        wtqm_id: {  // Unique identifier for this association
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
        timestamps: false,  // No timestamps necessary for this junction table
        tableName: 'WeeklyTestQuestionMapping'  // Custom table name
    });

    WeeklyTestQuestionMapping.associate = (models) => {
        // Associate the mapping with WeeklyTest
        WeeklyTestQuestionMapping.belongsTo(models.WeeklyTest, {
            foreignKey: 'wt_id',
            as: 'WeeklyTest'  // Alias for WeeklyTest association
        });

        // Associate the mapping with WeeklyTestQuestion
        WeeklyTestQuestionMapping.belongsTo(models.WeeklyTestQuestion, {
            foreignKey: 'wt_question_id',
            as: 'WeeklyTestQuestion'  // Alias for WeeklyTestQuestion association
        });
    };

    return WeeklyTestQuestionMapping;
};
