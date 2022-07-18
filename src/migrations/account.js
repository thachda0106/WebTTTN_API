'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('account', {
			username: {
				allowNull: false,
				type: Sequelize.STRING,
				primaryKey: true
			},
			password: {
				allowNull: false,
				type: Sequelize.STRING
			},
			roleID: {
				allowNull: false,
				type: Sequelize.INTEGER
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('cart_item');
	}
};
