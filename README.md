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

## Campaign 02

Three missions now contain two linked layers each: Vigenère and columnar transposition; repeating-key XOR and Vigenère; Rail Fence followed by a double cipher seal. Players must recover keys from evidence and submit complete decoded transmissions.

Five algorithms are available in Cipher Lab. Field notes and partial mission progress persist in the browser. The new campaign uses a separate progress key (`crypterra-progress-v2`) so completed training missions do not skip the new puzzles.

Run `npm test` for known cipher vectors, invalid input handling, all six puzzle chains, answer verification, and progress validation. GitHub Actions runs these checks before publication.
