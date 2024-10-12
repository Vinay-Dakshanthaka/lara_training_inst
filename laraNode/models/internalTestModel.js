module.exports = (sequelize, DataTypes) => {
    const InternalTest = sequelize.define('InternalTest', {
        internal_test_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        internal_test_link: {
            type: DataTypes.STRING,
            allowNull: false
        },
        test_description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        number_of_questions: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        show_result: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        is_monitored: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        test_date: {
            type: DataTypes.DATE,
            allowNull: true, 
            defaultValue: null
        }
    }, {
        timestamps: true,
        tableName: 'Internaltests'
    });

    InternalTest.associate = (models) => {
        InternalTest.belongsToMany(models.CumulativeQuestion, {
            through: 'CQInternalTest',
            foreignKey: 'internal_test_id',
            as: 'CumulativeQuestions'
        });
    };

    return InternalTest;
};
