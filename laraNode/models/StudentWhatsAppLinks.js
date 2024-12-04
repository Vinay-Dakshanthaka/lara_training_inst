module.exports = (sequelize, DataTypes) => {
    const StudentWhatsAppLinks = sequelize.define(
        "StudentWhatsAppLinks",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            student_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Students', // Matches the name of the students table
                    key: 'id',
                },
            },
            channel_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'WhatsAppChannelLinks', // Matches the name of the WhatsAppChannelLinks table
                    key: 'channel_id',
                },
            },
        },
        {
            timestamps: true, // Add createdAt and updatedAt fields
            tableName: 'StudentWhatsAppLinks', // Explicit table name
        }
    );

    return StudentWhatsAppLinks;
};
