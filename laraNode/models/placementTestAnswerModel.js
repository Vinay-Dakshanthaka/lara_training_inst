module.exports = (sequelize, DataTypes) => {
    const PlacementTestAnswer = sequelize.define('PlacementTestAnswer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        placement_test_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'PlacementTests',
                key: 'placement_test_id'
            }
        },
        placement_test_student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Placementteststudents',
                key: 'placement_test_student_id'
            }
        },
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'weeklytestquestions',
                key: 'wt_question_id'
            }
        },
        answer: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        marks: {
            type: DataTypes.INTEGER,
            allowNull: true  
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, 
    {
        timestamps: true, // Enabling timestamps for tracking purposes
        tableName: 'Placementtestanswers' // Specify the actual table name
    });

    return PlacementTestAnswer;
};
    