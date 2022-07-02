import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine';
import initWebRoutes from './routes/web';

// use dotenv
import dotenv from 'dotenv';
dotenv.config();
// let app
let app = express();

// * config app
// app use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app use configure
viewEngine(app);

// app use route
initWebRoutes(app);

// app listen on
let port = process.env.PORT || 8069;
app.listen(port, () => {
	console.log('server listening on http://localhost:' + port);
});
