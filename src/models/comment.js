'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Comment extends Model {
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
	Comment.init(
		{
			commentID: {
				allowNull: false,
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			userID: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			productID: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			createdAt: {
				allowNull: false,
				defaultValue: DataTypes.NOW,
				type: DataTypes.DATE
			},
			updatedAt: {
				allowNull: false,
				defaultValue: DataTypes.NOW,
				type: DataTypes.DATE
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			sequelize,
			modelName: 'Comment'
		}
	);
	return Comment;
};
