var nodemailer = require('nodemailer'); // khai báo sử dụng module nodemailer
const sendEmail = async (to, subject, content) => {
	var transporter = nodemailer.createTransport({
		// config mail server
		service: 'Gmail',
		auth: {
			user: 'thachbovjp@gmail.com',
			pass: 'egnkjkfrczrwzijf'
		}
	});
	var mainOptions = {
		// thiết lập đối tượng, nội dung gửi mail
		from: 'XXX STONE',
		to,
		subject,
		text: 'You recieved message from thachbovjp@gmial.com',
		html: `<p>${content}</p>`
	};

	let result = await transporter.sendMail(mainOptions);
	return result;
};

module.exports = sendEmail;
