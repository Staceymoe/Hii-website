# Hii Website MVP

Static one-page landing page for Hii, the Hybrid Intelligence Institute.

## What this is

This is a clean public front door for Hii. It is intentionally restrained, dark, credible, and research-institute oriented. It avoids founder-centered copy, medical claims, analytics, paid services, domain purchases, or public publishing actions.

## File structure

```text
Hii-website/
  index.html
  css/
    styles.css
  js/
    main.js
  assets/
    favicon.svg
    hii-earth.svg
    og-preview.svg
  docs/
    approval-checklist.md
  netlify.toml
  _headers
  robots.txt
  README.md
```

## Local preview

Open `index.html` directly in a browser, or run a local static server from this folder.

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Netlify deployment

GitHub connected deployment:

1. In Netlify, choose Add new site from Git.
2. Select `Staceymoe/Hii-website`.
3. Build command can stay blank.
4. Publish directory should be `.`.
5. Deploy the site.
6. Review the Netlify preview before connecting any custom domain.

## DNS connection for hii.earth

Do not change DNS until Cat approves the preview.

After approval:

1. In Netlify, open Site configuration.
2. Open Domain management.
3. Add custom domain `hii.earth`.
4. Add `www.hii.earth` as a domain alias if desired.
5. Netlify will provide DNS records.
6. At Njalla, update either nameservers to Netlify DNS or DNS records to point to Netlify.
7. Wait for DNS propagation.
8. Confirm HTTPS certificate is active inside Netlify.

Typical Netlify DNS records are:

```text
A record     @      75.2.60.5
CNAME        www    your-netlify-site-name.netlify.app
```

Netlify may provide different values. Use the values shown in the Netlify dashboard at the time of connection.

## Approval needed before publishing

Cat should approve:

- Final homepage copy
- Final Earth visual direction
- Whether to include the News nav item
- Whether `hello@hii.earth` exists or should stay removed
- Whether @HumanAIResearch is the correct public follow link
- Whether to add Waking ÆLYSIA anywhere later
- Whether to add analytics later
- Whether to publish under hii.earth

## Notes

No tracking analytics have been added.
No domain purchase has been made.
No DNS changes have been made.
The MVP is currently set to noindex until Cat approves public launch. Change the robots meta tag to index, follow and update robots.txt when the final domain is approved.
