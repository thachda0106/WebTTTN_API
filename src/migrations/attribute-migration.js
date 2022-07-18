'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('attribute', {
			attributeID: {
				allowNull: false,
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			categoryID: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('attribute');
	}
};
