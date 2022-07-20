import db from '../models/index';

let homeStart = async (req, res, next) => {
	try {
		let voucherData = await db.Cart.findAll();
		res.json(voucherData);
	} catch (error) {
		res.json(error.message);
	}

	// res.render('home.ejs');
};

module.exports = {
	homeStart
};
