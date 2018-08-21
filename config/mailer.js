var nodemailer = require('nodemailer');

module.exports = {
    send_email : function(toAddress, subject, text){
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'shivanitest14@gmail.com',
                pass: 'test@12345678'
            }
        });
        var mailOptions = {
            from: 'shivanitest14@gmail.com',
            to: toAddress,
            subject: subject,
            text: text
        };
        transporter.sendMail(mailOptions, (error, info) => {});
    }
};