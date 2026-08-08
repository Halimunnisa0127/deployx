const nodemailer = require('nodemailer');

// Use Ethereal Email for testing if no SMTP is provided
// In production, configure these in your .env file
const getTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate test account on the fly for development/testing
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = await getTransporter();
    
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"DeployX Support" <support@deployx.example.com>',
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    
    // Preview only available when sending through an Ethereal account
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Preview URL: %s', previewUrl);
    }
    
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

module.exports = {
  sendEmail,
};
