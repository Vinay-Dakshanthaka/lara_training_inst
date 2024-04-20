module.exports = (sequelize, DataTypes) => {

    // controller logic is inside assignmentController.js file
    
    const Questions = sequelize.define('Questions', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        batch_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        trainer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        question: {
            type: DataTypes.TEXT, 
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT, 
            allowNull: true
        },
        // newly added column directly in the database
        // --------------------------------------------------
        // executed this query in sql to add the column "question_image"
        // ALTER TABLE laradb.questions ADD COLUMN question_image VARCHAR(255);
        question_image: {
            type: DataTypes.STRING, 
            allowNull: true, 
        },
        // executed this query in sql to add the column "solution"
        // ALTER TABLE laradb.questions ADD COLUMN solution TEXT;
        solution: {
            type: DataTypes.TEXT, 
            allowNull: true, 
        },
    }, {
        timestamps: false
    });

    return Questions;
};
