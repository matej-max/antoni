#!/usr/bin/env python3
"""Statický build prototypu Antoni.

Zrkadlí budúcu Laravel štruktúru:
  partials/*.html   → resources/views/components + layouts (Blade)
  pages/*.html      → resources/views/pages/*.blade.php
  data/*.json       → Filament modely (à la carte, pizza) a Listo feed (denné menu)

Spustenie:  python3 web/_src/build.py   → zapíše web/*.html
"""
import html
import json
import re
from datetime import date
from pathlib import Path

import sys

# Téma: python3 web/_src/build.py [--theme <priečinok s _src témy>] — téma prekrýva partials/pages,
# dáta sa berú vždy zo základného web/_src/data.
BASE = Path(__file__).parent
THEME = None
if "--theme" in sys.argv:
    THEME = Path(sys.argv[sys.argv.index("--theme") + 1]).resolve()
SRC = BASE
OUT = (THEME.parent if THEME else BASE.parent)
THEME_CFG = json.loads((THEME / "theme.json").read_text()) if THEME and (THEME / "theme.json").exists() else {}
IMG = OUT / "assets" / "img"
MANIFEST = json.loads((IMG / "manifest.json").read_text())
LOGO = json.loads((OUT / "assets" / "logo" / "logo-paths.json").read_text())
MONO = json.loads((OUT / "assets" / "logo" / "monogram-contours.json").read_text())

import time
VER = str(int(time.time()))

ALLERGENS = {
    1: "Obilniny s lepkom", 2: "Kôrovce", 3: "Vajcia", 4: "Ryby", 5: "Arašidy",
    6: "Sója", 7: "Mlieko", 8: "Orechy", 9: "Zeler", 10: "Horčica", 11: "Sezam",
    12: "Oxid siričitý a siričitany", 13: "Vlčí bôb", 14: "Mäkkýše",
}

# ------------------------------------------------------------------ ikony
ICONS = {
    "arrow": '<path d="M4 12h15M13 6l6 6-6 6"/>',
    "phone": '<path d="M7.5 3.5h-3a1 1 0 0 0-1 1C3.5 13.6 10.4 20.5 19.5 20.5a1 1 0 0 0 1-1v-3l-4-1.6-2 2a12.5 12.5 0 0 1-6.4-6.4l2-2z"/>',
    "pin": '<path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.3"/>',
    "clock": '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    "close": '<path d="M5.5 5.5l13 13M18.5 5.5l-13 13"/>',
    "minus": '<path d="M6 12h12"/>',
    "plus": '<path d="M6 12h12M12 6v12"/>',
    "mail": '<rect x="3.5" y="5.5" width="17" height="13" rx="1"/><path d="M4 6.5l8 6 8-6"/>',
    "instagram": '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.8" cy="7.2" r=".6" fill="currentColor" stroke="none"/>',
    "facebook": '<path d="M13.5 20.5v-7.3h2.4l.4-2.9h-2.8V8.6c0-.8.3-1.4 1.5-1.4h1.4V4.6c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.2H8.4v2.9h2.4v7.3"/>',
    "leaf": '<path d="M5 19c0-8 5-13.5 14-14-.5 9-6 14-14 14z"/><path d="M5 19l7-7"/>',
    "chili": '<path d="M14 7c3 0 5 2.3 4.4 5.5C17.6 17 12.5 20 5 20c4.5-2 6.5-5 7-9 .3-2.4 1-4 2-4z"/><path d="M14 7c0-1.6.8-2.8 2.3-3.5"/>',
    "calendar": '<rect x="4" y="5.5" width="16" height="14" rx="1"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
    "users": '<circle cx="9" cy="9" r="3.2"/><path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="16.8" cy="9.6" r="2.4"/><path d="M15.6 14.6c2.4 0 4.3 1.5 4.9 4.4"/>',
    "car": '<path d="M5 16.5V12l1.8-4.6A1.5 1.5 0 0 1 8.2 6.5h7.6a1.5 1.5 0 0 1 1.4.9L19 12v4.5"/><path d="M4 16.5h16M5 12h14"/><circle cx="8" cy="16.5" r="1.6"/><circle cx="16" cy="16.5" r="1.6"/>',
    "music": '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    "plate": '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>',
    "spark": '<path d="M12 3.5l1.6 5.4 5.4 1.6-5.4 1.6L12 17.5l-1.6-5.4L5 10.5l5.4-1.6z"/>',
}


def icon(name, cls="icon"):
    return (f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[name]}</svg>')


# ------------------------------------------------------------------ logo
def logo(kind, cls=""):
    vb = LOGO["viewBoxes"]
    if kind == "mono":
        body = "".join(f'<path d="{d}"/>' for d in LOGO["mono"])
        return f'<svg class="{cls}" viewBox="{vb["antoni-monogram.svg"]}" fill="currentColor" aria-hidden="true">{body}</svg>'
    if kind == "word":
        svg = (OUT / "assets/logo/antoni-wordmark.svg").read_text()
        return svg.replace("<svg ", f'<svg class="{cls}" aria-hidden="true" ', 1).replace(' role="img" aria-label="Antoni restaurant"', "").strip()
    if kind == "full":
        svg = (OUT / "assets/logo/antoni-logo.svg").read_text()
        return svg.replace("<svg ", f'<svg class="{cls}" ', 1).strip()
    if kind == "arch":
        svg = (OUT / "assets/logo/antoni-arch.svg").read_text()
        return svg.replace("<svg ", f'<svg class="{cls}" ', 1).strip()
    if kind == "draw":
        strokes = "".join(f'<path d="{d}"/>' for d in MONO["contours"])
        fills = "".join(f'<path d="{d}"/>' for d in LOGO["mono"])
        return (f'<svg viewBox="{MONO["viewBox"]}" aria-hidden="true"><g class="stroke">{strokes}</g>'
                f'<g class="fill" fill="currentColor">{fills}</g></svg>')
    raise KeyError(kind)


# ------------------------------------------------------------------ obrázky
def img(slug, sizes="100vw", alt="", loading="lazy", cls=""):
    m = MANIFEST[slug]
    ws = m["widths"]
    w, h = m["w"], m["h"]
    srcset = ", ".join(f"assets/img/{slug}-{x}.webp {x}w" for x in ws)
    default = next((x for x in ws if x >= 1080), ws[-1])
    pri = ' fetchpriority="high"' if loading == "eager" else ""
    c = f' class="{cls}"' if cls else ""
    return (f'<img{c} src="assets/img/{slug}-{default}.webp" srcset="{srcset}" sizes="{sizes}" '
            f'width="{w}" height="{h}" alt="{html.escape(alt)}" loading="{loading}" decoding="async"{pri}>')


def eur(v):
    return f"{v:,.2f}".replace(",", " ").replace(".", ",") + " €"


# ------------------------------------------------------------------ à la carte
def tag_html(t):
    if t == "vege":
        return f'<span class="tag" title="Vegetariánske">{icon("leaf", "icon tag__i")}Vege</span>'
    if t == "spicy":
        return f'<span class="tag" title="Pikantné">{icon("chili", "icon tag__i")}Pikantné</span>'
    if t == "new":
        return '<span class="tag tag--new">Novinka</span>'
    return ""


def item_html(it, numbered=False):
    photo = it.get("photo")
    attrs = ""
    cls = "item"
    if photo:
        cls += " item--photo"
        m = MANIFEST[photo]
        sm = next((x for x in m["widths"] if x >= 640), m["widths"][-1])
        lg = next((x for x in m["widths"] if x >= 1080), m["widths"][-1])
        attrs = (f' data-photo-sm="assets/img/{photo}-{sm}.webp" data-photo-lg="assets/img/{photo}-{lg}.webp" tabindex="0" role="button" '
                 f'aria-label="{html.escape(it["name"])} — zobraziť fotku"')
    num = f'<span class="item__num">{it["n"]:02d}</span>' if numbered and "n" in it else ""
    tags = "".join(tag_html(t) for t in it.get("tags", []))
    desc = f'<p class="item__desc">{html.escape(it["desc"])}</p>' if it.get("desc") else ""
    al = f' · alergény {it["allergens"]}' if it.get("allergens") else ""
    return (f'<li class="{cls}"{attrs} data-name="{html.escape(it["name"])}" data-desc="{html.escape(it.get("desc", ""))}" data-price="{eur(it["price"])}">'
            f'<h3 class="item__name">{num}<span>{html.escape(it["name"])}</span>{tags}</h3>'
            f'{desc}<p class="item__meta">{it["portion"]}{al}</p>'
            f'<p class="item__price price">{eur(it["price"])}</p></li>')


def menu_alacarte():
    d = json.loads((BASE / "data/ala-carte.json").read_text())
    out = []
    for c in d["categories"]:
        items = "".join(item_html(i) for i in c["items"])
        visual = (f'<figure class="menu-cat__visual arch" data-curtain>'
                  f'{img(c["photo"], "(min-width:1100px) 30vw, 90vw", c["photo_alt"])}</figure>') if c.get("photo") else ""
        out.append(
            f'<section class="menu-cat wrap" id="{c["slug"]}" aria-labelledby="h-{c["slug"]}">'
            f'<div class="menu-cat__layout"><div><div class="menu-cat__head">'
            f'<h2 class="menu-cat__title" id="h-{c["slug"]}">{c["name"]}</h2></div>'
            f'<ul class="items">{items}</ul></div>{visual}</div></section>')
    return "\n".join(out)


def catnav(file):
    d = json.loads((BASE / f"data/{file}.json").read_text())
    return "".join(f'<a href="#{c["slug"]}">{c["name"]}</a>' for c in d["categories"])


def menu_pizza():
    d = json.loads((BASE / "data/pizza.json").read_text())
    out = []
    for c in d["categories"]:
        items = "".join(item_html(i, c.get("numbered")) for i in c["items"])
        out.append(
            f'<section class="menu-cat wrap" id="{c["slug"]}" aria-labelledby="h-{c["slug"]}">'
            f'<div class="menu-cat__head"><h2 class="menu-cat__title" id="h-{c["slug"]}">{c["name"]}</h2></div>'
            f'<ul class="items items--cols">{items}</ul></section>')
    return "\n".join(out)


# ------------------------------------------------------------------ Listo
def listo_data():
    return json.loads((BASE / "data/listo-menu.sk.json").read_text())


def day_items_html(day):
    rows = []
    for it in day["items"]:
        price = eur(it["price"]) if it["price"] else '<span class="muted small">v cene menu</span>'
        al = ", ".join(str(a) for a in it["allergens"]) or "—"
        soup = " day-item--soup" if it["slot"].lower().startswith("polievka") else ""
        rows.append(
            f'<li class="day-item{soup}"><span class="day-item__slot">{html.escape(it["slot"])}</span>'
            f'<span class="day-item__name">{html.escape(it["name"])}</span>'
            f'<span class="day-item__price price">{price}</span>'
            f'<span class="day-item__meta">{html.escape(it["portion"])} · alergény {al}</span></li>')
    return f'<ul class="day-items">{"".join(rows)}</ul>'


def fmt_date(iso, with_year=False):
    y, m, d = map(int, iso.split("-"))
    return f"{d}. {m}." + (f" {y}" if with_year else "")


def listo_week():
    d = listo_data()
    tabs, views = [], []
    short = {"Pondelok": "Po", "Utorok": "Ut", "Streda": "St", "Štvrtok": "Št", "Piatok": "Pi", "Sobota": "So", "Nedeľa": "Ne"}
    for i, day in enumerate(d["days"]):
        sel = "true" if i == 0 else "false"
        tabs.append(
            f'<button class="daytab" role="tab" id="t-{day["date"]}" aria-controls="v-{day["date"]}" aria-selected="{sel}" '
            f'data-date="{day["date"]}"><span class="d">{short[day["label"]]}</span><span class="n">{fmt_date(day["date"])}</span></button>')
        hidden = "" if i == 0 else " hidden"
        views.append(
            f'<section class="dayview" role="tabpanel" id="v-{day["date"]}" aria-labelledby="t-{day["date"]}" data-date="{day["date"]}"{hidden}>'
            f'<div class="dayview__head"><h2 class="dayview__title">{day["label"]} <span class="gold">{fmt_date(day["date"])}</span></h2></div>'
            f'{day_items_html(day)}</section>')
    return (f'<div class="daytabs" role="tablist" aria-label="Dni v týždni">{"".join(tabs)}</div>'
            f'<div class="notice" data-weekend hidden><p class="h3">Cez víkend varíme à la carte</p>'
            f'<p class="muted">Denné menu podávame v pracovné dni od 11:00. Menu na nový týždeň zverejníme do pondelka.</p>'
            f'<p><a class="textlink" href="ponuka.html">À la carte lístok {icon("arrow", "arrow")}</a></p></div>'
            f'{"".join(views)}')


def listo_range():
    d = listo_data()["menu"]
    return f'{fmt_date(d["starts_on"])} – {fmt_date(d["ends_on"], True)}'


def listo_published():
    p = listo_data()["menu"]["published_at"]
    y, m, dd = p[:10].split("-")
    return f'{int(dd)}. {int(m)}. {y} o {p[11:16]}'


def listo_json():
    return ('<script type="application/json" id="listo-feed">'
            + json.dumps(listo_data(), ensure_ascii=False, separators=(",", ":")) + "</script>")


def allergen_list():
    return "".join(f"<li><b>{k}</b>{v}</li>" for k, v in ALLERGENS.items())


# ------------------------------------------------------------------ render
def render(text, page):
    def partial(m):
        return render(find("partials", f"{m.group(1)}.html").read_text(), page)
    text = re.sub(r"\{\{>\s*([\w-]+)\s*\}\}", partial, text)

    def tok(m):
        kind, arg = m.group(1), m.group(2) or ""
        parts = [p.strip() for p in arg.split("|")] if arg else []
        if kind == "img":
            slug, sizes, alt = parts[0], parts[1], parts[2]
            loading = parts[3] if len(parts) > 3 and parts[3] else "lazy"
            cls = parts[4] if len(parts) > 4 else ""
            return img(slug, sizes, alt, loading, cls)
        if kind == "icon":
            return icon(parts[0], parts[1] if len(parts) > 1 else "icon")
        if kind == "logo":
            return logo(parts[0], parts[1] if len(parts) > 1 else "")
        if kind == "cur":
            return ' aria-current="page"' if parts[0] == page["page"] else ""
        if kind == "menu":
            return {"ala-carte": menu_alacarte, "pizza": menu_pizza}[parts[0]]()
        if kind == "catnav":
            return catnav(parts[0])
        if kind == "listo":
            return {"week": listo_week, "range": listo_range, "json": listo_json, "published": listo_published}[parts[0]]()
        if kind == "allergens":
            return allergen_list()
        if kind == "meta":
            return html.escape(page.get(parts[0], ""))
        if kind == "ver":
            return VER
        if kind == "year":
            return str(date.today().year)
        raise KeyError(kind)
    return re.sub(r"\{\{(\w+)(?::([^}]*))?\}\}", tok, text)


def find(kind, name):
    if THEME and (THEME / kind / name).exists():
        return THEME / kind / name
    return BASE / kind / name


def build():
    names = {p.name for p in (BASE / "pages").glob("*.html")}
    if THEME and (THEME / "pages").exists():
        names |= {p.name for p in (THEME / "pages").glob("*.html")}
    for name in sorted(names):
        p = find("pages", name)
        raw = p.read_text()
        m = re.match(r"<!--meta\s*(\{.*?\})\s*-->\s*", raw, flags=re.S)
        meta = json.loads(m.group(1))
        meta.setdefault("page", p.stem)
        if THEME_CFG.get("force_theme") and p.parent.parent != THEME:
            meta["theme"] = THEME_CFG["force_theme"]
        if THEME_CFG.get("bar_map"):
            meta["bar"] = THEME_CFG["bar_map"].get(meta.get("bar", "bar"), meta.get("bar", "bar"))
        meta.setdefault("header", "light")
        body = raw[m.end():]
        layout = find("partials", "layout.html").read_text().replace("{{content}}", body)
        layout = layout.replace("{{barpartial}}", "{{> " + meta.get("bar", "bar") + "}}")
        out = render(layout, meta)
        (OUT / name).write_text(out)
        print("built", OUT.name + "/" + name, f"{len(out) // 1024} kB")


if __name__ == "__main__":
    build()
