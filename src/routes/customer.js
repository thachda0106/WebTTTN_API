import express from 'express';
import db from '../models';
import fs from 'fs';
const customerRouter = express.Router();
const { body, validationResult } = require('express-validator');
import path from 'path';
import { uploadImg } from '../utils/functions';
// METHOD GET

// GET ALL user
customerRouter.get('/', async (req, res, next) => {
	try {
		let customers = await db.Customer.findAll();
		return res.status(200).json(customers);
	} catch (error) {
		return res.status(400).json(error);
	}
});

// GET customer by ID
customerRouter.get('/:customerID', async (req, res, next) => {
	let customerID = req.params.customerID;
	try {
		let customer = await db.Customer.findByPk(customerID);
		return res.status(200).json(customer);
	} catch (error) {
		return res.status(400).json(error);
	}
});

// GET ALL USER_VOUCHER
customerRouter.get('/vouchers/:customerID', async (req, res, next) => {
	let customerID = req.params.customerID;
	try {
		let customerVouchers = await db.CustomerVoucher.findAll({ where: { customerID } });
		return res.status(200).json(customerVouchers);
	} catch (error) {
		return res.status(400).json(error);
	}
});
// METHOD POST
// customerRouter.post('/', async (req, res, next) => {});
//collect-voucher
// METHOD PUT
//update profile
customerRouter.put('/:customerID', uploadImg.array('avatar', 1), async (req, res, next) => {
	try {
		let updateInfo = { ...req.body },
			customerID = req.params.customerID;
		if (req.files.length != 0) {
			updateInfo = { ...updateInfo, avatar: '/public/imgs/avatars/' + req.files[0].filename };
		}
		try {
			let customer = await db.Customer.findByPk(customerID);
			if (customer && customer.dataValues.avatar != null) {
				//delete avatar old
				let avatarOld = customer.dataValues.avatar;
				fs.unlinkSync(path.dirname(__dirname) + avatarOld);
			}
			//update info

			await db.Customer.update({ ...updateInfo }, { where: { customerID } });
			return res.status(201).json('update info customer success!');
		} catch (error) {
			return res.status(400).json(error);
		}
	} catch (error) {
		return res.status(400).json(error);
	}
});
module.exports = {
	customerAPI: (app) => {
		return app.use('/api/v1/customer', customerRouter);
	}
};
