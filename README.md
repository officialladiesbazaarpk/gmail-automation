# Gmail Automation Server

A small backend that does two things:
1. Sends an email when a website form is submitted
2. Sends a scheduled email once a day at a fixed time

## Step 1: Create a Gmail App Password

1. Turn on **2-Step Verification** on your Gmail account: https://myaccount.google.com/security
2. Then go here: https://myaccount.google.com/apppasswords
3. Give it a name (e.g. "Website Automation") and click **Create**
4. Copy the 16-character password shown (this is different from your normal Gmail password)

## Step 2: Set up the files

1. Rename `.env.example` to `.env`
2. Fill in your Gmail address and App Password:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
   ```

## Step 3: Install and run locally (for testing)

```bash
npm install
npm start
```

The server will run at `http://localhost:3000`.

## Step 4: Deploy to free hosting (so it works on your real site)

Localhost is only for testing — to actually use it, deploy it somewhere:

- **Render.com** (recommended, has a free tier) — connect your GitHub repo and deploy
- **Railway.app** — also has a free tier

On either platform, add the `.env` values under their "Environment Variables" section.

## Step 5: Connect it to your Wix site

When your Wix form is submitted, call this URL from JavaScript:

```javascript
fetch('https://your-server.onrender.com/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    message: formData.message
  })
});
```

In Wix, this goes in "Velo" (Wix's developer mode) on the form's submit event.

## Changing the scheduled email time

In `server.js`, find this line:
```js
cron.schedule('0 9 * * *', async () => {
```

`'0 9 * * *'` means "every day at 9:00 AM". Format:
`minute hour day month weekday`

Examples:
- `'0 18 * * *'` → every day at 6 PM
- `'*/30 * * * *'` → every 30 minutes
- `'0 9 * * 1'` → every Monday at 9 AM
