# GE2340 Application

This directory contains the shared browser interface and desktop wrapper for linear regression and Jeffrey's grade classifier. The classifier is selected by default; use the model selector to compare both models.

| Folder | Purpose | Entry point |
|---|---|---|
| [demo/](demo/README.md) | Shared interface, prediction adapters and model data | [Open the browser demo](demo/index.html) |
| [desktop/](desktop/README.md) | Electron window controls, icon and Windows packaging | Run `npm start` from `app/desktop/` |

**Browser access (macOS, Windows and Linux):** [Open the online demo](https://wdffdw07.github.io/GradePrediction-CityuGE2340GP/), or download the [offline web ZIP](https://github.com/wdffdw07/GradePrediction-CityuGE2340GP/releases/download/v1.1.0/GE2340-Model-Explorer-1.1.0-Offline-Web.zip) from [Release v1.1.0](https://github.com/wdffdw07/GradePrediction-CityuGE2340GP/releases/tag/v1.1.0). Extract the ZIP completely and open `index.html` in a browser. Keep the extracted files together. Both models run locally in the browser; the offline package needs no installation, server or internet connection for predictions.

For a Windows desktop presentation, download the [portable Windows executable](https://github.com/wdffdw07/GradePrediction-CityuGE2340GP/releases/download/v1.1.0/GE2340-Model-Explorer-1.1.0-Windows.exe) from [Release v1.1.0](https://github.com/wdffdw07/GradePrediction-CityuGE2340GP/releases/tag/v1.1.0) and run it. A local copy is also available in the package root.

Edit the interface or add a trained classifier in `app/demo/`. Edit window behavior and packaging in `app/desktop/`. Both runtimes use the same interface. Existing model outputs remain in the package root's `outputs/` folder.

From the package root, refresh the embedded model and verify predictions:

```powershell
python app/demo/export_model.py
python app/demo/export_classifier.py
node app/demo/test-models.cjs
node app/demo/test-classifier.cjs
```

From the package root, set up and run the desktop app:

```powershell
cd app/desktop
npm ci
npm start
```

Install dependencies with `npm ci` on a fresh checkout. From `app/desktop/`, run `npm run test:desktop` to check the app or `npm run dist` to package it. Rebuild after editing the interface or adding a classifier.

The Windows build writes to the package root. The existing portable executable is self-contained and continues to work after source folders are reorganized.

## Publish the web demo and offline package

From the package root, run `python app/build_web.py`. This uses only Python's standard library and writes:

- `app/dist/site/`: static files for GitHub Pages, including data attribution and checksums.
- `app/dist/GE2340-Model-Explorer-1.1.0-Offline-Web.zip`: the standalone browser package.

The ZIP and site use the same HTML, CSS, JavaScript and embedded model data. The ZIP includes a short English start guide and data attribution. Build output is ignored by Git; upload the ZIP as a Release asset.

`.github/workflows/pages.yml` verifies both models, builds the site and deploys it from `main` when application files change. Pages uses GitHub Actions as its publishing source. The workflow can also be run manually from the Actions tab. It publishes only the generated browser files.
