# Gmail Automation Server

Chhota backend jo do kaam karta hai:
1. Website form submit hone pe email bhejta hai
2. Roz ek fix time pe scheduled email bhejta hai

## Step 1: Gmail App Password banayein

1. Apne Gmail account me **2-Step Verification** on karein: https://myaccount.google.com/security
2. Phir yahan jayein: https://myaccount.google.com/apppasswords
3. Ek naam de dein (jaise "Website Automation") aur **Create** karein
4. 16-digit password milega — usko copy kar lein (ye normal Gmail password nahi hai, alag hai)

## Step 2: Files setup karein

1. `.env.example` ko `.env` naam se copy karein
2. Usme apna Gmail aur App Password daal dein:
   ```
   GMAIL_USER=aapka-email@gmail.com
   GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
   ```

## Step 3: Install aur run karein (apne computer pe test)

```bash
npm install
npm start
```

Server `http://localhost:3000` pe chalega.

## Step 4: Free hosting pe deploy karein (taake real site use kar sake)

Localhost sirf testing ke liye hai — asal use ke liye kisi free hosting pe daalna hoga:

- **Render.com** (recommended, free tier hai) — GitHub repo connect karke deploy karein
- **Railway.app** — bhi free tier deta hai

Dono jagah `.env` wali values ko unke "Environment Variables" section me dalna hoga.

## Step 5: Wix site se connect karein

Wix ke form submit hone pe is URL ko call karna hoga (JavaScript se):

```javascript
fetch('https://aapka-server.onrender.com/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    message: formData.message
  })
});
```

Wix me ye code "Velo" (Wix ka developer mode) ke through form submit event pe lagana hoga.

## Scheduled email ka time badalna

`server.js` me ye line dhoondhein:
```js
cron.schedule('0 9 * * *', async () => {
```

`'0 9 * * *'` ka matlab hai "roz subah 9:00". Iske format:
`minute hour day month weekday`

Misalein:
- `'0 18 * * *'` → roz shaam 6 baje
- `'*/30 * * * *'` → har 30 minute me
- `'0 9 * * 1'` → har Monday subah 9 baje
