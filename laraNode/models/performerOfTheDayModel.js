module.exports = (sequelize, DataTypes) => {
    //controller logic for this table is present in homeContentController.js file
    const BestPerformer = sequelize.define('BestPerformer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Students', 
                key: 'id'
            }
        },
        question_no: {
            type: DataTypes.TEXT, 
            allowNull: true
        },
        name: {
            type: DataTypes.STRING, // Added name field
            allowNull: true
        }
        // executed this query directly in the database to add a new column question_no
        // ALTER TABLE laradb.bestperformers ADD COLUMN question_no VARCHAR(255);
            
    },{
        timestamps: false 
    });

    return BestPerformer;
};
