# Deploying your own copy of Bookends

Bookends is a static site with no build step and no server. Any static host works. This guide uses **Cloudflare**, the host that runs [bookends.day](https://bookends.day). It takes about 15 minutes, and the free plan is enough.

## What you need

- A **GitHub account**, to hold your copy of the code
- A **Cloudflare account** (free)
- **Optional:** your own domain. Without one, your site lives at a free `*.pages.dev` or `*.workers.dev` address.

## 1. Fork the repo

1. On the Bookends GitHub page, click **Fork**.
2. Keep the default settings and create the fork. You now have your own copy at `github.com/<you>/bookends`.

## 2. Make it yours

The code is under the MIT License, so you're free to reuse it. The written content and branding aren't covered by MIT (see [CONTENT-LICENSE.md](CONTENT-LICENSE.md)). Before you publish, replace these:

| What | Where |
| --- | --- |
| Affirmations and suggestions | `data/affirmations.json` (see "Editing affirmations" in the README) |
| Writing hints, ideas and feelings wheel | `data/suggestions.json` (see "Editing writing ideas" in the README) |
| Coping skills | `data/skills.json` |
| About page text | `renderAbout()` in `js/app.js` |
| GitHub link on the About page | the `about-source` section in `js/app.js` |
| Name and logo | `index.html` (title, header and inline logo), `site.webmanifest`, `favicon.*`, `icon-*.png`, `apple-touch-icon.png` |

You can edit these right on GitHub (open a file and click the pencil icon) or in a local clone.

## 3. Connect the repo to Cloudflare

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com).
2. In the left sidebar, open **Compute & AI** and choose **Workers & Pages**.
   - If you don't see it, you may be inside a domain's settings. Click your account name at the top left to go back up a level.
   - You can also press **g** then **w** anywhere in the dashboard.
3. Click **Create**.
4. Choose **Import a repository**. On the **Pages** tab, this option is called **Connect to Git**.
5. If Cloudflare asks, connect your GitHub account and give it access to your `bookends` fork.
6. Select the repo and set:
   - **Project name:** `bookends`, or any name you like. It becomes part of your free address.
   - **Production branch:** `main`
   - **Build command:** leave it **empty**
   - **Build output directory:** `/`, or leave it empty if you're on the Workers screen
7. Click **Save and Deploy**.

A minute or so later, your site is live at `bookends.pages.dev` or `bookends.<your-subdomain>.workers.dev`. Cloudflare shows the exact address when the deploy finishes.

From now on, **every push to `main` deploys automatically.**

> **Workers vs. Pages:** depending on which screen you start from, Cloudflare creates either a *Pages* project (ending in `.pages.dev`) or a *Worker* (ending in `.workers.dev`). Either one works for Bookends.
>
> If you end up with a Worker, Cloudflare may open a pull request on your repo that adds a `wrangler.jsonc` config file. Merging it is fine.

## 4. Add your own domain (optional)

These steps assume your domain's nameservers already point to Cloudflare. To set that up, add the domain under **Domains → Add a domain** and follow the steps there.

1. Go to **Compute & AI → Workers & Pages** and click your project.
2. Add the domain:
   - **Pages project:** open the **Custom domains** tab, then **Set up a custom domain**.
   - **Worker:** open the **Domains** tab, then **Add → Custom domain**. On older layouts it's under **Settings → Domains & Routes**.
3. Enter your domain, such as `example.com`, and confirm. Cloudflare creates the DNS record and the HTTPS certificate for you, usually within a few minutes.

**If the domain won't activate,** an old DNS record is probably in the way. These are often parking records left by the registrar.

1. Open your domain in Cloudflare and go to **DNS → Records**.
2. Delete any **A**, **AAAA** or **CNAME** record named `@` or your bare domain.
3. Try adding the custom domain again.

## 5. Pick one address and redirect the rest

Each visitor's entries are saved in their browser, and browsers keep that storage separate for each exact address. Entries saved on `www.example.com` won't show up on `example.com`, and neither will entries saved on your `.pages.dev` address.

**Choose one address before anyone starts using the site,** and send everything else to it:

1. Add `www.example.com` as a second custom domain, the same way as step 4.
2. Open your domain in Cloudflare and go to **Rules → Redirect Rules**.
3. Create a rule from the **Redirect from WWW to root** template.

Leave Cloudflare's automatic HTTPS turned on. Some browser features the app uses only work over HTTPS.

## 6. Keep it updated

- **Changing CSS or JS:** whenever you edit `css/styles.css` or `js/app.js`, bump its `?v=` number in `index.html`. For example, change `js/app.js?v=43` to `js/app.js?v=44`. The `_headers` file tells browsers to cache those files for a year. If you skip the bump, returning visitors keep the old version.
- **Changing affirmations:** `data/affirmations.json` is only cached for 5 minutes, so it doesn't need a version bump.
- **Getting updates from the original:** on your fork's GitHub page, click **Sync fork**. If you've edited files that also changed in the original, GitHub will ask you to resolve the differences.

## Security headers

`_headers` sets a strict Content Security Policy: scripts, styles, fonts and data can only load from your own site.

If you add something that loads from another site, add that site's address to the policy in `_headers`, or the browser will block it. For example, Cloudflare Web Analytics needs `https://static.cloudflareinsights.com` added to `script-src`.

## Other ways to deploy

**Drag and drop:** In **Workers & Pages → Create → Pages**, choose **Drag and drop your files** and upload the folder. It's quick, but you'll have to upload again for every change, and the project can't be connected to Git later.

**Command line, with [Wrangler](https://developers.cloudflare.com/workers/wrangler/):**

```sh
npx wrangler login
npx wrangler pages deploy . --project-name=bookends
```

**Other hosts:** GitHub Pages, Netlify, Amazon S3 with CloudFront, or any web server will work. Serve the repo as-is.

Two things to know:

- Other hosts ignore `_headers`. Set the same caching and security headers in that host's own settings.
- Serve the site over HTTPS.

## A note on crisis resources

The footer and About page point to **988**, the US Suicide & Crisis Lifeline. If your audience is outside the US, change it to the right number for your region. Search for `988` in `index.html` and `js/app.js`.
