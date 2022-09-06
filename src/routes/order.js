import express from 'express';
import db from '../models';
const orderRouter = express.Router();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const { body, validationResult } = require('express-validator');
import { getPriceOrder, getTotalDiscountVoucher, getPriceOrderTotal } from '../utils/functions';
const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');
import sendEmail from '../utils/mailer';
// METHOD GET
orderRouter.get('/status/:orderStatus', async (req, res, next) => {
	let statusVN = { PENDING: 'Chờ duyệt', DELIVERING: 'Đang giao', RECEIVED: 'Đã giao', CANCELED: 'Đã hủy' };
	let orderStatus = req.params.orderStatus,
		customerID = req.query.customerID;
	try {
		let orders = await db.Order.findAll({
			where: { orderStatus, customerID }
		});

		for (let i = 0; i < orders.length; i++) {
			if (orders[i].dataValues.voucherID) {
				let voucher = await db.Voucher.findByPk(orders[i].dataValues.voucherID);
				let product = await db.Product.findByPk(voucher.dataValues.productID);
				let discountVoucher =
					voucher.dataValues.discountPercent * product.dataValues.price > voucher.dataValues.maxDiscountValue
						? voucher.dataValues.maxDiscountValue
						: voucher.dataValues.discountPercent * product.dataValues.price;

				orders[i].dataValues.discountVoucher = discountVoucher;
			}
			orders[i].dataValues.orderStatus = statusVN[orders[i].dataValues.orderStatus];
			let orderDetails = await db.OrderDetail.findAll({ where: { orderID: orders[i].dataValues.orderID } });
			orders[i].dataValues.orderDetails = [];
			// add orderDetails to order
			for (let j = 0; j < orderDetails.length; j++) {
				let product = await db.Product.findByPk(orderDetails[j].dataValues.productID);
				orderDetails[j].dataValues.product = product.dataValues;
				//
				let rating = await db.ProductRating.findOne({
					where: {
						productID: orderDetails[j].dataValues.productID,
						orderID: orders[i].dataValues.orderID,
						customerID
					}
				});
				if (rating) orderDetails[j].dataValues.isRated = true;
				else orderDetails[j].dataValues.isRated = false;

				//
				orders[i].dataValues.orderDetails = [
					...orders[i].dataValues.orderDetails,
					orderDetails[j].dataValues
				];
			}
			let orderVouchers = await db.OrderVoucher.findAll({ where: { orderID: orders[i].dataValues.orderID } });
			orders[i].dataValues.orderVouchers = orderVouchers.dataValues;
			//
			for (let j = 0; j < orderVouchers.length; j++) {
				let voucher = await db.Voucher.findByPk(orderVouchers[j].dataValues.voucherID);
				let priceOrderProduct = await getPriceOrder(voucher.dataValues.productID);
				voucher.dataValues.priceOrderProduct = priceOrderProduct;
				orderVouchers[j].dataValues.voucher = voucher.dataValues;
			}
			orders[i].dataValues.orderVouchers = orderVouchers;
			orders[i].dataValues.id = orders[i].dataValues.orderID;
		}
		// if (orderStatus === 'RECEIVED') {
		// 	for (var i = 0; i < orders.length; i++) {
		// 		for (var j = 0; j < orders[i].dataValues.orderDetails; j++) {
		// 			let rating = await db.get.findOne({
		// 				where: {
		// 					productID: orders[i].dataValues.orderDetails[j].productID,
		// 					orderID: osrders[i].dataValues.orderID,
		// 					customerID
		// 				}
		// 			});
		// 			if (rating) orders[i].dataValues.orderDetails[j].isRated = true;
		// 			else orders[i].dataValues.orderDetails[j].isRated = false;
		// 		}
		// 	}
		// }

		orders.reverse();

		return res.status(200).json(orders);
	} catch (error) {
		console.log(error);
		return res.status(400).json(error);
	}
});
//get all order
orderRouter.get('/', async (req, res, next) => {
	let statusVN = { PENDING: 'Chờ duyệt', DELIVERING: 'Đang giao', RECEIVED: 'Đã giao', CANCELED: 'Đã hủy' };
	let isQuery = false;
	if (req.query.filter || req.query.range) isQuery = true;

	try {
		let orders;

		if (!isQuery) orders = await db.Order.findAll({});
		else {
			let filter = JSON.parse(req.query.filter),
				range = JSON.parse(req.query.range);
			// console.log({ filter, range });
			if (Object.keys(filter).length === 0) {
				orders = await db.Order.findAll({
					offset: range[0],
					limit: range[1] - range[0] + 1,
					order: [ [ 'orderID', 'DESC' ] ]
				});
			} else {
				let searchText = filter.searchText;
				if (!searchText) {
					orders = await db.Order.findAll({
						where: { orderStatus: filter.orderStatus },
						offset: range[0],
						limit: range[1] - range[0] + 1,
						order: [ [ 'orderID', 'DESC' ] ]
					});
				} else {
					orders = await db.Order.findAll({
						where: { orderStatus: filter.orderStatus, orderID: searchText },
						offset: range[0],
						limit: range[1] - range[0] + 1
					});
					if (orders.length === 0) {
						orders = await db.Order.findAll({
							where: { orderStatus: filter.orderStatus, phoneNumber: { [Op.substring]: searchText } },
							offset: range[0],
							limit: range[1] - range[0] + 1
						});
					}
				}
			}
		}

		for (let i = 0; i < orders.length; i++) {
			if (orders[i].dataValues.voucherID) {
				let voucher = await db.Voucher.findByPk(orders[i].dataValues.voucherID);
				let product = await db.Product.findByPk(voucher.dataValues.productID);
				let discountVoucher =
					voucher.dataValues.discountPercent * product.dataValues.price > voucher.dataValues.maxDiscountValue
						? voucher.dataValues.maxDiscountValue
						: voucher.dataValues.discountPercent * product.dataValues.price;

				orders[i].dataValues.discountVoucher = discountVoucher;
			}
			orders[i].dataValues.orderStatus = statusVN[orders[i].dataValues.orderStatus];
			let orderDetails = await db.OrderDetail.findAll({ where: { orderID: orders[i].dataValues.orderID } });
			orders[i].dataValues.orderDetails = [];
			// add orderDetails to order
			for (let j = 0; j < orderDetails.length; j++) {
				let product = await db.Product.findByPk(orderDetails[j].dataValues.productID);
				orderDetails[j].dataValues.product = product.dataValues;
				orders[i].dataValues.orderDetails = [
					...orders[i].dataValues.orderDetails,
					orderDetails[j].dataValues
				];
			}
			let orderVouchers = await db.OrderVoucher.findAll({ where: { orderID: orders[i].dataValues.orderID } });
			orders[i].dataValues.orderVouchers = orderVouchers.dataValues;
			//
			for (let j = 0; j < orderVouchers.length; j++) {
				let voucher = await db.Voucher.findByPk(orderVouchers[j].dataValues.voucherID);
				let priceOrderProduct = await getPriceOrder(voucher.dataValues.productID);
				voucher.dataValues.priceOrderProduct = priceOrderProduct;
				orderVouchers[j].dataValues.voucher = voucher.dataValues;
			}
			orders[i].dataValues.orderVouchers = orderVouchers;
			orders[i].dataValues.id = orders[i].dataValues.orderID;
		}
		return res.status(200).json(orders);
	} catch (error) {
		console.log(error);
		return res.status(400).json(error);
	}
});
//get order by orderID
orderRouter.get('/:orderID', async (req, res, next) => {
	let orderID = req.params.orderID;
	let statusVN = { PENDING: 'Chờ duyệt', DELIVERING: 'Đang giao', RECEIVED: 'Đã giao', CANCELED: 'Đã hủy' };
	try {
		let order = await db.Order.findOne({ where: { orderID } });
		let orderDetails = await db.OrderDetail.findAll({ where: { orderID } });
		order.dataValues.orderDetails = [];
		// add orderDetails to order
		for (let j = 0; j < orderDetails.length; j++) {
			order.dataValues.orderDetails = [ ...order.dataValues.orderDetails, orderDetails[j].dataValues ];
		}
		order.dataValues.orderStatus = statusVN[order.dataValues.orderStatus];
		let orderVouchers = await db.OrderVoucher.findAll({ where: { orderID: order.dataValues.orderID } });
		for (let j = 0; j < orderVouchers.length; j++) {
			let voucher = await db.Voucher.findByPk(orderVouchers[j].dataValues.voucherID);
			let priceOrderProduct = await getPriceOrder(voucher.dataValues.productID);
			voucher.dataValues.priceOrderProduct = priceOrderProduct;
			orderVouchers[j].dataValues.voucher = voucher.dataValues;
		}
		order.dataValues.orderVouchers = orderVouchers;
		order.dataValues.id = order.dataValues.orderID;
		return res.status(200).json(order);
	} catch (error) {
		return res.status(400).json(error);
	}
});
//get order by orderID
orderRouter.get('/customer/:customerID', async (req, res, next) => {
	let customerID = req.params.customerID;
	let statusVN = { PENDING: 'Chờ duyệt', DELIVERING: 'Đang giao', RECEIVED: 'Đã giao', CANCELED: 'Đã hủy' };
	try {
		let orders = await db.Order.findAll({ where: { customerID } });
		for (let i = 0; i < orders.length; i++) {
			if (orders[i].dataValues.voucherID) {
				let voucher = await db.Voucher.findByPk(orders[i].dataValues.voucherID);
				let product = await db.Product.findByPk(voucher.dataValues.productID);
				let discountVoucher =
					voucher.dataValues.discountPercent * product.dataValues.price > voucher.dataValues.maxDiscountValue
						? voucher.dataValues.maxDiscountValue
						: voucher.dataValues.discountPercent * product.dataValues.price;

				orders[i].dataValues.discountVoucher = discountVoucher;
			}
			orders[i].dataValues.orderStatus = statusVN[orders[i].dataValues.orderStatus];
			let orderDetails = await db.OrderDetail.findAll({ where: { orderID: orders[i].dataValues.orderID } });
			orders[i].dataValues.orderDetails = [];
			// add orderDetails to order
			for (let j = 0; j < orderDetails.length; j++) {
				let product = await db.Product.findByPk(orderDetails[j].dataValues.productID);
				orderDetails[j].dataValues.product = product.dataValues;
				//
				let rating = await db.ProductRating.findOne({
					where: {
						productID: orderDetails[j].dataValues.productID,
						orderID: orders[i].dataValues.orderID,
						customerID
					}
				});
				if (rating) orderDetails[j].dataValues.isRated = true;
				else orderDetails[j].dataValues.isRated = false;

				//
				orders[i].dataValues.orderDetails = [
					...orders[i].dataValues.orderDetails,
					orderDetails[j].dataValues
				];
			}
			let orderVouchers = await db.OrderVoucher.findAll({ where: { orderID: orders[i].dataValues.orderID } });
			orders[i].dataValues.orderVouchers = orderVouchers.dataValues;
			//
			for (let j = 0; j < orderVouchers.length; j++) {
				let voucher = await db.Voucher.findByPk(orderVouchers[j].dataValues.voucherID);
				let priceOrderProduct = await getPriceOrder(voucher.dataValues.productID);
				voucher.dataValues.priceOrderProduct = priceOrderProduct;
				orderVouchers[j].dataValues.voucher = voucher.dataValues;
			}
			orders[i].dataValues.orderVouchers = orderVouchers;
			orders[i].dataValues.id = orders[i].dataValues.orderID;
		}
		orders.reverse();
		return res.status(200).json(orders);
	} catch (error) {
		console.log(error);
		return res.status(400).json(error);
	}
});

// METHOD POST
orderRouter.post('/:cartID', async (req, res, next) => {
	let cartID = req.params.cartID,
		customerID = req.body.customerID,
		vouchersIDApply = req.body.vouchersIDApply,
		shippingAddress = req.body.shippingAddress,
		phoneNumber = req.body.phoneNumber,
		fullName = req.body.fullName,
		// cartItemIDs = req.body.cartItemIDs,
		newOrder = { customerID, shippingAddress, phoneNumber, fullName };
	// if (!cartItemIDs) return res.status(400).json('order can not has some cartItems!');
	try {
		// get cartItems for add order
		let orderDetails = [];
		let cartItems = await db.CartItem.findAll({ where: { cartID } });

		for (const cartItem of cartItems) {
			//checkQuantity product before add order
			let product = await db.Product.findByPk(cartItem.dataValues.productID);
			if (product.dataValues.quantity < cartItem.dataValues.quantity) {
				await db.CartItem.update(
					{ quantity: product.dataValues.quantity },
					{ where: { itemID: cartItem.dataValues.itemID } }
				);

				return res.status(406).json({
					message: `Số lượng sản phẩm ${product.dataValues.name} hiện tại chỉ còn ${product.dataValues
						.quantity} sản phẩm!`,
					info: { product, cartItem }
				});
			}
			//

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
			await db.CartItem.destroy({ where: { cartID } });
			// update product quantity
			let product = await db.Product.findByPk(detail.productID);
			await db.Product.update(
				{ quantity: product.dataValues.quantity - detail.quantity },
				{ where: { productID: detail.productID } }
			);
		}
		//add order_voucher
		if (vouchersIDApply.length > 0) {
			for (let voucherID of vouchersIDApply) {
				await db.OrderVoucher.create({ voucherID, orderID: order.dataValues.orderID });
				await db.CustomerVoucher.update({ isUsed: true }, { where: { customerID, voucherID } });
			}
			// update user used voucher
		}
		let customer = await db.Customer.findByPk(customerID);
		await sendEmail(
			customer.dataValues.email,
			'STONE ĐẶT HÀNG THÀNH CÔNG',
			`<b>Bạn đã đặt hàng thành công! Đơn hàng #${order.dataValues.orderID} </b>`
		);
		//return json
		res.status(201).json('created order!');
	} catch (error) {
		console.log(error);
		return res.status(400).json(error);
	}
});
// pAYONLIEN ORDER
orderRouter.post('/pay-online/:cartID', async (req, res, next) => {
	let cartID = req.params.cartID,
		customerID = req.body.info.customerID,
		vouchersIDApply = req.body.info.vouchersIDApply,
		shippingAddress = req.body.info.shippingAddress,
		phoneNumber = req.body.info.phoneNumber,
		fullName = req.body.info.fullName,
		// cartItemIDs = req.body.cartItemIDs,
		newOrder = { customerID, shippingAddress, phoneNumber, fullName, isPay: true };
	// if (!cartItemIDs) return res.status(400).json('order can not has some cartItems!');
	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: [ 'card' ],
			mode: 'payment',
			line_items: req.body.data.cartItems.map((item) => {
				return {
					price_data: {
						currency: 'usd',
						product_data: {
							name: item.product.name
						},
						unit_amount: Math.floor(item.product.priceOrder / 230)
					},
					quantity: item.quantity
				};
			}),
			success_url: `${process.env.FRONTEND_URL}/my-order`,
			cancel_url: `${process.env.FRONTEND_URL}/cart`
		});

		let id = setInterval(async () => {
			const checkSession = await stripe.checkout.sessions.retrieve(session.id);
			if (checkSession.payment_status === 'paid') {
				//
				// get cartItems for add order
				let orderDetails = [];
				let cartItems = await db.CartItem.findAll({ where: { cartID } });

				for (const cartItem of cartItems) {
					//checkQuantity product before add order
					let product = await db.Product.findByPk(cartItem.dataValues.productID);
					if (product.dataValues.quantity < cartItem.dataValues.quantity) {
						await db.CartItem.update(
							{ quantity: product.dataValues.quantity },
							{ where: { itemID: cartItem.dataValues.itemID } }
						);

						return res.status(406).json({
							message: `Số lượng sản phẩm ${product.dataValues.name} hiện tại chỉ còn ${product.dataValues
								.quantity} sản phẩm!`,
							info: { product, cartItem }
						});
					}
					//

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
					await db.CartItem.destroy({ where: { cartID } });
					// update product quantity
					let product = await db.Product.findByPk(detail.productID);
					await db.Product.update(
						{ quantity: product.dataValues.quantity - detail.quantity },
						{ where: { productID: detail.productID } }
					);
				}
				//add order_voucher
				if (vouchersIDApply.length > 0) {
					for (let voucherID of vouchersIDApply) {
						await db.OrderVoucher.create({ voucherID, orderID: order.dataValues.orderID });
						await db.CustomerVoucher.update({ isUsed: true }, { where: { customerID, voucherID } });
					}
					// update user used voucher
				}
				//
				console.log('thanh toan roi!');
				clearInterval(id);
			}
		}, 500);
		setTimeout(() => {
			clearInterval(id);
		}, 1000 * 60 * 5);
		res.status(201).json({ url: session.url });
		////////////////////////////////
	} catch (error) {
		console.log(error);
		return res.status(400).json(error);
	}
});
// METHOD PUT
//change order status PENDING | DELIVERING | RECEIVED | CANCELED
orderRouter.put('/:orderID', async (req, res, next) => {
	let orderStatus = req.body.orderStatus,
		orderID = req.params.orderID,
		employeeID = req.body.employeeID;
	if (!'PENDING,DELIVERING,RECEIVED'.includes(orderStatus)) return res.status(400).json('orderStatus invalid!');
	let statusVN = { PENDING: 'Chờ duyệt', DELIVERING: 'Đang giao', RECEIVED: 'Đã giao', CANCELED: 'Đã hủy' };
	try {
		if (orderStatus === 'RECEIVED') {
			await db.Order.update({ orderStatus, isPay: true, employeeID }, { where: { orderID } });
		} else await db.Order.update({ orderStatus, employeeID }, { where: { orderID } });

		let order = await db.Order.findByPk(orderID);
		let customer = await db.Customer.findByPk(order.dataValues.customerID);
		await sendEmail(
			customer.dataValues.email,
			`STONE THÔNG BÁO ĐƠN HÀNG #${order.dataValues.orderID}  !`,
			`<b>Đơn hàng #${order.dataValues.orderID} ${statusVN[orderStatus]}  </b>`
		);
		return res.status(201).json('orderStatus updated!');
	} catch (error) {
		return res.status(400).json(error);
	}
});
//
orderRouter.put('/canceled/:orderID', async (req, res, next) => {
	let orderID = req.params.orderID,
		employeeID = req.body.employeeID;
	let data = !employeeID ? { orderStatus: 'CANCELED' } : { orderStatus: 'CANCELED', employeeID };
	try {
		await db.Order.update({ ...data }, { where: { orderID } });
		let orderDetails = await db.OrderDetail.findAll({ where: { orderID } });
		for (let detail of orderDetails) {
			let product = await db.Product.findByPk(detail.dataValues.productID);
			await db.Product.update(
				{ quantity: product.dataValues.quantity + detail.dataValues.quantity },
				{ where: { productID: detail.dataValues.productID } }
			);
		}
		//

		let order = await db.Order.findByPk(orderID);
		let customer = await db.Customer.findByPk(order.dataValues.customerID);
		await sendEmail(
			customer.dataValues.email,
			`STONE THÔNG BÁO ĐƠN HÀNG #${order.dataValues.orderID}  !`,
			`<b>Đơn hàng #${order.dataValues.orderID} đã được hủy  </b>`
		);
		return res.status(201).json('orderStatus updated!');
	} catch (error) {
		console.log(error);
		return res.status(400).json(error);
	}
});

orderRouter.post('/turnover/date', async (req, res, next) => {
	try {
		let dayStart = req.body.dayStart,
			dayEnd = req.body.dayEnd;
		let orders = await db.sequelize.query(
			"SELECT *  FROM `order` WHERE `orderStatus` LIKE 'RECEIVED' AND `dateCreate` >= '" +
				dayStart +
				"' AND `dateCreate` <= '" +
				dayEnd +
				"'",
			{ type: QueryTypes.SELECT }
		);
		for (let i = 0; i < orders.length; i++) {
			let orderDetails = await db.OrderDetail.findAll({ where: { orderID: orders[i].orderID } });
			orders[i].orderDetails = [];
			// add orderDetails to order
			for (let j = 0; j < orderDetails.length; j++) {
				orders[i].orderDetails = [ ...orders[i].orderDetails, orderDetails[j].dataValues ];
			}
			let orderVouchers = await db.OrderVoucher.findAll({ where: { orderID: orders[i].orderID } });
			orders[i].orderVouchers = orderVouchers.dataValues;
			//
			for (let j = 0; j < orderVouchers.length; j++) {
				let voucher = await db.Voucher.findByPk(orderVouchers[j].dataValues.voucherID);
				let priceOrderProduct = await getPriceOrder(voucher.dataValues.productID);
				voucher.dataValues.priceOrderProduct = priceOrderProduct;
				orderVouchers[j].dataValues.voucher = voucher.dataValues;
			}
			orders[i].orderVouchers = orderVouchers;
			orders[i].id = orders[i].orderID;
		}
		return res.status(201).json(orders);
	} catch (error) {
		console.log(error);
		return res.status(400).json(error);
	}
});

orderRouter.post('/turnover/year', async (req, res, next) => {
	try {
		let year = req.body.year;
		let dayStart = `${year}-01-01 00:00:00`,
			dayEnd = `${year}-12-31 23:59:59`;
		let orders = await db.sequelize.query(
			"SELECT *  FROM `order` WHERE `orderStatus` LIKE 'RECEIVED' AND `dateCreate` >= '" +
				dayStart +
				"' AND `dateCreate` <= '" +
				dayEnd +
				"'",
			{ type: QueryTypes.SELECT }
		);
		let dataTurnover = [];
		let index = 0;
		for (let j = 1; j <= 12; j++) {
			let totalTurnoverOrdersOfMonth = 0;
			for (let i = index; i < orders.length; i++) {
				let dateCreate = new Date(orders[i].dateCreate);
				if (dateCreate.getMonth() + 1 !== j) {
					index = i;
					break;
				}
				let orderDetails = await db.OrderDetail.findAll({ where: { orderID: orders[i].orderID } });
				let totalOrderNoVoucher = getPriceOrderTotal(orderDetails);

				let orderVouchers = await db.OrderVoucher.findAll({ where: { orderID: orders[i].orderID } });
				for (let j = 0; j < orderVouchers.length; j++) {
					let voucher = await db.Voucher.findByPk(orderVouchers[j].dataValues.voucherID);
					let priceOrderProduct = await getPriceOrder(voucher.dataValues.productID);
					voucher.dataValues.priceOrderProduct = priceOrderProduct;
					orderVouchers[j].dataValues.voucher = voucher.dataValues;
				}
				let totalDiscountVouchersOrder = getTotalDiscountVoucher(orderVouchers);
				totalTurnoverOrdersOfMonth += totalOrderNoVoucher - totalDiscountVouchersOrder;
			}
			dataTurnover = [ ...dataTurnover, totalTurnoverOrdersOfMonth ];
		}
		return res.status(201).json(dataTurnover);
	} catch (error) {
		console.log(error);
		return res.status(400).json(error);
	}
});
module.exports = {
	orderAPI: (app) => {
		return app.use('/api/v1/order', orderRouter);
	}
};
