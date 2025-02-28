// module.exports = (sequelize, DataTypes) => {
//     const WeeklyTestFinalSubmission = sequelize.define('WeeklyTestFinalSubmission', {
//         id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true
//         },
//         wt_id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: 'WeeklyTests',
//                 key: 'wt_id'
//             }
//         },
//         student_id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: 'Students',
//                 key: 'id'
//             }
//         },
//         final_submission: {
//             type: DataTypes.BOOLEAN,
//             allowNull: false,
//             defaultValue: false // Default to false, meaning not yet finalized
//         }
//     });
//     return WeeklyTestFinalSubmission;
// };



module.exports = (sequelize, DataTypes) => {
    const WeeklyTestFinalSubmission = sequelize.define('WeeklyTestFinalSubmission', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        wt_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'WeeklyTests',
                key: 'wt_id'
            }
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Students',
                key: 'id'
            }
        },
        final_submission: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false // Default to false, meaning not yet finalized
        },
        latitude: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: true, // Can be null if location is not shared
            comment: "Latitude of student's test location"
        },
        longitude: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: true, // Can be null if location is not shared
            comment: "Longitude of student's test location"
        },
        attended_in_institute: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false, // Default to false, assumes attended outside unless verified
            comment: "True if student attended from institute"
        }
    });

    return WeeklyTestFinalSubmission;
};


// ALTER TABLE laradb.weeklytestfinalsubmissions 
// ADD COLUMN latitude DECIMAL(9,6) NULL,
// ADD COLUMN longitude DECIMAL(9,6) NULL,
// ADD COLUMN attended_in_institute BOOLEAN NOT NULL DEFAULT FALSE;
