module.exports = (sequelize, DataTypes) => {
    //controller logic for this table is present in homeContentController.js file
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
        },
        //Execute this Query in mySQl
        //ALTER TABLE laradb.homecontents ADD COLUMN batch_id Integer not null; 
        batch_id : {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{
        timestamps: false 
    }
    );
    return HomeContent;
}