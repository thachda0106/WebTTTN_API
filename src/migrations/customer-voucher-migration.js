'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('customer_voucher', {
			customerID: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			voucherID: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			isUsed: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('customer_voucher');
	}
};
