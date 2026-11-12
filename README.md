# CRYPTERRA — Vigenère Campaign

A cryptography adventure built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. All playable encryption and all Cipher Lab tools use **Vigenère**, a classical repeating-key substitution cipher.

## Gameplay

Three missions each contain two linked stages:

- **The Genesis Signal:** recover a keyword from a relay log and use a recovered key on a longer transmission.
- **Ghost in the Grid:** recover a Vigenère keyword from known plaintext, then decrypt an extended blackout instruction.
- **The Obsidian Vault:** assemble a long keyword from chronological evidence, then decrypt two Vigenère layers.

Cipher Lab offers Encode, Decode, and Recover key. Key recovery is analysis of Vigenère using K = C − P modulo 26. It produces a key segment; a complete keyword requires an aligned excerpt spanning its full period.

The double seal repeats Vigenère twice, with alignment starting at zero for each pass. This is a game challenge using the same cipher; repeated encryption does not imply modern cryptographic security.

Full decoded transmissions are required to verify each stage. Field notes and partial progress persist locally. This campaign uses `crypterra-progress-v3` and separate notes so earlier campaigns cannot unlock new puzzles automatically. Answer checksums are internal game validation, not an additional playable encryption method.

## Development and checks

```sh
npm ci
npm run dev
npm test
npm run typecheck
NEXT_PUBLIC_BASE_PATH=/crypterra npm run build
```

Tests cover Vigenère vectors, key recovery, all six mission chains, answer validation, and saved progress. GitHub Actions runs tests and builds before deploying.

## GitHub Pages

In Settings → Pages, set Source to GitHub Actions. Push to main to deploy, or run the Deploy CRYPTERRA workflow manually. Static output is generated in `out/`; the deployment workflow configures the repository base path.
