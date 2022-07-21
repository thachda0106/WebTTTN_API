import express from 'express';
import db from '../models';
const cartRouter = express.Router();
const { body, validationResult } = require('express-validator');
// METHOD GET
cartRouter.get('/', async (req, res, next) => {});
// METHOD POST
cartRouter.post('/', async (req, res, next) => {});
// METHOD PUT
cartRouter.put('/', async (req, res, next) => {});
// METHOD DELETE
cartRouter.delete('/', async (req, res, next) => {});
//
module.exports = {
	cartAPI: (app) => {
		return app.use('/api/v1/cart', cartRouter);
	}
};
