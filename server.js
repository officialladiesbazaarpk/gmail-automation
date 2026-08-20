// Gmail Automation Server
// Does two things:
// 1. Sends an email when a website form is submitted (POST /send-email)
// 2. Sends a scheduled email automatically (cron job, once a day)

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ---- Gmail Transporter Setup ----
// Set GMAIL_USER and GMAIL_APP_PASSWORD as environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ---- 1. FORM SUBMIT -> SEND EMAIL ----
// Your website form should send a POST request to:
// https://your-server.com/send-email
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    // (a) Notification email to you
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // your own inbox
      subject: `New form submission: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    // (b) Auto-reply to the user (optional — remove if not needed)
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'We received your message',
      text: `Hi ${name},\n\nThanks for reaching out. We received your message and will get back to you soon.\n\nBest regards`,
    });

    res.json({ success: true, message: 'Email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
});

// ---- 2. SCHEDULED EMAIL ----
// Set your cron pattern here. Currently set to run every day at 9 AM.
// Cron format: minute hour day month weekday
cron.schedule('0 9 * * *', async () => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // change this if you want it sent elsewhere
      subject: 'Daily scheduled email',
      text: 'This email is sent automatically every day at 9 AM.',
    });
    console.log('Scheduled email sent:', new Date().toLocaleString());
  } catch (err) {
    console.error('Scheduled email error:', err);
  }
});

// ---- Health check ----
app.get('/', (req, res) => {
  res.send('Gmail automation server is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
