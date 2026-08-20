// Gmail Automation Server
// Do cheezein karta hai:
// 1. Website form submit hone pe email bhejta hai (POST /send-email)
// 2. Scheduled email bhejta hai (cron job se, roz ek fix time pe)

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ---- Gmail Transporter Setup ----
// GMAIL_USER aur GMAIL_APP_PASSWORD .env file me daalein
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ---- 1. FORM SUBMIT -> EMAIL BHEJNA ----
// Wix ya kisi bhi website ka form is URL pe POST request bhejega:
// https://aapka-server.com/send-email
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, aur message zaroori hain' });
  }

  try {
    // (a) Aapko notification email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // aapka apna email, jahan notification chahiye
      subject: `Naya form submission: ${name}`,
      text: `Naam: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    // (b) User ko auto-reply (optional — hata bhi sakte hain)
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Aapka message mil gaya',
      text: `Assalam o Alaikum ${name},\n\nAapka message humein mil gaya hai. Hum jald hi reply karenge.\n\nShukriya`,
    });

    res.json({ success: true, message: 'Email bhej diya gaya' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Email bhejne me masla hua', details: err.message });
  }
});

// ---- 2. SCHEDULED EMAIL ----
// Yahan cron pattern set karein. Abhi ye roz subah 9 baje chalega.
// Cron format: minute hour day month weekday
cron.schedule('0 9 * * *', async () => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // ya kisi aur ko bhejna hai to yahan badal dein
      subject: 'Roz ka scheduled email',
      text: 'Ye email automatically har roz 9 baje bheja ja raha hai.',
    });
    console.log('Scheduled email bhej diya gaya:', new Date().toLocaleString());
  } catch (err) {
    console.error('Scheduled email me error:', err);
  }
});

// ---- Health check ----
app.get('/', (req, res) => {
  res.send('Gmail automation server chal raha hai.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});
