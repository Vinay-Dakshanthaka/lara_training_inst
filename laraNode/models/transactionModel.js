module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define("Transaction", {
      sno: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Students', // This links the 'student_id' column to the 'Students' table
          key: 'id' // This specifies that the foreign key refers to the 'id' column of the 'Students' table
        }
      },
      transaction_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      transactionslip_img: {
        type: DataTypes.STRING, // You can store the image path or URL here
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false // Disable automatic createdAt and updatedAt columns
    });
  
    // Define relationship with Student (belongsTo)
    Transaction.associate = (models) => {
      Transaction.belongsTo(models.Student, {
        foreignKey: 'student_id', // The foreign key in the Transaction table
        targetKey: 'id',           // The primary key in the Student table
        onDelete: 'CASCADE'        // Optional: ensures that deleting a student will delete their associated transactions
      });
    };
  
    return Transaction;
  };
  