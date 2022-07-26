'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Account extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate(models) {
			// define association here
			// Account.hasOne(models.User, { foreignKey: 'username' });
			// Account.hasOne(models.Employee, { foreignKey: 'username' });
			// models.Role.hasMany(Account, { foreignKey: 'roleID' });
		}
	}
	Account.init(
		{
			username: {
				allowNull: false,
				type: DataTypes.STRING,
				primaryKey: true
			},
			password: {
				allowNull: false,
				type: DataTypes.STRING
			},
			roleID: {
				allowNull: false,
				type: DataTypes.INTEGER
			},
			enable: {
				allowNull: false,
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{
			freezeTableName: true,
			timestamps: false,
			sequelize,
			modelName: 'Account'
		}
	);
	return Account;
};
