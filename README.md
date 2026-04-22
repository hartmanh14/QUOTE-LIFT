# QuoteLift Starter

This is a beginner-friendly starter app for a simple SaaS idea:

- Target customer: cleaners, landscapers, and handymen
- Problem: they need faster quoting and simple lead follow-up
- Business model: monthly subscription

## Files

- `index.html` - landing page and demo app
- `styles.css` - visual design
- `app.js` - quote calculator and browser-based lead saving

## How to run

Because this version is plain HTML, you can open `index.html` directly in a browser.

If you want a local server later, one simple option is:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## What this MVP already does

- Explains the business idea
- Calculates quotes for different service types
- Saves demo leads in browser storage
- Shows a basic follow-up reminder workflow

## Best next upgrades

1. Add Stripe for subscriptions
2. Add Neon Postgres for real customer and lead storage
3. Add login for each business
4. Add SMS or email follow-up reminders
5. Add branded quote PDF export
