const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Employee = sequelize.define('Employee', {
        employeeId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        position: {
            type: DataTypes.STRING,
            allowNull: true
        },
        hireDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    });

    return Employee;
};
