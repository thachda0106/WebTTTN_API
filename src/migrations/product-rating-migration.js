'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('product_rating', {
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
			customerID: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			starNumber: {
				type: Sequelize.INTEGER(1),
				allowNull: false
			},
			content: {
				type: Sequelize.STRING,
				allowNull: false
			},
			createdAt: {
				allowNull: false,
				defaultValue: Sequelize.NOW,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('product_rating');
	}
};
