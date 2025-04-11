module.exports = (sequelize, DataTypes) => {
    const CollegeBranch = sequelize.define('CollegeBranch', {
        college_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Colleges',
                key: 'college_id'
            }
        },
        branch_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Branches',
                key: 'branch_id'
            }
        },
        placement_test_id: { 
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Placementtests',
                key: 'placement_test_id'
            }
        }
    }, {
        timestamps: false,
        tableName: 'CollegeBranches'
    });

    CollegeBranch.associate = (models) => {
        CollegeBranch.belongsTo(models.College, { foreignKey: 'college_id' });
        CollegeBranch.belongsTo(models.Branch, { foreignKey: 'branch_id' });
    };


    return CollegeBranch;
};
