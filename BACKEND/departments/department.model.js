const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Department = sequelize.define('Department', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    return Department;
};
