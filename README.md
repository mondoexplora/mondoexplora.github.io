# MondoExplora (pruebatravel) Deployment Notes

**Production Deployment:**
- The site is deployed on Netlify at https://mondoexplora.com
- All dynamic routes (e.g., `/route/<origin>/<destination>`) are handled by Netlify Functions (JavaScript) in `netlify/functions/`
- The Flask server is used **only for local development** and prototyping
- For any production bug, route, or deployment issue, debug the Netlify Functions, not Flask

---

# pruebatravel