const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "zanyscs@gmail.com",
        pass: "zanys@321*"
    }
});


module.exports = transporter;