'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('voucher', {
			voucherID: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			quantity: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			description: {
				type: Sequelize.STRING(100),
				allowNull: false
			},
			discountPercent: {
				type: Sequelize.FLOAT,
				allowNull: false
			},
			productID: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			maxDiscountValue: {
				type: Sequelize.FLOAT,
				allowNull: false
			},
			title: {
				type: Sequelize.STRING,
				allowNull: false
			},
			dateStart: {
				type: Sequelize.DATE,
				allowNull: false
			},
			dateEnd: {
				type: Sequelize.DATE,
				allowNull: false
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('voucher');
	}
};
