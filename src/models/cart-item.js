'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class CartItem extends Model {
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
	CartItem.init(
		{
			itemID: {
				allowNull: false,
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			productID: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			cartID: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			quantity: {
				allowNull: false,
				type: DataTypes.INTEGER
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			sequelize,
			modelName: 'CartItem',
			tableName: 'cart_item'
		}
	);
	return CartItem;
};
