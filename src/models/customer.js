'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Customer extends Model {
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
	Customer.init(
		{
			customerID: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			fullName: {
				allowNull: false,
				type: DataTypes.STRING
			},
			username: {
				allowNull: false,
				type: DataTypes.STRING
			},
			email: {
				type: DataTypes.STRING(100),
				allowNull: false,
				unique: true
			},
			avatar: {
				type: DataTypes.STRING,
				allowNull: true
			},
			phoneNumber: {
				type: DataTypes.STRING(10),
				allowNull: true
			},
			shippingAddress: {
				type: DataTypes.STRING,
				allowNull: true
			},
			gender: {
				type: DataTypes.BOOLEAN,
				allowNull: true
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			sequelize,
			modelName: 'Customer'
		}
	);
	return Customer;
};
