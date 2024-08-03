// module.exports = (sequelize, DataTypes) => {
//     const CumulativeQuestion = sequelize.define('CumulativeQuestion', {
//         cumulative_question_id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true
//         },
//         topic_id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: 'Topics',
//                 key: 'topic_id'
//             },
//             onDelete: 'CASCADE',
//             onUpdate: 'CASCADE'
//         },
//         question_description: {
//             type: DataTypes.TEXT,
//             allowNull: false
//         },
//         no_of_marks_allocated: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             defaultValue: 1
//         },
//         difficulty_level: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             defaultValue: 1
//         },
//         option_1: {
//             type: DataTypes.TEXT,
//             allowNull: true
//         },
//         option_2: {
//             type: DataTypes.TEXT,
//             allowNull: true
//         },
//         option_3: {
//             type: DataTypes.TEXT,
//             allowNull: true
//         },
//         option_4: {
//             type: DataTypes.TEXT,
//             allowNull: true
//         },
//         correct_option: {
//             type: DataTypes.TEXT,
//             allowNull: false 
//         }
//     }, {
//         timestamps: true // Enabling timestamps for tracking purposes
//     });

//     CumulativeQuestion.associate = (models) => {
//         CumulativeQuestion.belongsTo(models.Topic, {
//             foreignKey: 'topic_id',
//             as: 'topic'
//         });
//     };

//     return CumulativeQuestion;  
// };


// module.exports = (sequelize, DataTypes) => {
//     const CumulativeQuestion = sequelize.define('CumulativeQuestion', {
//         cumulative_question_id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true
//         },
//         topic_id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: 'Topics',
//                 key: 'topic_id'
//             },
//             onDelete: 'CASCADE',
//             onUpdate: 'CASCADE'
//         },
//         question_description: {
//             type: DataTypes.TEXT,
//             allowNull: false
//         },
//         no_of_marks_allocated: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             defaultValue: 1
//         },
//         difficulty_level: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             defaultValue: 1
//         }
//     }, {
//         timestamps: true // Enabling timestamps for tracking purposes
//     });

//     CumulativeQuestion.associate = (models) => {
//         CumulativeQuestion.belongsTo(models.Topic, {
//             foreignKey: 'topic_id',
//             as: 'topic'
//         });
//         CumulativeQuestion.hasMany(models.Option, {
//             foreignKey: 'cumulative_question_id',
//             as: 'options'
//         });
//         CumulativeQuestion.hasMany(models.CorrectAnswer, {
//             foreignKey: 'cumulative_question_id',
//             as: 'correct_answers'
//         });
//     };

//     return CumulativeQuestion;  
// };


module.exports = (sequelize, DataTypes) => {
    const CumulativeQuestion = sequelize.define('CumulativeQuestion', {
        cumulative_question_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        topic_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Topics',
                key: 'topic_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        question_description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        no_of_marks_allocated: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        difficulty_level: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        }
    }, {
        timestamps: true
    });

    CumulativeQuestion.associate = (models) => {
        CumulativeQuestion.belongsTo(models.Topic, {
            foreignKey: 'topic_id',
            as: 'CumulativeQuestionTopic'
        });
        CumulativeQuestion.belongsToMany(models.PlacementTest, {
            through: 'CQPlacementTest', // Consistent table name
            foreignKey: 'cumulative_question_id',
            as: 'PlacementTests'
        });
    };

    return CumulativeQuestion;
};


