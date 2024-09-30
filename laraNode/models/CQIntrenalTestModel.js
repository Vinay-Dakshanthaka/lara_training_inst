// CumulativeQuestionInternalTest.js
module.exports = (sequelize, DataTypes) => {
    const CQInternalTest = sequelize.define('CQInternalTest', {
        cumulative_question_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'CumulativeQuestion',
                key: 'cumulative_question_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        internal_test_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'InternalTest',
                key: 'internal_test_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    }, {
        timestamps: false,
        tableName: 'CQInternalTest', // Ensure consistency here
        indexes: [
            {
                name: 'uq_cq_it_unique',
                unique: true, // Ensure that the combination is unique
                fields: ['cumulative_question_id', 'internal_test_id']
            }
        ]
    });

    return CQInternalTest;
};
