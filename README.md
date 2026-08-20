# Gmail Automation (Netlify version)

This deploys two serverless functions to Netlify:

1. **send-email** — triggered by a form/API call
   URL: `https://YOUR-SITE.netlify.app/.netlify/functions/send-email`
2. **daily-email** — runs automatically every day at 9 AM UTC (no URL needed)

## Setup after deploying

1. In Netlify, go to **Site settings > Environment variables**
2. Add:
   - `GMAIL_USER` = your Gmail address
   - `GMAIL_APP_PASSWORD` = your 16-character Gmail App Password (no spaces)
3. Redeploy the site (Netlify usually does this automatically after adding env vars)

## Using it from your website

```javascript
fetch('https://YOUR-SITE.netlify.app/.netlify/functions/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    message: formData.message
  })
});
```

## Changing the scheduled email time

In `netlify/functions/daily-email.js`, find:
```js
exports.config = {
  schedule: '0 9 * * *',
};
```

Format: `minute hour day month weekday` (times are in UTC).
