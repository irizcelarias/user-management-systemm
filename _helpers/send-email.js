const nodemailer = require('nodemailer');
const config = require('../config');

module.exports = sendEmail;

async function sendEmail({ to, subject, html, from = config.emailFrom }) {
    console.log(`Email would be sent to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${html}`);

}