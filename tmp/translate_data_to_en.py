import json
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data"
TARGET = SOURCE / "en"
TARGET.mkdir(exist_ok=True)

# These values identify data or files rather than player-facing text.
SKIP_VALUE_FOR_KEYS = {"id", "img", "icon", "canonical", "num"}
cache = {}

def translate(text: str) -> str:
    if not text or text in cache:
        return cache.get(text, text)
    # The endpoint rejects long strings intermittently. Translate sentence-like
    # chunks so that descriptions with HTML remain readable and complete.
    if len(text) > 3200:
        parts, remaining = [], text
        while len(remaining) > 3200:
            cut = remaining.rfind(" ", 0, 3200)
            cut = cut if cut > 0 else 3200
            parts.append(remaining[:cut])
            remaining = remaining[cut:]
        parts.append(remaining)
        translated = "".join(translate(part) for part in parts)
        cache[text] = translated
        return translated
    query = urlencode({"client": "gtx", "sl": "pt", "tl": "en", "dt": "t", "q": text})
    url = "https://translate.googleapis.com/translate_a/single?" + query
    for attempt in range(5):
        try:
            with urlopen(url, timeout=30) as response:
                payload = json.loads(response.read().decode("utf-8"))
            translated = "".join(part[0] for part in payload[0] if part[0])
            break
        except (HTTPError, URLError) as error:
            if attempt == 4:
                raise RuntimeError(f"Could not translate: {text[:100]!r}") from error
            time.sleep(2 ** attempt)
    cache[text] = translated
    time.sleep(0.02)
    return translated

def walk(value, key=None):
    if isinstance(value, dict):
        return {k: walk(v, k) for k, v in value.items()}
    if isinstance(value, list):
        return [walk(item, key) for item in value]
    if isinstance(value, str):
        if key in SKIP_VALUE_FOR_KEYS or value.startswith(("./", "assets/")):
            return value
        return translate(value)
    return value

for source_path in [SOURCE / "blasphemies.json"]:
    with source_path.open(encoding="utf-8") as source_file:
        data = json.load(source_file)
    translated = walk(data)
    target_path = TARGET / source_path.name
    with target_path.open("w", encoding="utf-8", newline="\n") as target_file:
        json.dump(translated, target_file, ensure_ascii=False, indent=2)
        target_file.write("\n")
    print(f"Translated {source_path.name}")
