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
			userID: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			productID: {
				allowNull: false,
				type: Sequelize.INTEGER
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
