const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const multer = require('multer');
const publicKey = fs.readFileSync(path.join(path.dirname(__dirname), './key/public.crt'));

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

module.exports = {
	uploadImg,
	uploadProductImgs,
	encryptPassword
};
