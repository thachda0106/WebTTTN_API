import express from 'express';
import db from '../models';
import fs from 'fs';
const customerRouter = express.Router();
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
import path from 'path';
import { uploadImg, uploadImageBase64 } from '../utils/functions';
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
		for (let i = 0; i < customerVouchers.length; i++) {
			let voucher = await db.Voucher.findByPk(customerVouchers[i].dataValues.voucherID);
			//check voucher expired => not response
			let now = Date.now();
			if (now > new Date(voucher.dateEnd).getTime()) {
				customerVouchers.splice(i, 1);
				i--;
				continue;
			}
			customerVouchers[i].dataValues = { ...customerVouchers[i].dataValues, ...voucher.dataValues };
		}
		return res.status(200).json(customerVouchers);
	} catch (error) {
		console.log(error);
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
		let updateInfo = {
				fullName: req.body.fullName,
				phoneNumber: req.body.phoneNumber,
				gender: req.body.gender,
				dateOfBirth: req.body.dateOfBirth,
				employeeID: req.body.employeeID,
				shippingAddress: req.body.shippingAddress
			},
			customerID = req.params.customerID;

		//
		if (req.body.avatar) {
			var newAvatar =
				process.env.BACKEND_URL + '/public/imgs/avatars/' + uploadImageBase64(req.body.avatar, 'avatars');
			updateInfo = { ...updateInfo, avatar: newAvatar };
			let avatarOld;
			if (req.body.avatar.avatarOld) {
				avatarOld = '/public' + req.body.avatar.avatarOld.split('public')[1];

				try {
					//delete thumbnail old
					fs.unlinkSync(path.dirname(__dirname) + avatarOld);
				} catch (e) {
					console.log(e.message);
				}
			}
		}

		// console.log({ updateInfo });
		try {
			//update info
			if (updateInfo.employeeID) {
				await db.Employee.update({ ...updateInfo }, { where: { employeeID: updateInfo.employeeID } });
			} else await db.Customer.update({ ...updateInfo }, { where: { customerID } });
			return res.status(201).json({ ...updateInfo });
		} catch (error) {
			console.log(error);
			return res.status(400).json(error);
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json(error);
	}
});
module.exports = {
	customerAPI: (app) => {
		return app.use('/api/v1/customer', customerRouter);
	}
};
