"""Snímky prototypu: celé stránky (reduced-motion = statický layout) + pohybové zábery domova.
python3 tools/capture.py [static|motion|all] [page ...]"""
import sys, asyncio, os
from pathlib import Path
from playwright.async_api import async_playwright

BASE = os.environ.get("BASE", "http://localhost:8765/")
OUT = Path(__file__).resolve().parent.parent / ".impeccable" / "review" / os.environ.get("SUB", "")
OUT.mkdir(parents=True, exist_ok=True)
PAGES = ["index", "ponuka", "pizza", "denne-menu", "kacacie-hody", "eventy", "o-nas", "kontakt", "rezervacia", "medzi-chodmi", "degustacny-vecer"]
VIEW = {"mobile": dict(width=390, height=844, dpr=2, mobile=True), "desktop": dict(width=1440, height=900, dpr=1, mobile=False)}


async def static(pw, pages):
    b = await pw.chromium.launch()
    for name, v in VIEW.items():
        ctx = await b.new_context(viewport={"width": v["width"], "height": v["height"]}, device_scale_factor=v["dpr"],
                                  is_mobile=v["mobile"], has_touch=v["mobile"], reduced_motion="reduce", locale="sk-SK")
        p = await ctx.new_page()
        for pg in pages:
            await p.goto(BASE + pg + ".html?dnes=2026-09-30T12:30", wait_until="networkidle")
            await p.wait_for_timeout(600)
            # lazy obrázky: prescrolluj
            h = await p.evaluate("document.documentElement.scrollHeight")
            for y in range(0, h, 700):
                await p.evaluate(f"window.scrollTo(0,{y})"); await p.wait_for_timeout(60)
            await p.evaluate("window.scrollTo(0,0)"); await p.wait_for_timeout(400)
            await p.screenshot(path=str(OUT / f"{name}-{pg}.png"), full_page=True)
            print("static", name, pg, flush=True)
        await ctx.close()
    await b.close()


async def motion(pw):
    b = await pw.chromium.launch()
    for name, v in VIEW.items():
        ctx = await b.new_context(viewport={"width": v["width"], "height": v["height"]}, device_scale_factor=1,
                                  is_mobile=v["mobile"], has_touch=v["mobile"], locale="sk-SK")
        p = await ctx.new_page()
        await p.goto(BASE + "index.html?dnes=2026-09-30T19:10", wait_until="networkidle")
        await p.wait_for_timeout(5200)
        await p.screenshot(path=str(OUT / f"motion-{name}-00.png"))
        h = await p.evaluate("document.documentElement.scrollHeight")
        step = int(v["height"] * 0.9)
        i = 1
        y = 0
        while y < h - v["height"]:
            y += step
            # pomalý scroll, aby sa spustili triggery
            for k in range(6):
                await p.mouse.wheel(0, step / 6); await p.wait_for_timeout(70)
            await p.wait_for_timeout(1400)
            await p.screenshot(path=str(OUT / f"motion-{name}-{i:02d}.png"))
            i += 1
        errs = await p.evaluate("window.__errs || []")
        print("motion", name, i, "shots", errs, flush=True)
        await ctx.close()
    await b.close()


async def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"
    pages = sys.argv[2:] or PAGES
    async with async_playwright() as pw:
        if mode in ("static", "all"):
            await static(pw, pages)
        if mode in ("motion", "all"):
            await motion(pw)

asyncio.run(main())
