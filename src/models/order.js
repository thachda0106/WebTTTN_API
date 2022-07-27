'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Order extends Model {
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
	Order.init(
		{
			orderID: {
				allowNull: false,
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			customerID: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			employeeID: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			voucherID: {
				allowNull: true,
				type: DataTypes.INTEGER
			},
			orderStatus: {
				allowNull: false,
				defaultValue: 'PENDING',
				type: DataTypes.STRING(10)
			},
			dateCreate: {
				allowNull: false,
				defaultValue: DataTypes.NOW,
				type: DataTypes.DATE
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			sequelize,
			modelName: 'Order'
		}
	);
	return Order;
};
