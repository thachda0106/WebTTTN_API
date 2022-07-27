'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('reply', {
			replyID: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			commentID: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			username: {
				allowNull: false,
				type: Sequelize.STRING
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
			updateAt: {
				allowNull: false,
				defaultValue: Sequelize.NOW,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('reply');
	}
};
