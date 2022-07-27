'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Reply extends Model {
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
	Reply.init(
		{
			replyID: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			commentID: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			username: {
				allowNull: false,
				type: DataTypes.STRING
			},
			content: {
				type: DataTypes.STRING,
				allowNull: false
			},
			createdAt: {
				allowNull: false,
				defaultValue: DataTypes.NOW,
				type: DataTypes.DATE
			},
			updateAt: {
				allowNull: false,
				defaultValue: DataTypes.NOW,
				type: DataTypes.DATE
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			sequelize,
			modelName: 'Reply'
		}
	);
	return Reply;
};
