const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        employeeId: { 
            type: DataTypes.STRING, 
            allowNull: false,
            unique: true
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'accounts',
                key: 'id'
            }
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'departments',
                key: 'id'
            }
        },
        position: { type: DataTypes.STRING, allowNull: true },
        created: { 
            type: DataTypes.DATE, 
            allowNull: false, 
            defaultValue: DataTypes.NOW 
        },
        updated: { type: DataTypes.DATE }
    };

    const options = {
        timestamps: false
    };

    return sequelize.define('employee', attributes, options);
}