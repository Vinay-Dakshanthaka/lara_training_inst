// const dbConfig = require('../config/dbConfig.js');
// const { Sequelize, DataTypes } = require('sequelize');

// const sequelize = new Sequelize(
//     dbConfig.DB,
//     dbConfig.USER,
//     dbConfig.PASSWORD, {
//     host: dbConfig.HOST,
//     dialect: dbConfig.dialect,
//     operatorsAliases: false,

//     pool: {
//         max: dbConfig.pool.max,
//         min: dbConfig.pool.min,
//         acquire: dbConfig.pool.acquire,
//         idle: dbConfig.pool.idle
//     }
// }
// );

// sequelize.authenticate()
//     .then(() => {
//         console.log('Connected to the database.');
//     })
//     .catch(err => {
//         console.error('Error connecting to the database:', err);
//     });

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// // Define models
// db.Student = require('./studentModel.js')(sequelize, DataTypes);
// db.Profile = require('./profileModel.js')(sequelize, DataTypes);
// db.Batch = require('./batchModel.js')(sequelize, DataTypes); // Import Batch model
// db.Student_Batch = require('./studentBatchModel.js')(sequelize, DataTypes); // Import Student_Batch model
// db.BatchTrainer = require('./batchTrainerModel.js')(sequelize, DataTypes);
// db.Review = require('./studentReviewModel.js')(sequelize, DataTypes);
// db.Questions = require('./questionsModel.js')(sequelize, DataTypes);
// db.TestCase = require('./testCaseModel.js')(sequelize, DataTypes); 
// db.StudentSubmission = require('./studentSubmissionModel.js')(sequelize, DataTypes); 
// db.CollegeDetails = require('./CollegeDetailsModel.js')(sequelize, DataTypes); 
// db.Attendance = require('./attendanceModel.js')(sequelize, DataTypes); 
// db.HomeContent = require('./homeContentModel.js')(sequelize, DataTypes); 
// db.BestPerformer = require('./performerOfTheDayModel.js')(sequelize, DataTypes);

// // cumulative test models 
// db.CumulativeQuestion = require('./cumulativeQuestionModel.js')(sequelize, DataTypes);
// db.Topic = require('./topicModel.js')(sequelize,DataTypes);
// db.Subject = require('./subjectModel.js')(sequelize, DataTypes);  

// // Define associations 
// db.Student.hasOne(db.Profile, {
//     foreignKey: 'student_id',
//     as: 'profile',
//     onDelete: 'CASCADE'
// });

// db.Profile.belongsTo(db.Student, {
//     foreignKey: 'student_id',
//     onDelete: 'CASCADE'
// });


// // db.Student.belongsToMany(db.Batch, { through: db.Student_Batch }); // Define many-to-many association
// // db.Batch.belongsToMany(db.Student, { through: db.Student_Batch }); // Define many-to-many association

// // db.Student.belongsToMany(db.Batch, {
// //     through: db.Student_Batch,
// //     foreignKey: 'student_id',
// //     otherKey: 'batch_id'
// // });
// // db.Batch.belongsToMany(db.Student, {
// //     through: 'Student_Batch',
// //     foreignKey: 'student_id',
// //     otherKey: 'batch_id'
// // });


// // Define the association between Student and Batch
// db.Student.belongsToMany(db.Batch, { through: 'Student_Batch', foreignKey: 'student_id' });
// db.Batch.belongsToMany(db.Student, { through: 'Student_Batch', foreignKey: 'batch_id' });

// // Define associations for Student (Trainer) to Batch
// db.Student.belongsToMany(db.Batch, {
//     through: {
//         model: 'BatchTrainer',
//         unique: false // Allow duplicate pairs (batch_id, trainer_id)
//     },
//     foreignKey: 'trainer_id', // Foreign key in the association table pointing to trainer_id
//     otherKey: 'batch_id', // Foreign key in the association table pointing to batch_id
//     // scope: {
//     //     role: 'TRAINER' // Filter trainers based on role
//     // }
// });

// // Define associations for Batch to Student (Trainer)
// db.Batch.belongsToMany(db.Student, {
//     through: {
//         model: 'BatchTrainer',
//         unique: false // Allow duplicate pairs (batch_id, trainer_id)
//     },
//     foreignKey: 'batch_id', // Foreign key in the association table pointing to batch_id
//     otherKey: 'trainer_id', // Foreign key in the association table pointing to trainer_id
//     // scope: {
//     //     role: 'TRAINER' // Filter trainers based on role
//     // }
// });

// Object.keys(db).forEach(modelName => {
//     if (db[modelName].associate) {
//         db[modelName].associate(db);
//     }
// });

// // Sync models with the database
// db.sequelize.sync({ force: false })
//     .then(() => {
//         console.log('Database synchronized.');
//     })
//     .catch(err => {
//         console.error('Error synchronizing database:', err);
//     });

// module.exports = db;



const dbConfig = require('../config/dbConfig.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
}
);

sequelize.authenticate()
    .then(() => {
        console.log('Connected to the database.');
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Define models
db.Student = require('./studentModel.js')(sequelize, DataTypes);
db.Profile = require('./profileModel.js')(sequelize, DataTypes);
db.Batch = require('./batchModel.js')(sequelize, DataTypes); // Import Batch model
db.Student_Batch = require('./studentBatchModel.js')(sequelize, DataTypes); // Import Student_Batch model
db.BatchTrainer = require('./batchTrainerModel.js')(sequelize, DataTypes);
db.Review = require('./studentReviewModel.js')(sequelize, DataTypes);
db.Questions = require('./questionsModel.js')(sequelize, DataTypes);
db.TestCase = require('./testCaseModel.js')(sequelize, DataTypes); 
db.StudentSubmission = require('./studentSubmissionModel.js')(sequelize, DataTypes); 
db.CollegeDetails = require('./CollegeDetailsModel.js')(sequelize, DataTypes); 
db.Attendance = require('./attendanceModel.js')(sequelize, DataTypes); 
db.HomeContent = require('./homeContentModel.js')(sequelize, DataTypes); 
db.BestPerformer = require('./performerOfTheDayModel.js')(sequelize, DataTypes);
db.TestResults = require('./testResultModel.js')(sequelize, DataTypes)
db.PlacementTest = require('./placementTestModel.js')(sequelize, DataTypes)
db.PlacementTestTopic = require('./placementTestTopicModel.js')(sequelize, DataTypes)
db.PlacementTestResult = require('./placementTestResultModel.js')(sequelize, DataTypes)
db.PlacementTestStudent = require('./placementTestStudentsModel.js')(sequelize, DataTypes)
// cumulative test models 
db.CumulativeQuestion = require('./cumulativeQuestionModel.js')(sequelize, DataTypes);
db.Topic = require('./topicModel.js')(sequelize,DataTypes);
db.Subject = require('./subjectModel.js')(sequelize, DataTypes);  
db.Option = require('./optionModel.js')(sequelize, DataTypes);  
db.CorrectAnswer = require('./correctAnswerModel.js')(sequelize, DataTypes);  
db.CumulativeQuestionPlacementTest = require('./CQPlacementTestModel.js')(sequelize, DataTypes);  
db.CumulativeQuestionInternalTest = require('./CQIntrenalTestModel.js')(sequelize, DataTypes);  
db.InternalTest = require('./internalTestModel.js')(sequelize, DataTypes);  
db.InternalTestResult = require('./internalTestResultModel.js')(sequelize, DataTypes);  
db.InternalTestTopic = require('./internalTestTopicModel.js')(sequelize, DataTypes);  
db.WeeklyTest = require('./weeklyTestModel.js')(sequelize, DataTypes);  
db.WeeklyTestQuestion = require('./weeklyTestQuestionsModel.js')(sequelize, DataTypes);  
db.WeeklyTestQuestionAnswer = require('./weeklyTestQuestionAnswer.js')(sequelize, DataTypes);  
db.WeeklyTestTopics = require('./weeklyTestTopicModel.js')(sequelize, DataTypes);  
db.WeeklyTestQuestionAssignment = require('./weeklyTestQuestionAssignment.js')(sequelize, DataTypes);  
db.WeeklyTestQuestionMapping = require('./weeklyTestQuestionMapping.js')(sequelize, DataTypes);  
db.StudentAnswer = require('./weeklyTestStudentAnswers.js')(sequelize, DataTypes);  
db.WeeklyTestFinalSubmission = require('./weeklyTestFinalSubmissionModel.js')(sequelize, DataTypes);  
db.WhatsAppChannelLinks = require('./whatsAppChannelLinksModel.js')(sequelize, DataTypes);  
db.PlacementTestCreator = require('./placementTestCreator.js')(sequelize, DataTypes);
db.StudentWhatsAppLinks = require('./StudentWhatsAppLinks.js')(sequelize, DataTypes);
db.Transaction = require('./transactionModel.js')(sequelize,DataTypes);


// Define associations  
db.Student.hasOne(db.Profile, {
    foreignKey: 'student_id',
    as: 'profile',
    onDelete: 'CASCADE'  
});

db.Profile.belongsTo(db.Student, {
    foreignKey: 'student_id',
    onDelete: 'CASCADE'
});



// db.Student.belongsToMany(db.Batch, {
//     through: db.Student_Batch,
//     foreignKey: 'student_id',
//     otherKey: 'batch_id'
// });
// db.Batch.belongsToMany(db.Student, {
//     through: 'Student_Batch',
//     foreignKey: 'student_id',
//     otherKey: 'batch_id'
// });


// Define the association between Student and Batch
db.Student.belongsToMany(db.Batch, { through: 'Student_Batch', foreignKey: 'student_id' });
db.Batch.belongsToMany(db.Student, { through: 'Student_Batch', foreignKey: 'batch_id' });


// Define associations for Student (Trainer) to Batch
db.Student.belongsToMany(db.Batch, {
    through: {
        model: 'BatchTrainer',
        unique: false // Allow duplicate pairs (batch_id, trainer_id)
    },
    foreignKey: 'trainer_id', // Foreign key in the association table pointing to trainer_id
    otherKey: 'batch_id', // Foreign key in the association table pointing to batch_id
    // scope: {
    //     role: 'TRAINER' // Filter trainers based on role
    // }
});

// Define associations for Batch to Student (Trainer)
db.Batch.belongsToMany(db.Student, {
    through: {
        model: 'BatchTrainer',
        unique: false // Allow duplicate pairs (batch_id, trainer_id)
    },
    foreignKey: 'batch_id', // Foreign key in the association table pointing to batch_id
    otherKey: 'trainer_id', // Foreign key in the association table pointing to trainer_id
    // scope: {
    //     role: 'TRAINER' // Filter trainers based on role
    // }
});

// db.CumulativeQuestion.belongsTo(db.Topic, {
//     foreignKey: 'topic_id',
//     as: 'Topics'
// });
// db.CumulativeQuestion.hasMany(db.Option, {
//     foreignKey: 'cumulative_question_id',
//     as: 'options'
// });
// db.CumulativeQuestion.hasMany(db.CorrectAnswer, {
//     foreignKey: 'cumulative_question_id',
//     as: 'correct_answers'
// });

// // Associations
// db.PlacementTest.hasMany(db.PlacementTestTopic, {
//     foreignKey: 'placement_test_id',
//     // as: 'topics'
//     as: 'Topics'
// });

// db.PlacementTestTopic.belongsTo(db.PlacementTest, {
//     foreignKey: 'placement_test_id',
//     onDelete: 'CASCADE'
// });

// db.Topic.hasMany(db.PlacementTestTopic, {
//     foreignKey: 'topic_id',
// });

// db.PlacementTestTopic.belongsTo(db.Topic, {
//     foreignKey: 'topic_id',
//     onDelete: 'CASCADE'
// });

// db.PlacementTest.hasMany(db.PlacementTestResult, {
//     foreignKey: 'placement_test_id',
//     as: 'results'
// });

// db.PlacementTestResult.belongsTo(db.PlacementTest, {
//     foreignKey: 'placement_test_id',
//     onDelete: 'CASCADE'
// });

// // Define associations for PlacementTestStudent
// db.PlacementTestStudent.hasMany(db.PlacementTestResult, {
//     foreignKey: 'placement_test_student_id',
//     as: 'results'
// });

// db.PlacementTestResult.belongsTo(db.PlacementTestStudent, {
//     foreignKey: 'placement_test_student_id',
//     onDelete: 'CASCADE'
// });

// Object.keys(db).forEach(modelName => {
//     if (db[modelName].associate) {
//         db[modelName].associate(db);
//     }
// });


// Corrected Associations
db.CumulativeQuestion.belongsTo(db.Topic, {
    foreignKey: 'topic_id',
    as: 'QuestionTopic' // Unique alias for the association
});
db.CumulativeQuestion.belongsTo(db.PlacementTest, {
    foreignKey: 'test_id',
    as: 'QuestionForPlacementTest'
});
db.CumulativeQuestion.hasMany(db.Option, {
    foreignKey: 'cumulative_question_id',
    as: 'QuestionOptions' // Unique alias for the association
});
db.CumulativeQuestion.hasMany(db.CorrectAnswer, {
    foreignKey: 'cumulative_question_id',
    as: 'CorrectAnswers' // Unique alias for the association
});

db.CumulativeQuestion.belongsToMany(db.PlacementTest, {
    through: 'CQPlacementTest', // Use the consistent table name
    foreignKey: 'cumulative_question_id',
    as: 'PlacementTestsCumulativeQuestions'
});

db.PlacementTest.belongsToMany(db.CumulativeQuestion, {
    through: 'CQPlacementTest', // Use the consistent table name
    foreignKey: 'placement_test_id',
    as: 'CumulativeQuestionsPlacementTest'
});


// Associations for PlacementTest
db.PlacementTest.hasMany(db.PlacementTestTopic, {
    foreignKey: 'placement_test_id',
    as: 'TestTopics' // Unique alias for the association
});

db.PlacementTestTopic.belongsTo(db.PlacementTest, {
    foreignKey: 'placement_test_id',
    onDelete: 'CASCADE'
});

db.Topic.hasMany(db.PlacementTestTopic, {
    foreignKey: 'topic_id',
    as: 'TopicPlacementTests' // Unique alias for the association
});

db.PlacementTestTopic.belongsTo(db.Topic, {
    foreignKey: 'topic_id',
    onDelete: 'CASCADE',
    as: 'PlacementTestTopic' // Unique alias for the association
});

db.PlacementTest.hasMany(db.PlacementTestResult, {
    foreignKey: 'placement_test_id',
    as: 'TestResults' // Unique alias for the association
});

db.PlacementTestResult.belongsTo(db.PlacementTest, {
    foreignKey: 'placement_test_id',
    onDelete: 'CASCADE',
    as: 'PlacementTest' // Unique alias for the association
});

// Define associations for PlacementTestStudent
db.PlacementTestStudent.hasMany(db.PlacementTestResult, {
    foreignKey: 'placement_test_student_id',
    as: 'StudentResults' // Unique alias for the association
});

db.PlacementTestResult.belongsTo(db.PlacementTestStudent, {
    foreignKey: 'placement_test_student_id',
    onDelete: 'CASCADE',
    as: 'TestResultStudent' // Unique alias for the association
});


// Associations for InternalTest
db.InternalTest.hasMany(db.InternalTestTopic, {
    foreignKey: 'internal_test_id',
    as: 'TestTopics' // Unique alias for the association
});

db.InternalTestTopic.belongsTo(db.InternalTest, {
    foreignKey: 'internal_test_id',
    onDelete: 'CASCADE',
    as: 'InternalTest' // Unique alias for the association
});

db.Topic.hasMany(db.InternalTestTopic, {
    foreignKey: 'topic_id',
    as: 'TopicInternalTests' // Unique alias for the association
});

db.InternalTestTopic.belongsTo(db.Topic, {
    foreignKey: 'topic_id',
    onDelete: 'CASCADE',
    as: 'InternalTestTopic' // Unique alias for the association
});

db.InternalTest.hasMany(db.InternalTestResult, {
    foreignKey: 'internal_test_id',
    as: 'TestResults' // Unique alias for the association
});

db.InternalTestResult.belongsTo(db.InternalTest, {
    foreignKey: 'internal_test_id',
    onDelete: 'CASCADE',
    as: 'InternalTest' // Unique alias for the association
});

// Associations for InternalTestResult and Student
db.Student.hasMany(db.InternalTestResult, {
    foreignKey: 'student_id',
    as: 'StudentResults' // Unique alias for the association
});

db.InternalTestResult.belongsTo(db.Student, {
    foreignKey: 'student_id',
    onDelete: 'CASCADE',
    as: 'TestResultStudent' // Unique alias for the association
});

// Associations for CumulativeQuestion and InternalTest
db.CumulativeQuestion.belongsToMany(db.InternalTest, {
    through: 'CQInternalTest', // Use the consistent table name
    foreignKey: 'cumulative_question_id',
    as: 'InternalTestsCumulativeQuestions'
});

db.InternalTest.belongsToMany(db.CumulativeQuestion, {
    through: 'CQInternalTest', // Use the consistent table name
    foreignKey: 'internal_test_id',
    as: 'CumulativeQuestionsInternalTest'
});

// // For WeeklyTest to WeeklyTestQuestion association
// db.WeeklyTest.hasMany(db.WeeklyTestQuestion, {
//     foreignKey: 'wt_id',
//     as: 'WeeklyTestQuestions'  // Unique alias for this association
// });

// For WeeklyTestQuestion to WeeklyTestQuestionAnswer association
db.WeeklyTestQuestion.hasMany(db.WeeklyTestQuestionAnswer, {
    foreignKey: 'wt_question_id',
    as: 'TestQuestionAnswerDetails'  // Unique alias for this association
});

// For WeeklyTestTopics to WeeklyTest association
db.WeeklyTestTopics.belongsTo(db.WeeklyTest, {
    foreignKey: 'wt_id',
    onDelete: 'CASCADE',
    as: 'WeeklyTestAssociated'  // Unique alias for WeeklyTestTopics
});

// For WeeklyTestTopics to Topic association
db.WeeklyTestTopics.belongsTo(db.Topic, {
    foreignKey: 'topic_id',
    onDelete: 'CASCADE',
    as: 'TopicDetails'  // Alias for TopicDetails
});

db.StudentAnswer.belongsTo(db.WeeklyTest, {
    foreignKey: 'wt_id',
    as: 'Test'
});

db.StudentAnswer.belongsTo(db.WeeklyTestQuestion, {
    foreignKey: 'wt_question_id',
    as: 'Question'
});

db.StudentAnswer.belongsTo(db.Student, {
    foreignKey: 'student_id',
    as: 'Student'
});

// Add the association to PlacementTestCreator
db.PlacementTest.hasMany(db.PlacementTestCreator, {
    foreignKey: 'placement_test_id',
    as: 'Creators'
});

db.Student.hasMany(db.PlacementTestCreator, {
    foreignKey: 'student_id',
    as: 'CreatedTests'
});

db.WhatsAppChannelLinks.belongsToMany(db.Student, {
    through: db.StudentWhatsAppLinks,
    foreignKey: 'channel_id',
    otherKey: 'student_id',
});

db.Student.belongsToMany(db.WhatsAppChannelLinks, {
    through: db.StudentWhatsAppLinks,
    foreignKey: 'student_id',
    otherKey: 'channel_id',
});


    // db.Transaction.belongsTo(db.Student, {
    //   foreignKey: 'student_id', // The foreign key in the Transaction table
    //   targetKey: 'id' // The key it relates to in the Student table
    // });

    
  


// Call associate method for each model if defined
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


// Sync models with the database
db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synchronized.');
    })
    .catch(err => {
        console.error('Error synchronizing database:', err);
    });

module.exports = db;
