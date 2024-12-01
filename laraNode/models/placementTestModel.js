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
        whatsAppChannelLink: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'whatsAppChannelLink' // Explicitly map to the database column name
        },
        test_title: {
            type: DataTypes.STRING,
            allowNull: true 
        },
        certificate_name: {
            type: DataTypes.STRING,
            allowNull: true 
        }

    }, {
        timestamps: true,
        tableName: 'Placementtests'
    });

    PlacementTest.associate = (models) => {
        PlacementTest.belongsToMany(models.CumulativeQuestion, {
            through: 'CQPlacementTest',
            foreignKey: 'placement_test_id',
            as: 'CumulativeQuestions'
        });
    };

    return PlacementTest;
};


// alter table laradb.placementtests
// add column whatsAppChannelLink varchar(255) null;
// add column test_title varchar(255) null
// add column certificate_name varchar(255) null;