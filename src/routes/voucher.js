import express from 'express';
import db from '../models';
const voucherRouter = express.Router();
const { body, validationResult } = require('express-validator');
// METHOD GET

// GET ALL VOUCHER
voucherRouter.get('/', async (req, res, next) => {
	try {
		let vouchers = await db.Voucher.findAll();
		return res.status(200).json(vouchers);
	} catch (error) {
		return res.status(400).json(error);
	}
});

// GET ALL VOUCHER
voucherRouter.get('/:voucherID', async (req, res, next) => {
	let voucherID = req.params.voucherID;
	try {
		let voucher = await db.Voucher.findByPk(voucherID);
		return res.status(200).json(voucher);
	} catch (error) {
		return res.status(400).json(error);
	}
});
// METHOD POST
voucherRouter.post('/collect', async (req, res, next) => {
	let customerID = req.body.customerID,
		voucherID = req.body.voucherID;

	try {
		let customerVoucher = db.CustomerVoucher.findOne({ where: { customerID, voucherID } });
		if (customerVoucher) return res.status(400).json('customer had been collected voucher!');
	} catch (error) {}
	try {
		let voucher = await db.Voucher.findByPk(voucherID);
		if (voucher.dataValues.quantity == 0) return res.status(400).json('voucher quantity effete');
		let customerVoucher = await db.CustomerVoucher.create({ customerID, voucherID });
		let quantity = parseInt(voucher.dataValues.quantity) - 1;
		await db.Voucher.update({ quantity }, { where: { voucherID } });
		return res.status(201).json(customerVoucher);
	} catch (error) {
		return res.status(400).json(error);
	}
});
// add voucher
voucherRouter.post('/', body('discountPercent').isFloat({ min: 0.01, max: 0.99 }), async (req, res, next) => {
	let productID = req.body.productID,
		quantity = req.body.quantity,
		title = req.body.title,
		description = req.body.description,
		discountPercent = req.body.discountPercent,
		maxDiscountValue = req.body.maxDiscountValue,
		dateStart = req.body.dateStart,
		dateEnd = req.body.dateEnd;
	let newVoucher = { productID, quantity, title, description, discountPercent, maxDiscountValue, dateStart, dateEnd };
	// validation body input
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	// handle
	try {
		let voucher = await db.Voucher.create(newVoucher);
		res.status(201).json(voucher);
	} catch (err) {
		return res.status(400).json({ err });
	}
});
// METHOD PUT
voucherRouter.put('/:voucherID', async (req, res, next) => {
	if (req.body.length < 0) return res.status(400).json('nothing update!');
	let updateInfo = { ...req.body },
		voucherID = req.params.voucherID;
	try {
		await db.Voucher.update({ ...updateInfo }, { where: { voucherID } });
		return res.status(201).json('update success!');
	} catch (error) {
		return res.status(400).json(error);
	}
});
// METHOD DELETE
voucherRouter.delete('/:voucherID', async (req, res, next) => {
	let voucherID = req.params.voucherID;
	try {
		await db.Voucher.destroy({ where: { voucherID } });
		return res.status(204).json('deleted voucher!');
	} catch (error) {
		return res.status(400).json(error);
	}
});
//
module.exports = {
	voucherAPI: (app) => {
		return app.use('/api/v1/voucher', voucherRouter);
	}
};
