# Noussayr Derbel Portfolio (Static)

This repository is now static-only.

## Current structure

- `index.html` - main portfolio page (single-file HTML/CSS/JS)
- `README.md` - project notes

## Local preview

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Deployment

Deploy the repository root as a static site (no build command, no framework runtime).

Compatible with:

1. GitHub Pages
2. Netlify
3. Vercel (static)
4. Any Nginx/Apache static hosting

## Roadmap

1. Add an admin page for managing content.
2. Migrate Medium content into this website (self-hosted article pages instead of external feed).

## Notes

- No Node.js dependencies are required now.
- The portfolio is production-ready as static HTML.
