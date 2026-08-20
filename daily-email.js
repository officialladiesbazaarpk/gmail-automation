// Netlify Scheduled Function: runs automatically every day at 9 AM UTC
// No URL needed — Netlify triggers this on the schedule below.

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

exports.handler = async () => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: 'Daily scheduled email',
      text: 'This email is sent automatically every day at 9 AM UTC.',
    });
    return { statusCode: 200, body: 'Scheduled email sent' };
  } catch (err) {
    console.error('Scheduled email error:', err);
    return { statusCode: 500, body: 'Failed to send scheduled email' };
  }
};

// Schedule: runs daily at 9:00 AM UTC. Change the cron expression to adjust timing.
exports.config = {
  schedule: '0 9 * * *',
};
