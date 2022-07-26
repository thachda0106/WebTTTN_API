'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('employee', {
			employeeID: {
				allowNull: false,
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			avatar: {
				allowNull: false,
				type: Sequelize.STRING
			},
			email: {
				allowNull: false,
				unique: true,
				type: Sequelize.STRING
			},
			fullName: {
				allowNull: false,
				type: Sequelize.STRING
			},
			gender: {
				allowNull: false,
				type: Sequelize.BOOLEAN
			},
			phoneNumber: {
				allowNull: false,
				type: Sequelize.STRING(10)
			},
			identification: {
				allowNull: false,
				type: Sequelize.STRING
			},
			dateOfBirth: {
				allowNull: false,
				type: Sequelize.DATEONLY
			},
			username: {
				allowNull: false,
				type: Sequelize.STRING
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('employee');
	}
};
