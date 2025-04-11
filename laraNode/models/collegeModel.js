module.exports = (sequelize, DataTypes) => {
    const College = sequelize.define('College', {
        college_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        college_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'Colleges'
    });

    College.associate = (models) => {
        College.belongsToMany(models.Branch, {
            through: 'CollegeBranch',
            foreignKey: 'college_id',
            as: 'Branches'
        });
        College.hasMany(models.PlacementTest, {
            foreignKey: 'college_id',
            as: 'PlacementTests'
        });
    };

    return College;
};
