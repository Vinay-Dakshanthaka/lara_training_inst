module.exports = (sequelize, DataTypes) => {
    const Branch = sequelize.define('Branch', {
        branch_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        branch_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'Branches'
    });

    Branch.associate = (models) => {
        Branch.belongsToMany(models.College, {
            through: 'CollegeBranch',
            foreignKey: 'branch_id',
            as: 'Colleges'
        });
        Branch.hasMany(models.PlacementTest, {
            foreignKey: 'branch_id',
            as: 'PlacementTests'
        });
    };

    return Branch;
};
