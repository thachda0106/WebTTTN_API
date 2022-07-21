import express from 'express';
import db from '../models';
const orderRouter = express.Router();
const { body, validationResult } = require('express-validator');
// METHOD GET
orderRouter.get('/', async (req, res, next) => {});
// METHOD POST
orderRouter.post('/', async (req, res, next) => {});
// METHOD PUT
orderRouter.put('/', async (req, res, next) => {});
// METHOD DELETE
orderRouter.delete('/', async (req, res, next) => {});
//
module.exports = {
	orderAPI: (app) => {
		return app.use('/api/v1/order', orderRouter);
	}
};
