import express from 'express';
import db from '../models';
const voucherRouter = express.Router();
const { body, validationResult } = require('express-validator');
// METHOD GET
voucherRouter.get('/', async (req, res, next) => {});
// METHOD POST
voucherRouter.post('/', async (req, res, next) => {});
// METHOD PUT
voucherRouter.put('/', async (req, res, next) => {});
// METHOD DELETE
voucherRouter.delete('/', async (req, res, next) => {});
//
module.exports = {
	voucherAPI: (app) => {
		return app.use('/api/v1/voucher', voucherRouter);
	}
};
