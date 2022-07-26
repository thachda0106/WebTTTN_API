'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('cart', {
			cartID: {
				allowNull: false,
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			customerID: {
				allowNull: false,
				type: Sequelize.INTEGER,
				primaryKey: true
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('cart');
	}
};
