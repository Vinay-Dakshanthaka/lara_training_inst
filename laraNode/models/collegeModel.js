// models/College.js
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
        },
        university_id: {
            type: DataTypes.INTEGER,
            allowNull: true, 
            references: {
                model: 'Universities',
                key: 'university_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        }
    }, {
        timestamps: true,
        tableName: 'Colleges'
    });

    College.associate = (models) => {
        College.belongsTo(models.University, {
            foreignKey: 'university_id',
            as: 'University'
        });

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
