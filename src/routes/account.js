import express from 'express';
import bcrypt from 'bcrypt';
import multer from 'multer';
import db from '../models';
import { createToken } from '../utils/middleware';
import { uploadImg, encryptPassword } from '../utils/functions';
import sendEmail from '../utils/mailer';
const accountRouter = express.Router();
// METHOD GET
//LOGIN
accountRouter.get('/login', async (req, res, next) => {
	let username = req.body.username,
		password = req.body.password;
	console.log({ file: req.files });
	// find account by username
	let account = await db.Account.findByPk(username);
	if (account) {
		// compare password and account password
		if (bcrypt.compareSync(password, account.password)) {
			delete account.password;
			var token = createToken(account);
			//
			let role = await db.Role.findByPk(account.roleID);
			let payload = {};
			if (role.dataValues.type === 'user') {
				payload = await db.User.findOne({ where: { username } });
				payload.dataValues.role = 'user';
			} else if (role.dataValues.type === 'employee') {
				payload = await db.Employee.findOne({ where: { username } });
				payload.dataValues.role = 'employee';
			}
			//create cookie respone on client Site use check login session
			res.cookie('token', token, {
				httpOnly: true
			});
			// res result account data
			res.status(200).json({ login: payload });
		} else res.status(401).json('invalid password!');
	} else res.status(401).json('username not found!');
});

// View reset password
accountRouter.get('/update-password/:username', async (req, res, next) => {
	let username = req.params.username;
	res.render('updatePassword.ejs', { username, message: '' });
});

// METHOD POST
// REGISTER
accountRouter.post('/register', uploadImg.array('avatar', 1), async (req, res, next) => {
	let username = req.body.username,
		password = await encryptPassword(req.body.password),
		roleType = req.body.role;
	console.log({ username, password, roleType });
	try {
		let role = await db.Role.findOne({ where: { type: roleType } });
		let account = { username, password, roleID: role.roleID };
		try {
			await db.Account.create(account);
		} catch (error) {
			return res.status(400).json('username existed!');
		}
		// create account type user
		if (role.type === 'user') {
			let email = req.body.email,
				fullName = req.body.fullName;
			let user = { fullName, username, email };
			//
			try {
				await db.User.create(user);
				res.status(201).json('created user!');
			} catch (err) {
				db.Account.destroy({
					where: {
						username
					}
				});
				console.log(err.message);
				res.status(400).json('email existed!');
			}
			// create account type employee
		} else if (role.type === 'employee') {
			console.log({ file: req.files[0] });
			let avatar = '/public/imgs/avatars' + req.files[0].filename,
				email = req.body.email,
				fullName = req.body.fullName,
				gender = req.body.gender,
				phoneNumber = req.body.phoneNumber,
				identification = req.body.identification,
				dateOfBirth = req.body.dateOfBirth;

			let employee = { avatar, email, fullName, gender, phoneNumber, identification, dateOfBirth, username };

			try {
				await db.Employee.create(employee);
				res.status(201).json('created employee!');
			} catch (err) {
				db.Account.destroy({
					where: {
						username
					}
				});
				console.log(err.message);
				res.status(400).json('email existed!');
			}

			res.json(employee);
		}
	} catch (err) {
		console.log({ mess: err.message, roleType });
		res.status(422).json('role type invalid!');
	}
});

// forget password
accountRouter.post('/reset-password', async (req, res, next) => {
	let email = req.body.email;
	let user = await db.User.findOne({ where: { email } });
	if (user) {
		// check
		try {
			await sendEmail(
				email,
				'ĐẶT LẠI MẬT KHẨU',
				`<b>Để đặt mật khẩu vui lòng click vào đường dẫn dưới!<b><br/><a href = "http://localhost:8081/api/v1/account/update-password/${user.username}">Reset password!</a>`
			);

			res.status(200).json(`Link update password received to email ${email} `);
		} catch (error) {
			console.log(error.message);
			res.status(500).json(error);
		}
	} else res.status(404).json('Email user not exist!');
});
// forget password
accountRouter.post('/update-password/:username', multer().array(), async (req, res, next) => {
	let username = req.params.username,
		password = req.body.password,
		confirmPassword = req.body['confirm-password'];

	if (password !== confirmPassword) {
		res.render('updatePassword.ejs', { message: 'Mật khẩu và nhập lại mật phải trùng nhau!', username: username });
	}
	{
		let ertPassword = await encryptPassword(password);
		try {
			db.Account.update(
				{ password: ertPassword },
				{
					where: {
						username
					}
				}
			);
			res.status(201).json('reset password success!');
		} catch (error) {
			res.status(500).json('update password failed!');
		}
	}
});
//
module.exports = {
	accountAPI: (app) => {
		return app.use('/api/v1/account/', accountRouter);
	}
};
