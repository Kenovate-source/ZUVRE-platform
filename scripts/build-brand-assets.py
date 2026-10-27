#!/usr/bin/env python3
"""
Builds the optimized web derivatives of ZUVRE's canonical brand assets.

ORIGINALS ARE NEVER MODIFIED. They are copied verbatim into brand/source/
and every derivative below is written to apps/web/public/brand/ (or the
Next.js app/ icon locations). Re-run any time the originals change:

    python3 scripts/build-brand-assets.py "/path/to/ZUVRE Branding Assets"

Requires Pillow (with WebP) and numpy. Derivative kinds, per the Canonical
Asset & Brand Authority Map:
  * optimized exports of standalone canonical files (logo, mark, wordmark,
    Zuri master) -- cropped to visible bounds, resized + WebP-encoded only;
    Zuri stays OPAQUE (the source has no transparency and none is invented)
  * CROPS of approved panels from the Background/Decorative composite
    sheets. These sheets are REFERENCE material, not production masters:
    the crops are ~500 px wide, so the site uses them only as soft,
    feathered, low-opacity ambient layers. Replace with production
    3840x2160 masters when they exist. Decorative overlays additionally get
    luminance-to-alpha so their dark-teal "black" becomes truly transparent.
    The invalid "Light Mode Environments" panel is deliberately never used.
  * favicon/app icons derived from the canonical Logo Mark Symbol.
"""
import os, shutil, sys
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else "ZUVRE Branding Assets"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "apps/web/public/brand")
APP = os.path.join(ROOT, "apps/web/src/app")
SRC_KEEP = os.path.join(ROOT, "brand/source")

def p(*a): return os.path.join(SRC, *a)
def out(*a):
    path = os.path.join(PUB, *a); os.makedirs(os.path.dirname(path), exist_ok=True); return path

# --- 1. preserve the originals we depend on, byte-for-byte -----------------
ORIGINALS = [
    ("LOGO SYSTEM", "ZUVRE Primary Logo.png"),
    ("LOGO SYSTEM", "ZUVRE Logo Mark  Symbol.png"),
    ("LOGO SYSTEM", "ZUVRE Wordmark.png"),
    ("ZURI", "Zuri - Master Character.png"),
    ("BRAND VISUALS", "ZUVRE Background  Texture Elements.png"),
    ("BRAND VISUALS", "ZUVRE Decorative  Atmospheric Elements.png"),
]
for folder, name in ORIGINALS:
    dst = os.path.join(SRC_KEEP, folder); os.makedirs(dst, exist_ok=True)
    shutil.copy2(p(folder, name), os.path.join(dst, name))

def webp(im, path, q=88, **kw):
    im.save(path, "WEBP", quality=q, method=6, **kw)
    print(f"  {os.path.relpath(path, ROOT):62} {im.size} {os.path.getsize(path)//1024} KB")

def resize_w(im, w):
    if im.width <= w: return im.copy()
    return im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)

# --- 2. canonical standalone files: crop to bounds + resize + encode -------
primary = Image.open(p("LOGO SYSTEM", "ZUVRE Primary Logo.png")).convert("RGBA")
mark    = Image.open(p("LOGO SYSTEM", "ZUVRE Logo Mark  Symbol.png")).convert("RGBA")
word    = Image.open(p("LOGO SYSTEM", "ZUVRE Wordmark.png")).convert("RGBA")
zuri    = Image.open(p("ZURI", "Zuri - Master Character.png")).convert("RGB")

def tight(im, pad=0):
    bb = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    return im.crop((max(bb[0]-pad,0), max(bb[1]-pad,0), min(bb[2]+pad,im.width), min(bb[3]+pad,im.height)))
primary_t, mark_t, word_t = tight(primary), tight(mark), tight(word)
webp(resize_w(primary_t, 1000), out("logo", "zuvre-logo-primary-1000.webp"), 92)
webp(resize_w(primary_t, 420),  out("logo", "zuvre-logo-primary-420.webp"), 92)
webp(resize_w(mark_t, 512),     out("logo", "zuvre-logo-mark-512.webp"), 92)
webp(resize_w(mark_t, 160),     out("logo", "zuvre-logo-mark-160.webp"), 92)
webp(resize_w(word_t, 1000),    out("logo", "zuvre-wordmark-1000.webp"), 92)
webp(resize_w(zuri, 900),       out("zuri", "zuri-master-900.webp"), 86)

# --- 3. approved atmospheric panels (crops of reference sheets) ------------
bg  = Image.open(p("BRAND VISUALS", "ZUVRE Background  Texture Elements.png")).convert("RGB")
dec = Image.open(p("BRAND VISUALS", "ZUVRE Decorative  Atmospheric Elements.png")).convert("RGB")
ENV = {  # name: (sheet, box) -- boxes sit INSIDE panel frames/labels
    "env-deep":   (bg,  (22, 199, 533, 391)),    # Deep Atmospheric Backgrounds
    "env-nebula": (bg,  (22, 1196, 493, 1403)),  # Dark Mode Environments
    "env-depth":  (bg,  (566, 730, 998, 900)),   # Spatial Depth Layers
    "env-glow":   (bg,  (566, 197, 998, 390)),   # Gradient Fields
}
for name, (sheet, box) in ENV.items():
    webp(sheet.crop(box), out("environment", f"{name}.webp"), 88)

DECOR = {
    "decor-flow-paths":   (dec, (500, 424, 1004, 596)),
    "decor-orbital-core": (dec, (316, 210, 468, 314)),
}

def luminance_to_alpha(im, black=0.12, white=0.55):
    """The panels' 'black' is really dark teal (~RGB 8,22,25), so blend modes
    leave a visible rectangle. Convert brightness to alpha instead: the dark
    haze becomes fully transparent, the luminous gold/teal lines keep their
    colour and opacity. Applied ONLY to these derivative overlays."""
    import numpy as np
    rgb = np.asarray(im.convert("RGB")).astype("float32") / 255.0
    lum = rgb.max(axis=2)
    alpha = np.clip((lum - black) / (white - black), 0.0, 1.0)
    out_ = np.dstack([rgb, alpha])
    return Image.fromarray((out_ * 255).round().astype("uint8"), "RGBA")

for name, (sheet, box) in DECOR.items():
    webp(luminance_to_alpha(sheet.crop(box)), out("decor", f"{name}.webp"), 90, alpha_quality=100)

# --- 4. favicon / app icons from the canonical Logo Mark Symbol ------------
def square(im, size, pad_ratio=0.0, bg=None):
    s = max(im.size); tile = Image.new("RGBA", (s, s), bg or (0, 0, 0, 0))
    tile.alpha_composite(im, ((s-im.width)//2, (s-im.height)//2))
    inner = round(size * (1 - 2*pad_ratio))
    tile = tile.resize((inner, inner), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), bg or (0, 0, 0, 0))
    canvas.alpha_composite(tile, ((size-inner)//2, (size-inner)//2))
    return canvas
NOCTURNE_950 = (14, 12, 20, 255)
square(mark_t, 512, 0.04).save(os.path.join(APP, "icon.png"))
square(mark_t, 180, 0.12, NOCTURNE_950).convert("RGB").save(os.path.join(APP, "apple-icon.png"))
ico = [square(mark_t, s, 0.02) for s in (48, 32, 16)]
ico[0].save(os.path.join(APP, "favicon.ico"), format="ICO", sizes=[(48, 48), (32, 32), (16, 16)], append_images=ico[1:])
print("  icons: app/icon.png (512), app/apple-icon.png (180, Nocturne tile), app/favicon.ico (48/32/16)")
