import express from 'express';
import db from '../models';
const accountRouter = express.Router();
const { body, validationResult } = require('express-validator');
// METHOD GET
accountRouter.get('/', async (req, res, next) => {});
// METHOD POST
accountRouter.post('/', async (req, res, next) => {});
// METHOD PUT
accountRouter.put('/', async (req, res, next) => {});
// METHOD DELETE
accountRouter.delete('/', async (req, res, next) => {});
//
module.exports = {
	accountAPI: (app) => {
		return app.use('/api/v1/account', accountRouter);
	}
};
