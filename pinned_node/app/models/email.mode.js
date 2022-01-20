const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "zanyscs@gmail.com",
        pass: "zanys@321*"
    }
});


module.exports = transporter;