'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface
			.addConstraint('account', {
				type: 'FOREIGN KEY',
				fields: [ 'roleID' ], // field name of the foreign key
				name: 'fk_account_roleID',
				references: {
					table: 'role', // Target model
					field: 'roleID' // key in Target model
				},
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT'
			})
			.then(() => {
				queryInterface.addConstraint('attribute', {
					type: 'FOREIGN KEY',
					fields: [ 'categoryID' ], // field name of the foreign key
					name: 'fk_attribute_categoryID',
					references: {
						table: 'categories', // Target model
						field: 'categoryID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('cart_item', {
					type: 'FOREIGN KEY',
					fields: [ 'productID' ], // field name of the foreign key
					name: 'fk_cart_item-productID',
					references: {
						table: 'product', // Target model
						field: 'productID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('cart_item', {
					type: 'FOREIGN KEY',
					fields: [ 'cartID' ], // field name of the foreign key
					name: 'fk_cart_item-cartID',
					references: {
						table: 'cart', // Target model
						field: 'cartID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('cart', {
					type: 'FOREIGN KEY',
					fields: [ 'customerID' ], // field name of the foreign key
					name: 'fk_cart-customerID',
					references: {
						table: 'customer', // Target model
						field: 'customerID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('comment', {
					type: 'FOREIGN KEY',
					fields: [ 'username' ], // field name of the foreign key
					name: 'fk_comment-username',
					references: {
						table: 'account', // Target model
						field: 'username' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('comment', {
					type: 'FOREIGN KEY',
					fields: [ 'productID' ], // field name of the foreign key
					name: 'fk_comment-productID',
					references: {
						table: 'product', // Target model
						field: 'productID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('employee', {
					type: 'FOREIGN KEY',
					fields: [ 'username' ], // field name of the foreign key
					name: 'fk_employee-username',
					references: {
						table: 'account', // Target model
						field: 'username' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('order_detail', {
					type: 'FOREIGN KEY',
					fields: [ 'orderID' ], // field name of the foreign key
					name: 'fk_order_detail-orderID',
					references: {
						table: 'order', // Target model
						field: 'orderID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('order_detail', {
					type: 'FOREIGN KEY',
					fields: [ 'productID' ], // field name of the foreign key
					name: 'fk_order_detail-productID',
					references: {
						table: 'product', // Target model
						field: 'productID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('order', {
					type: 'FOREIGN KEY',
					fields: [ 'customerID' ], // field name of the foreign key
					name: 'fk_order-customerID',
					references: {
						table: 'customer', // Target model
						field: 'customerID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('order', {
					type: 'FOREIGN KEY',
					fields: [ 'employeeID' ], // field name of the foreign key
					name: 'fk_order-employeeID',
					references: {
						table: 'employee', // Target model
						field: 'employeeID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('order', {
					type: 'FOREIGN KEY',
					fields: [ 'voucherID' ], // field name of the foreign key
					name: 'fk_order-voucherID',
					references: {
						table: 'voucher', // Target model
						field: 'voucherID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('product_attribute', {
					type: 'FOREIGN KEY',
					fields: [ 'productID' ], // field name of the foreign key
					name: 'fk_product_attribute-productID',
					references: {
						table: 'product', // Target model
						field: 'productID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('product_attribute', {
					type: 'FOREIGN KEY',
					fields: [ 'attributeID' ], // field name of the foreign key
					name: 'fk_product_attribute-attributeID',
					references: {
						table: 'attribute', // Target model
						field: 'attributeID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('product_image', {
					type: 'FOREIGN KEY',
					fields: [ 'productID' ], // field name of the foreign key
					name: 'fk_product_image-productID',
					references: {
						table: 'product', // Target model
						field: 'productID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('product_rating', {
					type: 'FOREIGN KEY',
					fields: [ 'productID' ], // field name of the foreign key
					name: 'fk_product_rating-productID',
					references: {
						table: 'product', // Target model
						field: 'productID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('product_rating', {
					type: 'FOREIGN KEY',
					fields: [ 'customerID' ], // field name of the foreign key
					name: 'fk_product_rating-customerID',
					references: {
						table: 'customer', // Target model
						field: 'customerID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('reply', {
					type: 'FOREIGN KEY',
					fields: [ 'commentID' ], // field name of the foreign key
					name: 'fk_reply-commentID',
					references: {
						table: 'comment', // Target model
						field: 'commentID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('reply', {
					type: 'FOREIGN KEY',
					fields: [ 'username' ], // field name of the foreign key
					name: 'fk_reply-username',
					references: {
						table: 'account', // Target model
						field: 'username' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('customer_voucher', {
					type: 'FOREIGN KEY',
					fields: [ 'customerID' ], // field name of the foreign key
					name: 'fk_customer_voucher-customerID',
					references: {
						table: 'customer', // Target model
						field: 'customerID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('customer_voucher', {
					type: 'FOREIGN KEY',
					fields: [ 'voucherID' ], // field name of the foreign key
					name: 'fk_customer_voucher-voucherID',
					references: {
						table: 'voucher', // Target model
						field: 'voucherID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('voucher', {
					type: 'FOREIGN KEY',
					fields: [ 'productID' ], // field name of the foreign key
					name: 'fk_voucher-productID',
					references: {
						table: 'product', // Target model
						field: 'productID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('customer', {
					type: 'FOREIGN KEY',
					fields: [ 'username' ], // field name of the foreign key
					name: 'fk_customer-username',
					references: {
						table: 'account', // Target model
						field: 'username' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			})
			.then(() => {
				queryInterface.addConstraint('product', {
					type: 'FOREIGN KEY',
					fields: [ 'categoryID' ], // field name of the foreign key
					name: 'fk_product-categoryID',
					references: {
						table: 'categoried', // Target model
						field: 'categoryID' // key in Target model
					},
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT'
				});
			});
	},
	async down(queryInterface, Sequelize) {}
};
