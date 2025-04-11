module.exports = (sequelize, DataTypes) => {
    const PlacementTestBranch = sequelize.define('PlacementTestBranch', {
        placement_test_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Placementtests',
                key: 'placement_test_id'
            }
        },
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Branches',
                key: 'branch_id'
            }
        }
    }, {
        timestamps: false,
        tableName: 'PlacementTestBranch',
        // indexes: [
        //     {
        //         unique: true,
        //         fields: ['placement_test_id', 'branch_id']
        //     }
        // ]
    });

    return PlacementTestBranch;
};
