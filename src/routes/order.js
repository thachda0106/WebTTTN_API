import express from 'express';
import db from '../models';
const orderRouter = express.Router();
const { body, validationResult } = require('express-validator');
import { getPriceOrder } from '../utils/functions';
// METHOD GET
//get all order
orderRouter.get('/', async (req, res, next) => {
	let orderStatus = req.body.orderStatus;

	try {
		let orders;
		if (orderStatus) {
			orders = await db.Order.findAll({ where: { orderStatus } });
		} else orders = await db.Order.findAll();
		for (let i = 0; i < orders.length; i++) {
			let orderDetails = await db.OrderDetail.findAll({ where: { orderID: orders[i].dataValues.orderID } });
			orders[i].dataValues.orderDetails = [];
			// add orderDetails to order
			for (let j = 0; j < orderDetails.length; j++) {
				orders[i].dataValues.orderDetails = [
					...orders[i].dataValues.orderDetails,
					orderDetails[j].dataValues
				];
			}
		}
		return res.status(200).json(orders);
	} catch (error) {
		return res.status(400).json(error);
	}
});
//get order by orderID
orderRouter.get('/:orderID', async (req, res, next) => {
	let orderID = req.params.orderID;
	try {
		let order = await db.Order.findOne({ where: { orderID } });
		let orderDetails = await db.OrderDetail.findAll({ where: { orderID } });
		order.dataValues.orderDetails = [];
		// add orderDetails to order
		for (let j = 0; j < orderDetails.length; j++) {
			order.dataValues.orderDetails = [ ...order.dataValues.orderDetails, orderDetails[j].dataValues ];
		}
		return res.status(200).json(order);
	} catch (error) {
		return res.status(400).json(error);
	}
});

// METHOD POST
orderRouter.post('/', async (req, res, next) => {
	let customerID = req.body.customerID,
		employeeID = req.body.employeeID,
		voucherID = req.body.voucherID,
		cartItemIDs = req.body.cartItemIDs,
		newOrder = { customerID, employeeID };
	if (!cartItemIDs) return res.status(400).json('order can not has some cartItems!');
	if (voucherID) newOrder = { ...newOrder, voucherID };
	try {
		// get cartItems for add order
		let orderDetails = [];
		for (const itemID of cartItemIDs) {
			let cartItem = await db.CartItem.findByPk(itemID);
			cartItem.dataValues.priceOrder = await getPriceOrder(cartItem.dataValues.productID);
			orderDetails = [ ...orderDetails, cartItem.dataValues ];
		}
		// create order
		let order = await db.Order.create(newOrder);
		for (const detail of orderDetails) {
			let newOrderDetail = {
				orderID: order.dataValues.orderID,
				productID: detail.productID,
				quantity: detail.quantity,
				priceOrder: detail.priceOrder
			};
			await db.OrderDetail.create(newOrderDetail);
			await db.CartItem.destroy({ where: { itemID: detail.itemID } });
			// update product quantity
			let product = await db.Product.findByPk(detail.productID);
			await db.Product.update(
				{ quantity: product.dataValues.quantity - detail.quantity },
				{ where: { productID: detail.productID } }
			);
		}
		//return json
		res.status(201).json('created order!');
	} catch (error) {
		return res.status(400).json(error);
	}
});
// METHOD PUT
//change order status PENDING | DELIVERING | RECEIVED | CANCELED
orderRouter.put('/:orderID', async (req, res, next) => {
	let orderStatus = req.body.orderStatus,
		orderID = req.params.orderID;
	if (!'pending,delivering,received,canceled'.includes(orderStatus))
		return res.status(400).json('orderStatus invalid!');
	try {
		await db.Order.update({ orderStatus }, { where: { orderID } });
		return res.status(201).json('orderStatus updated!');
	} catch (error) {
		return res.status(400).json(error);
	}
});
//
module.exports = {
	orderAPI: (app) => {
		return app.use('/api/v1/order', orderRouter);
	}
};
