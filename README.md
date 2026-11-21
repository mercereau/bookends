# Bookends

**Morning intentions and nightly reflections, one wellness check-in at a time.**

Live at **[bookends.day](https://bookends.day)**.

Bookends is a small, free journaling app. Each morning, you set an intention. Each evening, you look back on the day. Both check-ins walk through the eight dimensions of wellness one card at a time: emotional, physical, spiritual, social, intellectual, occupational, environmental and financial. Each card has a quick 1 to 5 rating and a short prompt.

The app has no accounts and no tracking, and it doesn't send your entries anywhere. Everything stays in your browser.

> If you're in crisis, call or text **988** (US) to reach the Suicide & Crisis Lifeline. Bookends is a journaling tool, not a substitute for care.

## Features

- **Two check-ins a day.** Morning adds a community prompt. Night adds a sleep-hygiene prompt and "What's one thing I'm proud of today?"
- **Check-in windows.** Each check-in is open only during its window, and you set the windows in Settings. Each window can be 1 to 8 hours. Past days are read-only. If you miss a day, the app says so gently, and that's it.
- **Badges and streaks** without guilt. You only see badges you've earned. Earning one means something nice happened, not that you're behind on the rest. There are also monthly badges, holiday badges and affirmation badges.
- **Daily affirmations**, three a day at most. If you keep coming back, the app nudges you to take a break from the screen. You can turn affirmations off, show them on the Today screen, or get a pop-up once a day.
- **Your week on the shelf.** Each day is a book, colored by which check-ins you did. Tap a book to see that day's highlights.
- **History.** Trends, past entries and a calendar.
- **Share with your provider.** Download a printable report with charts (HTML), or the same ratings as structured data (JSON). You choose the time period and whether notes are included.
- **Backup and restore** as a JSON file.
- **Installable** on a phone's Home Screen (web app manifest and icons), with light and dark themes.

## Privacy

Entries are saved in the browser's `localStorage` on the device. Nothing is sent to a server. The only thing the app fetches is `data/affirmations.json`, from this site.

| Key | What it holds |
| --- | --- |
| `ir_entries_v1` | Check-ins, plus affirmation history and preferences |
| `ir_prefs` | Preferences (check-in windows, how affirmations show up) |
| `ir_affirm_v1` | Today's affirmation count and visit count (for the take-a-break nudge) |
| `ir_visit` | In `sessionStorage`: keeps a reload from counting as a new visit |
| `ir_last_backup` | When you last downloaded a backup |

Clearing site data deletes your entries, so the app suggests downloading a backup now and then.

When the app runs as a Claude-hosted artifact (`window.claude` is present), it saves entries to that artifact's per-user store instead. Your entries go under `data/users/<your id>/`, and nobody else can read them. The code for this is the `CloudStore` / `LocalStore` adapter in `js/app.js`.

## Project structure

```
index.html              The single page: header, tabs, footer, font loading
css/styles.css          All styles, including dark mode and phone layouts
js/app.js               The whole app, in plain JavaScript with no dependencies
data/affirmations.json  Affirmations, suggestions and take-a-break messages
fonts/                  Self-hosted DM Sans and Fraunces (variable, Latin subset) + OFL licenses
favicon.*, icon-*.png, apple-touch-icon.png, site.webmanifest
_headers                Cloudflare security and caching headers
robots.txt
```

The site has no build step, no framework and no package.json. What's in the repo is what gets served.

## Running locally

Serve the folder over HTTP. If you open `index.html` straight from disk, the app can't load the affirmations file.

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

To test with realistic data, go to **Settings → Restore / import** and load a backup file.

## Deploying

The site is hosted on Cloudflare and connected to this GitHub repo. Every push to `main` deploys automatically.

- **Build command:** none
- **Output directory:** `/` (the repo root)

**Want to run your own copy?** [DEPLOYING.md](DEPLOYING.md) walks through forking the repo, connecting it to Cloudflare and adding your own domain.

### Cache busting

`index.html` loads the CSS and JS with a version number, such as `css/styles.css?v=37` and `js/app.js?v=39`. `_headers` tells browsers to cache those files for a year. **Whenever you change `css/styles.css` or `js/app.js`, bump its `?v=` number in `index.html`.** If you don't, returning visitors will keep the old file. `index.html` itself is never cached, so a new number takes effect on the next visit.

`data/affirmations.json` is cached for 5 minutes and doesn't need a version bump.

## Editing affirmations

`data/affirmations.json` has four parts:

```json
{
  "settings": { "dailyLimit": 3, "visitNudgeAfter": 5 },
  "affirmations": [
    {
      "id": "a001",
      "type": "affirmation",
      "text": "I'm allowed to feel this. It just doesn't get to drive.",
      "area": "emotional",
      "source": { "name": "…", "url": "https://…" }
    }
  ],
  "breakReminders": ["…"],
  "visitNudges": ["…"]
}
```

- `type` is `affirmation` or `suggestion`.
- `area` is optional. It's one of the eight wellness areas.
- `id` must be unique and must never be reused. Each person's affirmation history stores ids, so reusing one would mix up their history.
- Everyone sees the same three affirmations each day. The daily order is shuffled with the date as the seed.

## Data formats

**Backup** (`bookends-backup-YYYY-MM-DD.json`): an array of check-in records, plus one `meta_affirmations` record with your affirmation history. Restore reads the same format. Preferences are left out on purpose. The backup holds data only.

**Provider data** (`bookends-summary-YYYY-MM-DD.json`): one object with `period`, `scale`, `summary` (counts and averages), `questions` (the wording of every question and the labels at each end of its scale) and `days` (ratings, plus notes if you included them). It's built to make sense without the app.

## Contributing

Issues and pull requests are welcome, especially new affirmations. [CONTRIBUTING.md](CONTRIBUTING.md) covers creating a branch, adding affirmations and opening a pull request.

The short version of what to protect: **no guilt, no shame**, private by default, plain JavaScript with no build step, and it has to work well on a phone.

## License

The code is under the [MIT License](LICENSE). The written content (affirmations, About text), the Bookends name and the logo are not covered by MIT. See [CONTENT-LICENSE.md](CONTENT-LICENSE.md). The fonts are under the SIL Open Font License.
