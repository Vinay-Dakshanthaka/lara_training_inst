module.exports = (sequelize, DataTypes) => {
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
        }
    },{
        timestamps: false 
    });

    return BestPerformer;
};
