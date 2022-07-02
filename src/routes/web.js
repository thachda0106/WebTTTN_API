import express from 'express';
let router = express.Router();

let initWebRoutes = (app) => {
	// method get
	router.get('/', (req, res, next) => {
		return res.send('hello world!');
	});
	router.get('/home', (req, res, next) => {
		return res.send('hello world!');
	});
	// method post, put....
	// app use route
	return app.use('/', router);
};

module.exports = initWebRoutes;
