'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Product extends Model {
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
	Product.init(
		{
			productID: {
				allowNull: false,
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			categoryID: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			name: {
				allowNull: false,
				type: DataTypes.STRING
			},
			price: {
				allowNull: false,
				type: DataTypes.FLOAT
			},
			thumbnail: {
				allowNull: false,
				type: DataTypes.STRING
			},
			quantity: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			description: {
				allowNull: false,
				type: DataTypes.TEXT
			},
			brand: {
				allowNull: false,
				type: DataTypes.STRING
			},
			origin: {
				allowNull: false,
				type: DataTypes.STRING
			},
			guarantee: {
				allowNull: false,
				type: DataTypes.INTEGER(2)
			},

			discountPercent: {
				allowNull: true,
				type: DataTypes.FLOAT(2, 1)
			},
			dateDiscountStart: {
				allowNull: true,
				type: DataTypes.DATE
			},
			dateDiscountEnd: {
				allowNull: true,
				type: DataTypes.DATE
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			sequelize,
			modelName: 'Product'
		}
	);
	return Product;
};
