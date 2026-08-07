#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
OUT="$ROOT/_frontdoor"
PART_BRANCH="agent/post-hero-site-build"
EXPECTED_SHA="04578b1acb1fe784474bfd56d8a4e52e73b85952d611137d18a1ae94a2d39156"

rm -rf "$OUT"
mkdir -p "$OUT/assets"

cp frontdoor/index.html "$OUT/index.html"
cp frontdoor/hero-front-door.css "$OUT/hero-front-door.css"
cp frontdoor/hero-front-door.js "$OUT/hero-front-door.js"
cp hii-film-1080p.mp4 "$OUT/hii-film-1080p.mp4"
cp hii-film-720p.mp4 "$OUT/hii-film-720p.mp4"
cp hii-film-poster.jpg "$OUT/hii-film-poster.jpg"

git fetch --quiet --depth=1 origin "$PART_BRANCH"
: > "$OUT/assets/hii-hero-front-door.b64"
for n in 00 01 02 03 04 05 06 07 08 09; do
  git show "FETCH_HEAD:site/media/hero-v4.preview-${n}.b64" >> "$OUT/assets/hii-hero-front-door.b64"
done

base64 --decode "$OUT/assets/hii-hero-front-door.b64" > "$OUT/assets/hii-hero-front-door.mp4"
rm "$OUT/assets/hii-hero-front-door.b64"

ACTUAL_SHA="$(sha256sum "$OUT/assets/hii-hero-front-door.mp4" | awk '{print $1}')"
SIZE="$(stat -c%s "$OUT/assets/hii-hero-front-door.mp4")"
echo "Hero diagnostic: bytes=$SIZE sha256=$ACTUAL_SHA"

if [[ "$ACTUAL_SHA" != "$EXPECTED_SHA" ]]; then
  echo "Hero checksum mismatch. Refusing to deploy."
  exit 2
fi
if [[ "$SIZE" -lt 200000 ]]; then
  echo "Hero file is incomplete. Refusing to deploy."
  exit 2
fi

echo "Clean Hii front door built. Checksum verified."
