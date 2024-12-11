module.exports = (sequelize, DataTypes) => {
    const WhatsAppChannelLinks = sequelize.define('WhatsAppChannelLinks', {
        channel_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        channel_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'WhatsAppChannelLinks'
    });

    return WhatsAppChannelLinks;
};
