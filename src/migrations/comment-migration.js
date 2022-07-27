'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('comment', {
			commentID: {
				allowNull: false,
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			username: {
				allowNull: false,
				type: Sequelize.STRING
			},
			productID: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			content: {
				type: Sequelize.STRING,
				allowNull: false
			},
			createdAt: {
				allowNull: false,
				defaultValue: Sequelize.NOW,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				defaultValue: Sequelize.NOW,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('comment');
	}
};
