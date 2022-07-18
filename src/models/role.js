'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Role extends Model {
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
	Role.init(
		{
			roleID: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			type: {
				allowNull: false,
				unique: true,
				type: DataTypes.STRING
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			sequelize,
			modelName: 'Role'
		}
	);
	return Role;
};
