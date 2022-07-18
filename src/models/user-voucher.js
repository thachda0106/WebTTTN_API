'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class UserVoucher extends Model {
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
	UserVoucher.init(
		{
			userID: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			voucherID: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			isUsed: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			sequelize,
			modelName: 'UserVoucher'
		}
	);
	return UserVoucher;
};
