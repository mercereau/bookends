# Contributing to Bookends

Thanks for wanting to help. Bookends is small on purpose, and contributions of all sizes are welcome: a new affirmation, a typo fix, a bug report or a new feature.

If you're planning something big, please [open an issue](https://github.com/mercereau/bookends/issues) first so we can talk it over before you put in the work.

## What Bookends cares about

Every change should keep these intact:

- **No guilt, no shame.** Copy never scolds, never counts what someone missed, and never makes a skipped day feel like failure.
- **Private by default.** No analytics, no third-party scripts, and no network requests that carry someone's entries.
- **Plain JavaScript.** No build step, no framework and no dependencies.
- **Works on a phone**, in both light and dark mode.

## 1. Get the code and create a branch

**First time:**

1. Click **Fork** on the Bookends GitHub page to get your own copy.
2. Clone your fork and add the original repo as `upstream`:

   ```sh
   git clone https://github.com/<you>/bookends.git
   cd bookends
   git remote add upstream https://github.com/mercereau/bookends.git
   ```

**For each change,** start from an up-to-date `main` and make a new branch:

```sh
git checkout main
git pull upstream main
git checkout -b add-affirmations-sleep
```

Give the branch a short name that says what it does, like `add-affirmations-sleep`, `fix-shelf-dark-mode` or `docs-deploy-typo`. Keep one topic per branch.

## 2. Run it locally

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. If you open `index.html` straight from disk, the app can't load the affirmations.

To test with realistic data, go to **Settings → Restore / import** and load a backup file. Don't commit backup files. `.gitignore` already blocks them.

## 3. Adding affirmations

Affirmations live in `data/affirmations.json`, in the `affirmations` list. There are two kinds:

- **`affirmation`**: something to tell yourself.
- **`suggestion`**: a small thing to try today.

### The format

```json
{
  "id": "a102",
  "type": "affirmation",
  "text": "I don't have to earn rest.",
  "area": "physical",
  "source": {
    "name": "Name of the organization or article",
    "url": "https://example.org/the-page-that-inspired-this"
  }
}
```

| Field | Rules |
| --- | --- |
| `id` | `a` + number for affirmations, `s` + number for suggestions. Use the next number after the highest one in the file. **Never reuse or renumber an id.** Each person's history stores ids, so changing one would mix up their past days. |
| `type` | `affirmation` or `suggestion` |
| `text` | One or two short sentences. Aim for under 90 characters. |
| `area` | Optional. One of `emotional`, `physical`, `spiritual`, `social`, `intellectual`, `occupational`, `environmental`, `financial`, `community`. Leave it out if the affirmation fits every area. |
| `source` | Required. The page that inspired it, from a reputable source on mental health or wellness, such as a hospital, university, government health agency or established nonprofit. |

Add new entries at the end of the list.

### How they should sound

- **Short, plain, upbeat, a little casual.** Write the way a kind friend talks, not like a poster.
- **First person** for affirmations ("I can…"). **A gentle, specific nudge** for suggestions ("Try…", "Step outside for…").
- **Original wording.** Put the idea from the source in your own words. Don't copy its sentences.
- **Doable today.** A suggestion should take minutes, cost nothing and need no special equipment.
- **No shoulds, no guilt.** Avoid "you should", "stop being…" and anything that sounds like a test.
- **No medical advice.** No diagnoses, medications or claims that something treats a condition.

| 👍 | 👎 |
| --- | --- |
| "Small steps still count as steps." | "You need to push harder to reach your goals!" |
| "Try putting your phone in another room for the first 20 minutes of the morning." | "Stop wasting your mornings on your phone." |

### Check your changes

Before you commit, make sure the file is valid JSON and every id is unique:

```sh
python3 -c "
import json, collections
d = json.load(open('data/affirmations.json'))
ids = [a['id'] for a in d['affirmations']]
dupes = [i for i, n in collections.Counter(ids).items() if n > 1]
missing = [a['id'] for a in d['affirmations'] if not a.get('source', {}).get('url')]
print('OK' if not dupes and not missing else f'Duplicate ids: {dupes}  Missing sources: {missing}')
"
```

Then reload the app. Everyone gets the same three affirmations each day, so you may not see your new ones right away. That's expected.

## 3b. Adding writing ideas

The tap-to-add ideas under each question live in `data/suggestions.json`, under `prompts` → `morning` or `night` → the question id. To add one, put a new phrase in that question's `ideas` list.

- **Short and doable:** a few words, something that takes minutes and costs nothing.
- **Match the check-in:** morning ideas are plans ("Take a short walk"); night ideas look back ("Went for a walk").
- **Write it as the person would:** "Text a friend", not "You should text a friend".
- **No guilt and no medical advice**, same as affirmations.

Check that the file is still valid JSON with `python3 -m json.tool data/suggestions.json > /dev/null && echo OK`.

## 4. Changing code or styles

- Whenever you edit `css/styles.css` or `js/app.js`, **bump its `?v=` number in `index.html`**. Browsers cache these files for a year, so without the bump, returning visitors keep the old version.
- Check the Today, History, Badges, Settings and About tabs at phone width (about 390px) and desktop width, in both light and dark mode.
- Open the browser console and make sure there are no errors.
- Don't add anything that loads from another site. `_headers` has a strict Content Security Policy that would block it anyway.

## 5. Commit and push

```sh
git add data/affirmations.json data/suggestions.json
git commit -m "Add 5 sleep and rest affirmations"
git push -u origin add-affirmations-sleep
```

Write commit messages in plain language that say what changed, such as "Add 5 sleep affirmations" or "Fix shelf spacing on small phones".

## 6. Open a pull request

1. Go to your fork on GitHub. You'll see a **Compare & pull request** button for the branch you just pushed. Click it.
2. Check that the base is `mercereau/bookends` on `main`, and the compare branch is your branch.
3. Fill in:
   - **Title:** what the PR does, e.g. "Add 5 sleep and rest affirmations".
   - **Description:** why the change helps. For affirmations, list the sources you used. For visual changes, include a screenshot from a phone and from a desktop.
4. Click **Create pull request**.

If you're asked for changes, push more commits to the same branch and the PR updates on its own. Once everything looks good, it gets merged and goes live on bookends.day with the next deploy.

## Reporting bugs and ideas

[Open an issue](https://github.com/mercereau/bookends/issues) and include:

- What you expected and what happened instead
- The device and browser, e.g. "iPhone 15, Safari, added to Home Screen"
- Steps to reproduce it

**Never paste your journal entries or a backup file into an issue.** Issues are public.

## Licensing your contribution

When you submit a pull request, you agree that:

- **Code** you contribute is released under the project's [MIT License](LICENSE).
- **Writing** you contribute, such as affirmations, can be used in Bookends as part of its content, which is covered by [CONTENT-LICENSE.md](CONTENT-LICENSE.md).

## Need help?

If you're stuck, or this is your first pull request, open an issue and ask. Everyone starts somewhere.
