'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('role', {
			roleID: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			type: {
				allowNull: false,
				unique: true,
				type: Sequelize.STRING
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('role');
	}
};
