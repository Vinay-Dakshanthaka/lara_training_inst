module.exports = (sequelize, DataTypes) => {
    const StudentAnswer = sequelize.define('StudentAnswer', {
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
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'WeeklyTestQuestions',
                key: 'wt_question_id'
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
    });
    return StudentAnswer;
}