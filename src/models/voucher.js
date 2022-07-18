'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Voucher extends Model {
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
	Voucher.init(
		{
			voucherID: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			quantity: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			description: {
				type: DataTypes.STRING(100),
				allowNull: false
			},
			discountPercent: {
				type: DataTypes.FLOAT,
				allowNull: false
			},
			productID: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			maxDiscountValue: {
				type: DataTypes.FLOAT,
				allowNull: false
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false
			},
			dateStart: {
				type: DataTypes.DATE,
				allowNull: false
			},
			dateEnd: {
				type: DataTypes.DATE,
				allowNull: false
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			sequelize,
			modelName: 'Voucher'
		}
	);
	return Voucher;
};
