'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('product_image', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			productID: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			imageURL: {
				allowNull: false,
				type: Sequelize.STRING
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('product_image');
	}
};
