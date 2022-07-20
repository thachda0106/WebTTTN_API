import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
var privateKey = fs.readFileSync(path.join(path.dirname(__dirname), './key/private.key'));
var publicKey = fs.readFileSync(path.join(path.dirname(__dirname), './key/public.crt'));

const createToken = (payload) => {
	// create jwt token with payload and exp: 30m
	const token = jwt.sign({ payload, exp: Math.floor(Date.now() / 1000) + 30 * 60 }, privateKey, {
		algorithm: 'RS256'
	});
	return token;
};

const checkSessionLoginExp = (req, res, next) => {
	if (req.path === '/api/v1/account/login' || req.path === '/api/v1/account/register') {
		return next();
	} else {
		let token = req.cookies.token;
		try {
			jwt.verify(token, publicKey, { algorithms: [ 'RS256' ] });
			next();
		} catch (error) {
			res.status(403).json('session login expired!');
		}
	}
};

module.exports = {
	createToken,
	checkSessionLoginExp
};
