module.exports = (sequelize, DataTypes) => {
    const BatchTestLinks = sequelize.define('BatchTestLinks', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      internal_test_id: {
        type: DataTypes.INTEGER,
        allownull : true,
      
      },
      batch_id: {
        type: DataTypes.INTEGER,
        allownull :true,
      },
      wt_id: {
        type: DataTypes.INTEGER,
        allownull : true,
       
      },

    });

    
 
  
    return BatchTestLinks;
  };
  