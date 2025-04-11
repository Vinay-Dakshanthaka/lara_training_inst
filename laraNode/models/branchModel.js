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
            through: 'CollegeBranch', // This still handles college-branch mapping
            foreignKey: 'branch_id',
            as: 'Colleges'
        });
    
        // NEW: BRANCH <-> PLACEMENTTEST
        Branch.belongsToMany(models.PlacementTest, {
            through: 'PlacementTestBranch',
            foreignKey: 'branch_id',
            otherKey: 'placement_test_id',
            as: 'PlacementTests'
        });
    };    

    return Branch;
};
