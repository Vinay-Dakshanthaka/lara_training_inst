module.exports = (sequelize, DataTypes) => {
    const WeeklyTest = sequelize.define('WeeklyTest', {
        wt_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        wt_link: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        test_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        is_monitored: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        no_of_questions: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        wt_description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'WeeklyTests'
    });

    WeeklyTest.associate = (models) => {
        WeeklyTest.hasMany(models.WeeklyTestTopics, {
            foreignKey: 'wt_id',
            as: 'TestWeekly'
        });
    
        // Association with WeeklyTestQuestionMapping instead of directly with WeeklyTestQuestion
        WeeklyTest.hasMany(models.WeeklyTestQuestionMapping, {
            foreignKey: 'wt_id',
            as: 'TestQuestionMappings'  // Alias for the association
        });
    };
    

    return WeeklyTest;
};
