// module.exports = (sequelize, DataTypes) => {
//     const PlacementTest = sequelize.define('PlacementTest', {
//         placement_test_id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true
//         },
//         test_link: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         number_of_questions: {
//             type: DataTypes.INTEGER,
//             allowNull: false
//         },
//         description: {
//             type: DataTypes.TEXT,
//             allowNull: true
//         },
//         start_time: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         end_time: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         show_result: {
//             type: DataTypes.BOOLEAN,
//             allowNull: false,
//             defaultValue: true
//         },
//         is_Active: {
//             type: DataTypes.BOOLEAN,
//             defaultValue: false
//         },
//         // ALTER TABLE laradb.placementtests
//         // ADD COLUMN is_Monitored BOOLEAN DEFAULT false;
//         is_Monitored: {
//             type: DataTypes.BOOLEAN,
//             defaultValue: false
//         }

//     }, {
//         timestamps: true,
//         tableName: 'Placementtests'
//     });

//     PlacementTest.associate = (models) => {
//         PlacementTest.belongsToMany(models.CumulativeQuestion, {
//             through: 'CQPlacementTest',
//             foreignKey: 'placement_test_id',
//             as: 'CumulativeQuestions'
//         });
//     };

//     return PlacementTest;
// };


module.exports = (sequelize, DataTypes) => {
    const PlacementTest = sequelize.define('PlacementTest', {
        placement_test_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        test_link: {
            type: DataTypes.STRING,
            allowNull: false
        },
        number_of_questions: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        start_time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        end_time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        show_result: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        is_Active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_Monitored: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        issue_certificate: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        whatsAppChannelLink: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'whatsAppChannelLink'
        },
        test_title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        certificate_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isDescriptiveTest: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        college_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Colleges',
                key: 'college_id'
            }
        },
    }, {
        timestamps: true,
        tableName: 'Placementtests'
    });

    PlacementTest.associate = (models) => {
        PlacementTest.belongsTo(models.College, {
            foreignKey: 'college_id',
            as: 'College'
        });
        PlacementTest.belongsToMany(models.Branch, {
            through: 'PlacementTestBranch',
            foreignKey: 'placement_test_id',
            otherKey: 'branch_id',
            as: 'Branches'
        });
        PlacementTest.belongsToMany(models.CumulativeQuestion, {
            through: 'CQPlacementTest',
            foreignKey: 'placement_test_id',
            as: 'CumulativeQuestions'
        });
        PlacementTest.hasMany(models.PlacementTestWeeklyQuestionMapping, {
            foreignKey: 'placement_test_id',
            as: 'WeeklyTestQuestions'
        });
    };


    return PlacementTest;
};


// alter table laradb.placementtests
// add column whatsAppChannelLink varchar(255) null;
// add column test_title varchar(255) null
// add column certificate_name varchar(255) null;


// SET SQL_SAFE_UPDATES = 0;

// UPDATE laradb.Placementtests
// SET
//     whatsAppChannelLink = 'https://whatsapp.com/channel/0029Var9Wub30LKJP7fK7y06',
//     test_title = 'Test';

// SET SQL_SAFE_UPDATES = 1;  -- Restore safe update mode after running the update




// ALTER table laradb.placementtests
// add column issue_certificate BOOLEAN DEFAULT TRUE;

// ALTER table laradb.placementtests
// add column isDescriptiveTest BOOLEAN DEFAULT false;


// ALTER TABLE laradb.placementtests
// ADD COLUMN college_id INT NOT NULL;