'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('product', {
			productID: {
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
			},
			price: {
				allowNull: false,
				type: Sequelize.FLOAT
			},
			thumbnail: {
				allowNull: false,
				type: Sequelize.STRING
			},
			quantity: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			description: {
				allowNull: false,
				type: Sequelize.TEXT
			},
			brand: {
				allowNull: false,
				type: Sequelize.STRING
			},
			origin: {
				allowNull: false,
				type: Sequelize.STRING
			},
			guarantee: {
				allowNull: false,
				type: Sequelize.INTEGER(2)
			},

			discountPercent: {
				allowNull: true,
				type: Sequelize.FLOAT(2, 1)
			},
			dateDiscountStart: {
				allowNull: true,
				type: Sequelize.DATE
			},
			dateDiscountEnd: {
				allowNull: true,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('product');
	}
};
