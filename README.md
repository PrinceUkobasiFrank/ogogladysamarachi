# Gladys Ogo site

- `index.template.html` is the page. Don't edit `index.html`; it's generated into `dist/` by `build.js`.
- Editable content lives in `content/*.json` and is edited at `/admin` by Gladys.
- Netlify runs `node build.js` and publishes `dist/` (see `netlify.toml`).

## One-time setup
1. Create a private GitHub repo and upload all these files (images included).
2. Netlify > Add new site > Import from Git > pick the repo. Build settings are read from netlify.toml.
3. In `admin/config.yml`, set `repo:` to `username/reponame`.
4. GitHub > Settings > Developer settings > OAuth Apps > New. Homepage: your site URL. Callback: `https://api.netlify.com/auth/done`. Copy the Client ID and a new Client Secret.
5. Netlify > Site configuration > Access & security > OAuth > Install provider: GitHub, paste ID and secret.
6. Create a GitHub account for Gladys and add her as a collaborator on the repo.
7. She opens `yoursite/admin`, logs in with GitHub, edits and clicks Publish. The site rebuilds in about a minute.
