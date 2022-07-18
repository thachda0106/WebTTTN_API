'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Attribute extends Model {
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
	Attribute.init(
		{
			attributeID: {
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
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			sequelize,
			modelName: 'Attribute'
		}
	);
	return Attribute;
};
