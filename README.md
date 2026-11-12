# CRYPTERRA

Interactive cryptography adventure built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

The application includes animated globe visuals, playable cipher missions, a Caesar cipher lab, treasure discovery, and browser-local progress.

## Development

```sh
npm ci
npm run dev
```

## GitHub Pages

Deployment uses static export. The production base path is `/crypterra`.

In repository **Settings → Pages**, choose **GitHub Actions** as the source.
The `Deploy CRYPTERRA to GitHub Pages` workflow builds and publishes each push to `main`.
For manual deployment, select the workflow in the Actions tab and click **Run workflow**.

To check the project path locally:

```sh
NEXT_PUBLIC_BASE_PATH=/crypterra npm run build
```
