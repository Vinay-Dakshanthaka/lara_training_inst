module.exports = (sequelize, DataTypes) => {
    const HomeContent = sequelize.define('HomeContent', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        today_schedule: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tomorrow_schedule: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },{
        timestamps: false 
    }
    );
    return HomeContent;
}