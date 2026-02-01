# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## SEO Updates

The frontend now includes several SEO improvements to improve discoverability and preview cards:

- Comprehensive meta tags are included in `frontend/index.html` (title, description, keywords, canonical).
- Open Graph and Twitter Card tags are present for improved social sharing.
- JSON-LD structured data (TravelAgency and WebSite schemas) included in `frontend/index.html`.
- Dynamic per-route SEO via `frontend/src/components/SEO.jsx` updates `document.title` and key meta tags on route change.
- Public assets added: `robots.txt`, `sitemap.xml`, and `site.webmanifest`.

If you deploy to a new domain, update canonical URLs and sitemap entries accordingly.
