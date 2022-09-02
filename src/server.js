// IMPORT MODULE DEPENDENCY
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// IMPORT CONFIG MODULE
import viewEngine from './config/viewEngine';
import initWebRoutes from './routes';
import connectDB from './config/connectDB';
import { checkSessionLoginExp } from './utils/middleware.js';
import { accountAPI } from './routes/account';
import { categoriesAPI } from './routes/categories';
import { productAPI } from './routes/product';
import { cartAPI } from './routes/cart';
import { voucherAPI } from './routes/voucher';
import { customerAPI } from './routes/customer';
import { orderAPI } from './routes/order';

dotenv.config();
// INIT APP
const app = express();
// STRIPE

//
// CONFIG APP
// app use body parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
//app use cookie parse
app.use(cookieParser());
// app use cors
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		method: 'POST GET, PUT,PATCH, DELETE',
		credentials: true
	})
);
// Add headers before the routes are defined
app.use(function(req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
	res.setHeader('Content-Range', 'categories product 0-20/20');

	// // Request headers you wish to allow
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
	);

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});
// app use configure
// app.use(checkSessionLoginExp);
viewEngine(app);
// app use route api
initWebRoutes(app);
accountAPI(app);
categoriesAPI(app);
productAPI(app);
cartAPI(app);
voucherAPI(app);
customerAPI(app);
orderAPI(app);
// connect db
connectDB();

// app listen on
let port = process.env.PORT || 8069;
app.listen(port, () => {
	console.log('server listening on http://localhost:' + port);
});
