'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('categories', {
			categoryID: {
				allowNull: false,
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				allowNull: false,
				unique: true,
				type: Sequelize.STRING
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('categories');
	}
};
