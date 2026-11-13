"""Vyčistí logá Antoni z Illustrator SVG (odstráni artefakty a clip-path),
rozdelí ich na monogram / wordmark / oblúk a nastaví fill=currentColor."""
import re, sys, json
from fontTools.svgLib.path import parse_path
from fontTools.pens.boundsPen import BoundsPen

dark, white, out = sys.argv[1:4]

def paths(fn):
    t = open(fn).read()
    items = []
    for tag, attrs in re.findall(r'<(path|rect|line)([^>]*)>', t, flags=re.S):
        items.append((tag, attrs))
    return items

def d_of(attrs):
    m = re.search(r'\sd="([^"]+)"', attrs, flags=re.S)
    return re.sub(r'\s+', ' ', m.group(1)).strip() if m else None

def bounds(ds):
    pen = BoundsPen(None)
    for d in ds:
        parse_path(d, pen)
    return pen.bounds

D = paths(dark)
dpaths = [d_of(a) for t, a in D if t == 'path']
# 0 = artefakt (červený clip), 1-3 = monogram, 4-9 = "antoni", 10-19 = "restaurant"
mono, word_a, word_r = dpaths[1:4], dpaths[4:10], dpaths[10:20]
rect = [a for t, a in D if t == 'rect' and 'width="462.96"' in a][0]
rx = float(re.search(r'x="([\d.]+)"', rect).group(1)); ry = float(re.search(r'y="([\d.]+)"', rect).group(1))
rw = float(re.search(r'width="([\d.]+)"', rect).group(1))
line = f'M{rx},{ry}h{rw}v1h-{rw}z'

def svg(ds, pad=4, extra=''):
    x0, y0, x1, y1 = bounds(ds)
    vb = f'{x0-pad:.1f} {y0-pad:.1f} {x1-x0+2*pad:.1f} {y1-y0+2*pad:.1f}'
    body = ''.join(f'<path d="{d}"/>' for d in ds)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" fill="currentColor" role="img" aria-label="Antoni restaurant">{extra}{body}</svg>\n', vb

files = {
    'antoni-monogram.svg': mono,
    'antoni-wordmark.svg': word_a + word_r,
    'antoni-logo.svg': mono + word_a + word_r + [line],
}
meta = {}
for name, ds in files.items():
    s, vb = svg(ds)
    open(f'{out}/{name}', 'w').write(s)
    meta[name] = vb

# oblúk z bielej verzie (rovnaké tvary, iný posun) — vezmeme rám a posunieme ho do súradníc tmavej verzie
W = paths(white)
wpaths = [d_of(a) for t, a in W if t == 'path']
arch = wpaths[-1]
# posun medzi verziami: prvý bod monogramu
dx = 838.41 - 837.11; dy = 1091.16 - 1358.1
archT = f'<g transform="translate({dx:.2f} {dy:.2f})"><path d="{arch}" fill="none" stroke="currentColor" stroke-width="6.9"/></g>'
x0, y0, x1, y1 = bounds([arch]); x0 += dx; x1 += dx; y0 += dy; y1 += dy
pad = 6
vb = f'{x0-pad:.1f} {y0-pad:.1f} {x1-x0+2*pad:.1f} {y1-y0+2*pad:.1f}'
body = ''.join(f'<path d="{d}"/>' for d in mono + word_a + word_r + [line])
open(f'{out}/antoni-arch.svg', 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" fill="currentColor" role="img" aria-label="Antoni restaurant">{archT}{body}</svg>\n')
meta['antoni-arch.svg'] = vb
meta['arch_path'] = arch; meta['arch_translate'] = [dx, dy]
json.dump({'viewBoxes': meta, 'mono': mono, 'line': line}, open(f'{out}/logo-paths.json', 'w'))
print(json.dumps({k: v for k, v in meta.items() if k.endswith('svg')}, indent=1))
