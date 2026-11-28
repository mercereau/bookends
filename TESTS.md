# Testing Bookends

Bookends has no build step and no test suite. These are the checks to run by hand before you open a pull request or deploy.

You don't need to run every section for every change. Always run **Before every change** and **Your data is safe**, then the sections for the parts you touched. Before a release, run all of it.

## Setup

1. Run the site locally (see [CONTRIBUTING.md](CONTRIBUTING.md)):

   ```sh
   python3 -m http.server 8000
   ```

2. Test in two browser profiles:
   - **A fresh profile** (or a private window), to see what a new person sees.
   - **A profile with real-looking data.** Load a backup with **Settings → Restore / import**. Use a backup that has a few weeks of check-ins, skills and daily logs.
3. Keep the browser's developer tools open on the **Console** tab. Any red error is a failure.
4. Test on a phone-sized screen (about 390 px wide) and on a desktop width.

**Tip:** check-in windows and "today" depend on the clock. To test another time of day, change the windows in Settings rather than your computer's clock.

## Before every change

- [ ] The site loads with no errors in the Console.
- [ ] If you changed `js/app.js` or `css/styles.css`, you bumped its `?v=` number in `index.html` (and in `404.html` for the stylesheet). Without that, people keep the old file.
- [ ] Today, History, Skills, Settings and About all open.
- [ ] Reload the page. Nothing you entered is gone.

## Your data is safe

People's entries live only in their browser. A bug here can lose someone's journal, so test this every time.

- [ ] Start from a profile with data saved by the **current live version** (bookends.day or `main`). Switch to your branch and reload. Every check-in, skill, daily log, badge and setting is still there.
- [ ] **Settings → Download a backup**, then **Delete all entries**, then **Restore / import** that backup. Everything comes back, including daily logs and their setup.
- [ ] Importing a backup into a profile that already has data keeps everything else. Only entries with the same date and type are replaced.
- [ ] Old backups (from earlier versions) still import.
- [ ] If you changed how anything is saved, older saved data is converted, not dropped.

## Privacy

- [ ] In developer tools, open the **Network** tab and use the app for a few minutes. Every request goes to the same site (the page, `css/`, `js/`, `data/`, `fonts/`). Nothing goes to another server.
- [ ] No entry text appears in the page address or the page title.
- [ ] Sensitive daily log sections (safety, self-harm urges, appetite, medication, substance use) stay out of both downloads unless **Include sensitive information** is turned on.

## First visit

In a fresh profile:

- [ ] The welcome pop-up appears once. **Get started** closes it and earns **First Steps**.
- [ ] It doesn't come back after a reload.
- [ ] A profile that already has check-ins never sees it.

## Check-ins

- [ ] Morning and night each open only inside their window. Outside the window, the app explains when it opens.
- [ ] You can tap through every card with just ratings. Writing stays tucked behind **Add a note**.
- [ ] **Always show writing questions** in Settings opens every note.
- [ ] Tap-to-add ideas fill in the note. The feelings wheel allows up to three feelings.
- [ ] Saving shows the right badges and confetti (no confetti with reduced motion turned on).
- [ ] Editing a check-in later in the same window keeps your earlier answers.
- [ ] Past days are read-only.

## Skill suggestions

- [ ] Rate any area 1 or 2 and save. One skill card appears on Today, not as a pop-up.
- [ ] With several low areas, it picks the lowest. Ties go Emotional, then Social, then Spiritual and Physical, then the rest.
- [ ] Tapping the skill opens it and clears the card. **Not now** clears the card.
- [ ] Changing either check-in afterward brings the card back and restarts the one-hour clock.
- [ ] The card goes away an hour after the latest save.
- [ ] History shows the suggestion and whether it was tried, dismissed or ignored.
- [ ] Trying a suggested skill the first time earns **Showed Up Anyway**.
- [ ] Turning suggestions off in Settings hides the card.

## Skills

- [ ] Every skill opens and steps forward and back.
- [ ] At the end, "Did it help?" saves, with an optional note.
- [ ] Skills that helped show in **What's helped me** (top 3) and as tags in History.
- [ ] Skill badges appear when earned.
- [ ] If you edited `data/skills.json`, it's still valid JSON and every skill has an `id`, a name and steps.

## Daily log

### The box on Today

- [ ] Before setup, Today shows **Set up your daily log** above the skill link, styled like the skill link.
- [ ] After setup, it shows **Fill in today's daily log**. After logging, it shows **Daily log done for today ✓**.
- [ ] Turning **Daily log** off in Settings hides the box. Turning it back on brings it back.

### Setup

- [ ] Every section starts on. **Target behaviors** is listed first.
- [ ] Turning it on shows **+ Add a behavior**. Adding a name lists it with an on/off switch and **Delete**.
- [ ] A behavior's name can't be edited after it's added.
- [ ] You can't add the same name twice.
- [ ] Only 3 behaviors can be on at once. A 4th is added turned off, and turning it on is blocked with a message.
- [ ] **Cancel** throws away changes. **Save** keeps them.
- [ ] Every section can be turned on and off. Urges, Appetite, Safety, Medication and Substance use are marked **🔒 Sensitive**, with a note that they're shared only if you choose.

### Logging

- [ ] The log steps through one section at a time, like the check-ins, starting with Target behaviors, then Thoughts, Mood and Urges. Target behaviors is skipped when no behaviors are turned on. Only the sections you turned on appear, and only the behaviors that are on.
- [ ] **Next** and **← Back**, the section icons at the top, and the ← and → keys all move between sections. "Section 2 of 7" matches.
- [ ] A section's icon is marked once anything in it is answered.
- [ ] The last section shows **Save today's log** (or **Save changes**). When editing, **Save changes now** works from any section.
- [ ] Closing with ✕ or Esc after changing something asks before discarding.
- [ ] Saving with nothing answered closes the log with "Nothing to save, so nothing was changed."
- [ ] The log looks like the check-ins: a date line in the header, section icons across the top, and ratings and Yes/No buttons that span the full width with what 0 and 5 mean underneath. Every rating is 0 to 5, on one row at phone width. Ratings can be tapped and tapped again to clear.
- [ ] **Nothing to report** works for a section.
- [ ] Sleep and Appetite show a checklist ("Check all that apply") with a box that fills with ✓, and more than one can be checked.
- [ ] Hours of sleep is a slider from 0 to 12+, in half hours. It says **Not answered** until you move or tap it, shows the hours as you drag, and **Clear** resets it. The ← and → keys move it.
- [ ] Skills tried for a behavior can be added and removed.
- [ ] Saving shows badges. Reopening the log shows your answers.
- [ ] A past day's log opens read-only from History.

### Safety

- [ ] Logging thoughts of suicide or of hurting someone above zero shows **Please reach out** with 988 instead of the badge celebration.
- [ ] Today then shows crisis support under the daily log box.
- [ ] Self-harm urges, appetite and substance answers show the matching support lines.
- [ ] The wording is honest that nobody is notified.

### History and downloads

- [ ] History shows a 📓 Daily log row for the day and the answers in the day view.
- [ ] Delete a behavior after logging it. Past days still show its name.
- [ ] Both downloads include the daily log. Sensitive sections appear only with **Include sensitive information** on. That switch shows once the daily log is set up.

### Badges

- [ ] Setup, first log, streaks (3, 7, 14, 30 and up), logging skills, a full day and coming back after a break all earn badges.
- [ ] No badge depends on what someone wrote or how they rated anything.

## History

- [ ] The shelf, trends, calendar and day view all show the right days.
- [ ] Days with only a daily log, only skills, or only a visit still appear.
- [ ] Badges show only once earned.

## Downloads

- [ ] **Report for your provider** opens, prints cleanly, and covers the chosen time period.
- [ ] **Data file for AI or your provider** downloads one Markdown file. The JSON inside is valid, times are in UTC, and the guide from `data/insights-guide.md` is included.
- [ ] With **Include my written notes** off, nothing typed is in either download.
- [ ] Downloading the data file earns **Curious Mind**.

## Affirmations

- [ ] Each mode works: off, on Today, and a pop-up once a day.
- [ ] No more than three show in a day, and the take-a-break nudge appears after many visits.
- [ ] If you edited `data/affirmations.json`, it's still valid JSON and every entry has a unique `id`.

## Settings and display

- [ ] Light and dark themes, and color-blind friendly mode, all look right on every tab.
- [ ] Large text sizes (phone settings or browser zoom to 200%) stack instead of clipping.
- [ ] **Delete all entries** asks first, then removes everything, including daily logs and their setup.

## Accessibility

- [ ] Run [axe](https://www.deque.com/axe/) on each tab, with a check-in open, the daily log setup and form open, and a badge pop-up open. No WCAG 2.1 AA violations.
- [ ] Use the whole app with only a keyboard. Focus is always visible.
- [ ] Pop-ups and sheets trap focus, close with Esc, and return focus to where you were.
- [ ] Try a screen reader (VoiceOver or TalkBack) on a check-in and the daily log. Every control is announced with a label.
- [ ] With reduced motion turned on, nothing animates.

## The 404 page

- [ ] Visit a page that doesn't exist (for example `/nope`). The Bookends 404 page shows, styled, with a link home.
- [ ] Locally, `python3 -m http.server` doesn't use the 404 page. Check this on a Cloudflare preview deploy.

## After deploying

- [ ] Open bookends.day in a normal window. The new `?v=` numbers load (check the Network tab).
- [ ] Data saved before the deploy is still there.
- [ ] Add it to a phone's Home Screen and open it from there.
