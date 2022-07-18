'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('cart_item', {
			itemID: {
				allowNull: false,
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			productID: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			cartID: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			quantity: {
				allowNull: false,
				type: Sequelize.INTEGER
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('cart_item');
	}
};
