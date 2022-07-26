import express from 'express';
import db from '../models';
const cartRouter = express.Router();
const { body, validationResult } = require('express-validator');
// METHOD GET
// get all cart_item
cartRouter.get('/:customerID', async (req, res, next) => {
	let customerID = req.params.customerID;
	try {
		let cart = await db.Cart.findOne({ where: { customerID } });
		if (!cart) return res.status(400).json('user not exits!');
		//
		let cartItems = await db.CartItem.findAll({
			attributes: { exclude: [ 'cartID' ] },
			where: { cartID: cart.dataValues.cartID }
		});
		for (let i = 0; i < cartItems.length; i++) {
			let productID = cartItems[i].dataValues.productID;
			delete cartItems[i].dataValues.productID;
			let product = await db.Product.findByPk(productID);
			cartItems[i].dataValues.product = product.dataValues;
		}

		cart.dataValues.cartItems = cartItems;
		return res.status(200).json(cart);
	} catch (error) {
		return res.status(400).json(error);
	}
});
// // get cart_item byID
// cartRouter.get('/', async (req, res, next) => {});
// METHOD POST
cartRouter.post(
	'/',
	body('productID').isInt(),
	body('cartID').isInt(),
	body('quantity').isInt(),
	async (req, res, next) => {
		// validation body input
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		// handle
		let productID = req.body.productID,
			cartID = req.body.cartID,
			quantity = req.body.quantity;
		let cartItem = await db.CartItem.findOne({ where: { productID, cartID } });
		if (cartItem) {
			try {
				await db.CartItem.update(
					{ quantity: parseInt(quantity) + parseInt(cartItem.dataValues.quantity) },
					{ where: { itemID: cartItem.dataValues.itemID } }
				);
				res.status(201).json('add cartItem success!');
			} catch (error) {
				return res.status(400).json({ errors });
			}
		} else {
			let newCart = { productID, cartID, quantity };
			try {
				let cartItem = await db.CartItem.create(newCart);
				return res.status(201).json(cartItem);
			} catch (error) {
				return res.status(400).json({ errors });
			}
		}
	}
);
// METHOD PUT
cartRouter.put('/:itemID', async (req, res, next) => {
	let itemID = req.params.itemID;
	let cartItem = await db.CartItem.findByPk(itemID);
	if (cartItem) {
		try {
			if (cartItem.dataValues.quantity == 1) return res.status(404).json('quantity of product is minimum!');
			else {
				try {
					let quantity = parseInt(cartItem.dataValues.quantity) - 1;
					await db.CartItem.update({ quantity }, { where: { itemID } });
					return res.status(201).json('decrease quantity success!');
				} catch (error) {
					return res.status(400).json(error);
				}
			}
		} catch (error) {
			return res.status(400).json(error);
		}
	} else return res.status(404).json('cartItem not found!');
});
// METHOD DELETE
cartRouter.delete('/:itemID', async (req, res, next) => {
	let itemID = req.params.itemID;
	let cartItem = await db.CartItem.findByPk(itemID);
	if (cartItem) {
		try {
			try {
				await db.CartItem.destroy({ where: { itemID } });
				return res.status(204).json('deleted cartItem!');
			} catch (error) {
				return res.status(400).json(error);
			}
		} catch (error) {
			return res.status(400).json(error);
		}
	} else return res.status(404).json('cartItem not found!');
});
//
module.exports = {
	cartAPI: (app) => {
		return app.use('/api/v1/cart', cartRouter);
	}
};
