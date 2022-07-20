const express = require('express');
const bcrypt = require('bcrypt');
let saltRounds = 10;

const encryptPassword = async (password) => {
	try {
		let salt = await bcrypt.genSalt(saltRounds);
		let hash = await bcrypt.hash(password, salt);
		return hash;
	} catch (e) {
		console.log(e.message);
		return (code = '');
	}
	return code;
};

function checkPassword(hash, password) {
	bcrypt
		.compare(hash, password)
		.then((result) => {
			return result;
		})
		.catch((err) => {
			console.log(err);
		});
}

let a = async () => {
	const hash = await encryptPassword('12345678');
	console.log(hash);
};

a();
