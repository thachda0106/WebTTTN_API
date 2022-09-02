'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class ProductRating extends Model {
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
	ProductRating.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			orderID: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			productID: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			customerID: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			starNumber: {
				type: DataTypes.INTEGER(1),
				allowNull: false
			},
			content: {
				type: DataTypes.STRING,
				allowNull: false
			},
			createdAt: {
				allowNull: false,
				defaultValue: DataTypes.NOW,
				type: DataTypes.DATE
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			sequelize,
			modelName: 'ProductRating',
			tableName: 'product_rating'
		}
	);
	return ProductRating;
};
