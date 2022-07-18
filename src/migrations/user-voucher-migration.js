'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('user_voucher', {
			userID: {
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
		await queryInterface.dropTable('user_voucher');
	}
};
