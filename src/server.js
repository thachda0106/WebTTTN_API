// IMPORT MODULE DEPENDENCY
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// IMPORT CONFIG MODULE
import viewEngine from './config/viewEngine';
import initWebRoutes from './routes';
import connectDB from './config/connectDB';
import { accountAPI } from './routes/account.js';
import { checkSessionLoginExp } from './utils/middleware.js';
import { uploadImg } from './utils/functions';

dotenv.config();

// INIT APP
const app = express();

// CONFIG APP
// app use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app use cookie parse
app.use(cookieParser());

// app use configure
app.use(checkSessionLoginExp);
viewEngine(app);
// app use route api
initWebRoutes(app);
accountAPI(app);
// connect db
connectDB();

// app listen on
let port = process.env.PORT || 8069;
app.listen(port, () => {
	console.log('server listening on http://localhost:' + port);
});
