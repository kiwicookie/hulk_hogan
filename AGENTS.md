# Repository Guidelines

## Project Structure & Module Organization

This repository is a small static birthday page. The main entry point is `index.html`, with all page styling in `style.css` and browser behavior in `script.js`. Visual assets live in `assets/`, currently including `sora.gif` and `birthday-cake.png`. There is no dedicated `src/` directory, build output directory, or test directory.

Keep new static assets under `assets/` and reference them with relative paths such as `assets/example.png`. Keep markup, presentation, and behavior separated across the existing three top-level files unless a feature becomes large enough to justify splitting.

## Build, Test, and Development Commands

No package manager or build step is required.

- Open `index.html` in a browser to run the page locally.
- Use browser DevTools to inspect layout, console errors, canvas behavior, and `localStorage`.
- Optional syntax check for JavaScript: `node --check script.js`.

Because the page uses only static files, avoid adding a framework, bundler, or dependency manager unless the project requirements change.

## Coding Style & Naming Conventions

Use two-space indentation in HTML, CSS, and JavaScript. Prefer semantic HTML sections and descriptive class names that match the UI role, such as `game-panel`, `memo-grid`, or `hero-actions`.

CSS should continue using custom properties in `:root` for shared colors and effects. Keep responsive rules close to the related layout rules where practical. JavaScript uses plain DOM APIs, `const`/`let`, camelCase variables, and small functions with direct names like `renderMemos()` and `drawGame()`.

## Testing Guidelines

There is no automated test suite. Validate changes manually in a desktop and mobile viewport. Check navigation anchors, memo add/delete/clear behavior, `localStorage` persistence, game start/reset, keyboard controls, touch controls, and console errors.

For visual changes, verify that Korean text remains readable and that assets load from `assets/` without broken paths.

## Commit & Pull Request Guidelines

This directory does not currently expose git history, so no local commit convention can be inferred. Use short, imperative commit messages, for example `Update game controls` or `Refine mobile layout`.

Pull requests should include a brief summary, manual test notes, and screenshots for visible UI changes. Mention any changes to stored data keys such as `hulk_page_birthday_memos` or `hulk_page_best_score`, since they affect existing browser data.
