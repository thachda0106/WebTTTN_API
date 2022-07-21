'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class ProductImage extends Model {
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
	ProductImage.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			productID: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			imageURL: {
				allowNull: false,
				type: DataTypes.STRING
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			sequelize,
			modelName: 'ProductImage',
			tableName: 'product_image'
		}
	);
	return ProductImage;
};
