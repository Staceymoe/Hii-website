#!/usr/bin/env bash
set -euo pipefail

OUT="_restart"
HERO_ID="1nP5pjCQu9C3my8XzaXM3efezniWOpe3x"
FILM_ID="1-Wk9qeBHHrewC-XlIDf3mivOAauRXOiw"
MOBILE_FILM_ID="1v9yC1ndGvngSIE-SAk1fZ9ABfYxLLmYM"
HERO_SHA="e9054efa1eea286e74e50d76ddcb7e436cb2fe733b3a968553da5451de9f904e"
FILM_SHA="76e000d4d1e8e4e31a45d4f0bcbc412b286c4ac9524ed8fa8e84e145f3475abc"
MOBILE_FILM_SHA="f5b1f899f442fd76283ae47f1332a975b3ce2d625da4f453ed990b1289393b6d"

rm -rf "$OUT"
mkdir -p "$OUT/media"
cp restart-front-door/index.html "$OUT/index.html"
cp restart-front-door/front-door.css "$OUT/front-door.css"
cp restart-front-door/front-door.js "$OUT/front-door.js"

python -m pip install --quiet --disable-pip-version-check gdown

gdown "https://drive.google.com/uc?id=${HERO_ID}" -O "$OUT/media/hii-hero-front-door-approved.mp4"
gdown "https://drive.google.com/uc?id=${FILM_ID}" -O "$OUT/media/hii-film-approved-web-1080p.mp4"
gdown "https://drive.google.com/uc?id=${MOBILE_FILM_ID}" -O "$OUT/media/hii-film-mobile-vertical.mp4"

ACTUAL_HERO_SHA="$(sha256sum "$OUT/media/hii-hero-front-door-approved.mp4" | awk '{print $1}')"
ACTUAL_FILM_SHA="$(sha256sum "$OUT/media/hii-film-approved-web-1080p.mp4" | awk '{print $1}')"
ACTUAL_MOBILE_FILM_SHA="$(sha256sum "$OUT/media/hii-film-mobile-vertical.mp4" | awk '{print $1}')"

if [[ "$ACTUAL_HERO_SHA" != "$HERO_SHA" ]]; then
  echo "Approved Hii hero checksum mismatch. Refusing to publish preview."
  exit 2
fi
if [[ "$ACTUAL_FILM_SHA" != "$FILM_SHA" ]]; then
  echo "Approved Hii Film checksum mismatch. Refusing to publish preview."
  exit 2
fi
if [[ "$ACTUAL_MOBILE_FILM_SHA" != "$MOBILE_FILM_SHA" ]]; then
  echo "Approved mobile Hii Film checksum mismatch. Refusing to publish preview."
  exit 2
fi

test "$(stat -c%s "$OUT/media/hii-hero-front-door-approved.mp4")" -gt 2000000
test "$(stat -c%s "$OUT/media/hii-film-approved-web-1080p.mp4")" -gt 15000000
test "$(stat -c%s "$OUT/media/hii-film-mobile-vertical.mp4")" -gt 30000000

echo "Hii restart front door verified. Approved desktop and mobile media staged."
