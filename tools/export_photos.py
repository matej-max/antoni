"""Export vybraných profi fotiek do WebP (640/1080/1600, hero aj 2200).

Výstup: web/assets/img/<slug>-<šírka>.webp + manifest.json (rozmery, zdroj).
Zdrojové fotky: sezónne fotenie à la carte (máj 2026) a fotky Kačacích hodov.
"""
import json, os, sys
from PIL import Image, ImageOps

A = "/Users/mj/Desktop/PROJEKTY/antoni/2026/05 - maj/A la carte 2026 - fotky"
K = "/Users/mj/Desktop/PROJEKTY/antoni/2026/redesign/kacie hody"
OUT = os.path.join(os.path.dirname(__file__), "..", "web", "assets", "img")

def a(n): return f"{A}/A740{n}.jpg"

PHOTOS = {
    # slug: (zdroj, extra šírky)
    "stol-hore": (a(8566), [2200]),
    "stol-hore-siroky": (a(8549), [2200]),
    "stol-ruky": (a(8601), [2200]),
    "stol-ruky-2": (a(8614), []),
    "spolocny-stol": (a(8587), []),
    "spolocny-stol-siroky": (a(8591), [2200]),
    "prichod": (a(8666), []),
    "aperitiv-negroni": (a(8894), []),
    "aperitiv-ruka": (a(8815), []),
    "espresso-martini": (a(8898), []),
    "kokteily": (a(8921), []),
    "kokteil-coupe": (a(8713), []),
    "arancini": (a(7848), []),
    "fazulovica": (a(8274), []),
    "kacacie-prsia": (a(7898), []),
    "kacacie-prsia-vino": (a(7888), []),
    "losos": (a(8013), []),
    "panenka": (a(8369), []),
    "panenka-vino": (a(8382), []),
    "penne-krevety": (a(8038), []),
    "kuracie-gnocchi": (a(8235), []),
    "jelenie-stehno": (a(7837), []),
    "rib-eye": (a(8480), []),
    "steak-krajanie": (a(8540), []),
    "smash-burger": (a(7928), []),
    "kuraci-burger": (a(7815), []),
    "burger-ruky": (a(7941), []),
    "fajitas": (a(7976), []),
    "linguine-losos": (a(8217), []),
    "risotto": (a(7886), []),
    "kravska-hrudka": (a(8137), []),
    "hrudka-syr": (a(8161), []),
    "pizza": (a(8299), []),
    "pizza-jedenie": (a(8319), []),
    "pizza-podavanie": (a(8308), []),
    "creme-brulee": (a(8417), []),
    "brulee-kava": (a(8435), []),
    "brulee-ruka": (a(8460), []),
    "buchta-red": (a(8114), []),
    "buchta-black": (a(8125), []),
    "vino": (a(8936), []),
    "tatarak": (f"{A}/01-01-tatarak.jpg", []),
    "gulas": (f"{A}/02-02-gulas.jpg", []),
    "flank-steak": (f"{A}/flank-steak.jpg", []),
    "udon": (f"{A}/udon-teryiaki-rezance-min-1.jpg", []),
    "kacacie-hody-misa": (f"{K}/image0.jpeg", []),
    "kacacie-hody-stehno": (f"{K}/image1.jpeg", []),
    "kacacie-hody-prsia": (f"{K}/image2.jpeg", []),
    "kacacie-hody-lokse": (f"{K}/image3.jpeg", []),
    "kacacie-hody-pastetka": (f"{K}/image4.jpeg", []),
    "kacacie-hody-pastetka-2": (f"{K}/image5.jpeg", []),
}

os.makedirs(OUT, exist_ok=True)
manifest = {}
only = set(sys.argv[1:])
for slug, (src, extra) in PHOTOS.items():
    if only and slug not in only:
        continue
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    W, H = im.size
    widths = sorted({w for w in [640, 1080, 1600, *extra] if w <= W} or {W})
    for w in widths:
        h = round(H * w / W)
        im.resize((w, h), Image.LANCZOS).save(f"{OUT}/{slug}-{w}.webp", "WEBP", quality=78, method=6)
    manifest[slug] = {"w": W, "h": H, "widths": widths, "source": os.path.basename(src)}
    print(slug, W, H, widths, flush=True)

with open(f"{OUT}/manifest.json", "w") as fh:
    json.dump(manifest, fh, indent=1, ensure_ascii=False)
