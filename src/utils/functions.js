const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const multer = require('multer');
const publicKey = fs.readFileSync(path.join(path.dirname(__dirname), './key/public.crt'));
import db from '../models';
const storageAvatar = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'src/public/imgs/avatars');
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + '_' + file.originalname);
	}
});
const storageProductImgs = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'src/public/imgs/products');
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + '_' + file.originalname);
	}
});
const uploadImg = multer({ storage: storageAvatar });
const uploadProductImgs = multer({ storage: storageProductImgs });

const encryptPassword = async (password) => {
	try {
		let salt = await bcrypt.genSalt(saltRounds);
		let hash = await bcrypt.hash(password, salt);
		return hash;
	} catch (e) {
		console.log(e.message);
	}
};

const getPriceOrder = async (productID) => {
	let product = await db.Product.findByPk(productID);
	let price = product.dataValues.price;
	if (product.discountPercent === null) {
		return price;
	}
	let dateEnd = new Date(product.dataValues.dateDiscountEnd),
		dateStart = new Date(product.dataValues.dateDiscountStart);
	if (Date.now() > dateEnd.getTime() || Date.now() < dateStart.getTime()) {
		return price;
	}

	return price - price * product.dataValues.discountPercent;
};

const getPriceOrderTotal = (orderDetails) => {
	let total = 0;
	for (const orderDetail of orderDetails) {
		total += orderDetail.dataValues.quantity * orderDetail.dataValues.priceOrder;
	}
	return total;
};
const getTotalDiscountVoucher = (orderVouchers) => {
	let total = 0;
	for (let i = 0; i < orderVouchers.length; i++) {
		let priceDiscount =
			orderVouchers[i].dataValues.voucher.priceOrderProduct * orderVouchers[i].dataValues.voucher.discountPercent;
		if (priceDiscount > orderVouchers[i].dataValues.voucher.maxDiscountValue) {
			priceDiscount = orderVouchers[i].dataValues.voucher.maxDiscountValue;
		}
		total += priceDiscount;
	}
	return total;
};

const uploadImageBase64 = (data, type) => {
	const base64Data = data.base64.split(',')[1];
	let fileName = Date.now() + '-' + data.path;
	fs.writeFile('src/public/imgs/' + type + '/' + fileName, base64Data, 'base64', (err) => {
		console.log(err);
	});
	return fileName;
};
module.exports = {
	uploadImg,
	uploadProductImgs,
	uploadImageBase64,
	encryptPassword,
	getPriceOrder,
	getTotalDiscountVoucher,
	getPriceOrderTotal
};
