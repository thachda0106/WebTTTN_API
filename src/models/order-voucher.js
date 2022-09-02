'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class OrderVoucher extends Model {
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
	OrderVoucher.init(
		{
			orderID: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false
			},
			voucherID: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			sequelize,
			modelName: 'OrderVoucher',
			tableName: 'order_voucher'
		}
	);
	return OrderVoucher;
};
