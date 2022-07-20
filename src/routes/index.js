import express from 'express';
import { homeStart } from '../controllers/indexController.js';
let router = express.Router();

let initWebRoutes = (app) => {
	// method get
	router.get('/', (req, res, next) => {
		return res.send('hello world!');
	});
	router.get('/home', homeStart);
	// method post, put....
	// app use route
	return app.use('/', router);
};

module.exports = initWebRoutes;
