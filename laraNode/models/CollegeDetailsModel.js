module.exports = (sequelize, DataTypes) => {
    const CollegeDetails = sequelize.define('CollegeDetails', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        college_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        place: {
            type: DataTypes.STRING,
            allowNull: false
        },
        placement_officer_id: {
            type:DataTypes.STRING,
            allowNull:true
        }
    },{
        timestamps: false 
    }
    );
    return CollegeDetails;
}