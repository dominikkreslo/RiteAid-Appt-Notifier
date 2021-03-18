const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
});

function sendEmail(locations){
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: process.env.TARGET_EMAIL,
		subject: 'Appointments available!',
		text: `There are appointments available at the following RiteAid locations: ${locations}`
	};
	
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

module.exports = sendEmail;
