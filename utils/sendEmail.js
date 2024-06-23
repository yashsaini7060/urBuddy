// const nodemailer = require('nodemailer');

import nodemailer from 'nodemailer';
const sendEmail = async (email, subject, message) => {

  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    }
  });

  // Configure the mailoptions object
  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: message, // html body
  };

  // Send the email
  await transporter.sendMail(mailOptions);

}

export default sendEmail;