"""Build the Pages site and a reproducible offline ZIP with the same web files."""
from pathlib import Path
import hashlib
import json
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "app"
VERSION = json.loads((APP / "desktop/package.json").read_text(encoding="utf-8"))["version"]
NAME = f"GE2340-Model-Explorer-{VERSION}-Offline-Web"
FILES = (
    "index.html", "styles.css", "desktop.css", "desktop-bar.js",
    "model-data.js", "model-registry.js", "linear-adapter.js",
    "classifier-data.js", "classifier-adapter.js", "app.js",
)


def build():
    contents = {name: (APP / "demo" / name).read_bytes() for name in FILES}
    contents["DATA_LICENSE.md"] = (ROOT / "DATA_LICENSE.md").read_bytes()
    contents["README.txt"] = f"""GE2340 Model Explorer {VERSION} - Offline Web Demo

1. Extract this ZIP completely.
2. Open index.html in a browser (on Mac: right-click > Open With > Safari or Chrome).
3. Keep all extracted files together. Do not open index.html from inside the ZIP.

No installation, local server or internet connection is required for predictions.
The source-attribution links open external websites and require internet access.

Choose Grade classifier - Jeffrey or Linear regression, adjust the five daily
activities, and select Run prediction. The total must equal 24 hours; physical
activity fills the remaining hours by default. Reset example restores the sample.

Groups A/B/C/D/F are relative groups defined by this project's training dataset.
F means the lowest group, not an official failing grade. Classifier percentages
are model probabilities. The regression top percentage is an estimated position
within the training set, not a percentile for another school.

Online demo: https://wdffdw07.github.io/GradePrediction-CityuGE2340GP/
Source and documentation: https://github.com/wdffdw07/GradePrediction-CityuGE2340GP
Data attribution and terms: DATA_LICENSE.md
Checksums for the included files: SHA256SUMS.txt
""".encode("utf-8")
    contents[".nojekyll"] = b""
    for reference in re.findall(r'(?:src|href)="([^"]+)"', contents["index.html"].decode("utf-8")):
        if reference.startswith(("https://", "http://", "#")):
            continue
        assert reference.split("?")[0] in contents, f"Missing web asset: {reference}"
    contents["SHA256SUMS.txt"] = "".join(
        f"{hashlib.sha256(data).hexdigest()}  {name}\n"
        for name, data in sorted(contents.items())
    ).encode("utf-8")
    output = APP / "dist"
    site = output / "site"
    site.mkdir(parents=True, exist_ok=True)
    unexpected = {p.name for p in site.iterdir()} - contents.keys()
    if unexpected:
        raise RuntimeError(f"Unexpected files in {site}: {sorted(unexpected)}")
    for name, data in contents.items():
        (site / name).write_bytes(data)
    archive = output / f"{NAME}.zip"
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
        for name, data in sorted(contents.items()):
            info = zipfile.ZipInfo(f"{NAME}/{name}", date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            bundle.writestr(info, data)
    with zipfile.ZipFile(archive) as bundle:
        assert bundle.testzip() is None
        for name, data in contents.items():
            assert bundle.read(f"{NAME}/{name}") == data
    print(f"Site: {site}")
    print(f"Offline ZIP: {archive} ({archive.stat().st_size:,} bytes)")
    print(f"SHA-256: {hashlib.sha256(archive.read_bytes()).hexdigest()}")


if __name__ == "__main__":
    build()
