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
- **Writing help.** Each question has a short hint about what to include, plus a few tap-to-add ideas picked at random ("Take a short walk", "Eat some fruit"). Emotional wellness adds a **feelings wheel**: pick up to three feelings and they're filled in for you. Using it earns a badge.
- **Skills.** A tab of short coping skills: grounding exercises (5-4-3-2-1, a color hunt, a categories game); skills adapted from Dialectical Behavior Therapy (DBT): STOP, paced breathing, paired muscle relaxation, self-soothing, ACCEPTS, IMPROVE, DEAR MAN, GIVE, FAST, Check the Facts, Opposite Action, Wise Mind, Ride the Wave and PLEASE; and skills adapted from Cognitive Behavioral Therapy (CBT): catch it, check it, change it, spotting thinking traps, worst/best/most likely, thought records, one small step, problem solving, worry time and facing fears one step at a time. There are also skills from Acceptance and Commitment Therapy (ACT): drop anchor, "I'm having the thought that...", leaves on a stream and moving toward what matters; self-compassion (a self-compassion break, talking to yourself like a friend); mindfulness (RAIN, body scan); body-based calming (double sigh, butterfly hug, looking around the room); and solution-focused therapy (0 to 10, when was it easier?). Each one walks you through a step at a time. After a low Emotional rating, Today shows a gentle link to them (you can turn this off). They're reminders, not therapy.
- **Daily affirmations**, three a day at most. If you keep coming back, the app nudges you to take a break from the screen. You can turn affirmations off, show them on the Today screen, or get a pop-up once a day.
- **Your week on the shelf.** Each day is a book, colored by which check-ins you did. Tap a book to see that day's highlights.
- **History.** Trends, past entries and a calendar.
- **Share with your provider.** Download a printable report with charts (HTML), or the same ratings as structured data (JSON). You choose the time period and whether notes are included.
- **Backup and restore** as a JSON file.
- **Installable** on a phone's Home Screen (web app manifest and icons), with light and dark themes.
- **Color-blind friendly mode** (Settings → Display): a palette based on Okabe & Ito, plus stripes on night marks, dashed night trend lines and check marks on answered steps, so color is never the only cue.

## Privacy

Entries are saved in the browser's `localStorage` on the device. Nothing is sent to a server. The only thing the app fetches is `data/affirmations.json`, from this site.

| Key | What it holds |
| --- | --- |
| `ir_entries_v1` | Check-ins, plus affirmation history and preferences |
| `ir_prefs` | Preferences (check-in windows, how affirmations show up, color mode) |
| `ir_affirm_v1` | Today's affirmation count and visit count (for the take-a-break nudge) |
| `ir_visit` | In `sessionStorage`: keeps a reload from counting as a new visit |
| `ir_last_backup` | When you last downloaded a backup |

Clearing site data deletes your entries, so the app suggests downloading a backup now and then.

## Accessibility

Bookends aims for WCAG 2.1 AA:

- Text and controls meet contrast minimums in light mode, dark mode and color-blind friendly mode.
- Pop-ups move keyboard focus inside, keep Tab within them, close with Esc and return focus to where you were.
- Focus is always visible, every control has a label, and headings follow a logical order.
- Text follows the phone's text size setting: iPhone's Text Size (Dynamic Type, via `-apple-system-body`), Android Chrome's font size (via `<meta name="text-scale">`) and Firefox's. Sizes use `rem`, and layouts stack instead of clipping at large sizes (the `text-l` and `text-xl` classes).
- Animations and confetti turn off when the device asks for reduced motion.
- Color is never the only way information is shown: icons, labels, stripes and check marks back it up.

Before a release, run an automated check such as [axe](https://www.deque.com/axe/) on each tab, open a check-in and a badge pop-up, and try the app with only a keyboard.

## Project structure

```
index.html              The single page: header, tabs, footer, font loading
css/styles.css          All styles, including dark mode and phone layouts
js/app.js               The whole app, in plain JavaScript with no dependencies
data/affirmations.json  Affirmations, suggestions and take-a-break messages
data/suggestions.json   Writing hints, tap-to-add ideas and the feelings wheel
data/skills.json        Coping skills (grounding, DBT, CBT, ACT and more) for the Skills tab
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
- `area` is optional. Use one of the eight wellness areas:

  | `area` | Covers |
  | --- | --- |
  | `emotional` | Feelings, stress, regulation |
  | `physical` | Movement, rest, sleep, nourishment |
  | `spiritual` | Values, purpose, grounding |
  | `social` | Relationships, connection, boundaries |
  | `intellectual` | Learning, curiosity, focus |
  | `occupational` | Work, routines, accomplishment |
  | `environmental` | Your space and surroundings |
  | `financial` | Money habits and awareness |

  You can also use `community`, for ways to support the people around you. It matches the morning check-in's community prompt. Leave `area` out if the affirmation fits every area.
- `id` must be unique and must never be reused. Each person's affirmation history stores ids, so reusing one would mix up their history.
- Everyone sees the same three affirmations each day. The daily order is shuffled with the date as the seed.

## Editing writing ideas

`data/suggestions.json` holds the help shown under each question in a check-in.

```json
{
  "settings": { "shown": 3 },
  "prompts": {
    "morning": {
      "physical_text": {
        "hint": "One simple thing for your body: move, rest, or nourish.",
        "ideas": ["Take a short walk", "Eat some fruit", "Take a 30-minute nap if I need it"]
      }
    }
  },
  "feelingsWheel": {
    "max": 3,
    "groups": [{ "core": "Joyful", "color": "#e3a53a", "feelings": ["happy", "grateful", "hopeful"] }]
  }
}
```

- `prompts` is keyed by check-in (`morning` or `night`), then by the question's id from `FORMS` in `js/app.js` (such as `physical_text` or `sleep_text`).
- `hint` replaces the placeholder in the text box.
- `pinned` (optional) ideas always show first, before the random ones. The closing question pins "I showed up for myself and filled out my Bookends".
- `ideas` are tap-to-add phrases. The app shows `shown` of them at random, and **More** swaps in others. Morning ideas are plans ("Take a short walk"); night ideas look back ("Went for a walk").
- `feelingsWheel.groups` are the colored sections of the wheel. Each feeling word should appear only once across all groups.
- A question with no entry just shows "Write freely… or skip". If the file is missing, the forms still work.

The file is cached for 5 minutes and doesn't need a version bump.

## Data formats

**Backup** (`bookends-backup-YYYY-MM-DD.json`): an array of check-in records, plus one `meta_affirmations` record with your affirmation history. Restore reads the same format. Preferences are left out on purpose. The backup holds data only.

**Provider data** (`bookends-summary-YYYY-MM-DD.json`): one object with `period`, `scale`, `summary` (counts and averages), `questions` (the wording of every question and the labels at each end of its scale) and `days` (ratings, plus notes if you included them). It's built to make sense without the app.

## Contributing

Issues and pull requests are welcome, especially new affirmations. [CONTRIBUTING.md](CONTRIBUTING.md) covers creating a branch, adding affirmations and opening a pull request.

The short version of what to protect: **no guilt, no shame**, private by default, plain JavaScript with no build step, and it has to work well on a phone.

## License

The code is under the [MIT License](LICENSE). The written content (affirmations, About text), the Bookends name and the logo are not covered by MIT. See [CONTENT-LICENSE.md](CONTENT-LICENSE.md). The fonts are under the SIL Open Font License.
