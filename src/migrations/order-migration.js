'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('order', {
			orderID: {
				allowNull: false,
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			customerID: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			employeeID: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			voucherID: {
				allowNull: true,
				type: Sequelize.INTEGER
			},
			orderStatus: {
				allowNull: false,
				type: Sequelize.STRING(10)
			},
			dateCreate: {
				allowNull: false,
				defaultValue: Sequelize.NOW,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('order');
	}
};
