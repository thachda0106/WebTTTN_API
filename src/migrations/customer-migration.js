'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('customer', {
			customerID: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			fullName: {
				allowNull: false,
				type: Sequelize.STRING
			},
			username: {
				allowNull: false,
				type: Sequelize.STRING
			},
			email: {
				type: Sequelize.STRING(100),
				allowNull: false,
				unique: true
			},
			avatar: {
				type: Sequelize.STRING,
				allowNull: true
			},
			phoneNumber: {
				type: Sequelize.STRING(10),
				allowNull: true
			},
			shippingAddress: {
				type: Sequelize.STRING,
				allowNull: true
			},
			gender: {
				type: Sequelize.BOOLEAN,
				allowNull: true
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('customer');
	}
};
