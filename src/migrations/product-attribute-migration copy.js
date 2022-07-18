'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('product_attribute', {
			productID: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			attributeID: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			value: {
				allowNull: false,
				type: Sequelize.STRING
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('product_attribute');
	}
};
