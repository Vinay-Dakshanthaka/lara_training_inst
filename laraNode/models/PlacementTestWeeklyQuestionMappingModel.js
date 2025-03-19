module.exports = (sequelize, DataTypes) => {
    const PlacementTestWeeklyQuestionMapping = sequelize.define('PlacementTestWeeklyQuestionMapping', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        placement_test_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        wt_question_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'PlacementTestWeeklyQuestionMapping'
    });

    PlacementTestWeeklyQuestionMapping.associate = (models) => {
        PlacementTestWeeklyQuestionMapping.belongsTo(models.PlacementTest, {
            foreignKey: 'placement_test_id',
            as: 'Placementtests'
        });

        PlacementTestWeeklyQuestionMapping.belongsTo(models.WeeklyTestQuestion, {
            foreignKey: 'wt_question_id',
            as: 'WeeklyTestQuestion'
        });
    };

    return PlacementTestWeeklyQuestionMapping;
};
