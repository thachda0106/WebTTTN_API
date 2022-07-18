'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('order_detail', {
			orderID: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			productID: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			quantity: {
				allowNull: false,
				type: Sequelize.INTEGER(2)
			},
			priceOrder: {
				allowNull: false,
				type: Sequelize.FLOAT
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('order_detail');
	}
};
