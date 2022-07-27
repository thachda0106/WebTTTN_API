'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class OrderDetail extends Model {
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
	OrderDetail.init(
		{
			orderID: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			productID: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			quantity: {
				allowNull: false,
				type: DataTypes.INTEGER(2)
			},
			priceOrder: {
				allowNull: false,
				type: DataTypes.FLOAT
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			sequelize,
			modelName: 'OrderDetail',
			tableName: 'order_detail'
		}
	);
	return OrderDetail;
};
