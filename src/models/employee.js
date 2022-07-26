'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Employee extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate(models) {
			// define association here
			// models.Categories.hasMany(Attribute, { foreignKey: 'attributeID' });
			// Attribute.belongsToMany(models.Product, { through: models.ProductAttribute, foreignKey: 'attributeID' })
			// Attribute.belongsToMany(models.Product, { through: models.ProductAttribute, foreignKey: 'productID' })
		}
	}
	Employee.init(
		{
			employeeID: {
				allowNull: false,
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			avatar: {
				allowNull: false,
				type: DataTypes.STRING
			},
			email: {
				allowNull: false,
				unique: true,
				type: DataTypes.STRING
			},
			fullName: {
				allowNull: false,
				type: DataTypes.STRING
			},
			gender: {
				allowNull: false,
				type: DataTypes.BOOLEAN
			},
			phoneNumber: {
				allowNull: false,
				type: DataTypes.STRING(10)
			},
			identification: {
				allowNull: false,
				type: DataTypes.STRING
			},
			dateOfBirth: {
				allowNull: false,
				type: DataTypes.DATEONLY
			},
			username: {
				allowNull: false,
				type: DataTypes.STRING
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			sequelize,
			modelName: 'Employee'
		}
	);
	return Employee;
};
