module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        review_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        batchId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        trainerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        review: {
            type: DataTypes.STRING,
            allowNull: false
        },
        stars: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        //To know the speicif date of the batch
        reviewDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        //To know the specific time of the batch was taken 
        reviewTime: {
            type: DataTypes.TIME,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return Review;
};