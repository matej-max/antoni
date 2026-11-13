"""Doplní do fontu Rosalia slovenské a maďarské znaky, ktoré v ňom chýbajú.

Rosalia (Muntab_Art, 2021) obsahuje š, ž, á, ô…, ale nie č ď ľ ĺ ň ŕ ť (ani veľké)
a ani maďarské ő ű. Nové glyfy sa skladajú z existujúcich obrysov
(základné písmeno + mäkčeň / dĺžeň / apostrof / dvojitá čiarka), takže
kresba ostáva pôvodná. Výstup: Rosalia-SK.woff2 + .woff.

Použitie: python3 tools/rosalia_sk.py <vstup Rosalia.woff> <výstupný priečinok>
Pozn.: úprava fontu musí byť v súlade s licenciou Rosalia.
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.transformPen import TransformPen

src, out = sys.argv[1], sys.argv[2]
f = TTFont(src)
gs = f.getGlyphSet()
cff = f['CFF '].cff
td = cff.topDictIndex[0]
cs = td.CharStrings
private = td.Private

# (nový glyf, unicode, základ, akcent, dx akcentu, dy akcentu, posun základu, šírka|None, mierka akcentu)
P = [
    ('ccaron', 0x010D, 'c', 'caron', 108, 0, 0, None, 1),
    ('ncaron', 0x0148, 'n', 'caron', 4, 0, 0, None, 1),
    ('racute', 0x0155, 'r', 'acute', 57, 0, 0, None, 1),
    ('lacute', 0x013A, 'l', 'acute', 12, 105, 18, 170, 1),
    ('dcaron', 0x010F, 'd', 'quoteright', 492, -8, 0, 640, 0.92),
    ('lcaron', 0x013E, 'l', 'quoteright', 72, -8, 0, 205, 0.92),
    ('tcaron', 0x0165, 't', 'quoteright', 188, -40, 0, 312, 0.92),
    ('Ccaron', 0x010C, 'C', 'caron', 178, 200, 0, None, 1),
    ('Dcaron', 0x010E, 'D', 'caron', 96, 200, 0, None, 1),
    ('Ncaron', 0x0147, 'N', 'caron', 66, 200, 0, None, 1),
    ('Tcaron', 0x0164, 'T', 'caron', 153, 200, 0, None, 1),
    ('Lcaron', 0x013D, 'L', 'quoteright', 95, -2, 0, None, 0.92),
    ('Lacute', 0x0139, 'L', 'acute', 0, 200, 0, None, 1),
    ('Racute', 0x0154, 'R', 'acute', 160, 200, 0, None, 1),
    ('odblacute', 0x0151, 'o', 'hungarumlaut', 124, 0, 0, None, 1),
    ('udblacute', 0x0171, 'u', 'hungarumlaut', 12, 0, 0, None, 1),
    ('Odblacute', 0x0150, 'O', 'hungarumlaut', 198, 200, 0, None, 1),
    ('Udblacute', 0x0170, 'U', 'hungarumlaut', 70, 200, 0, None, 1),
]

order = list(f.getGlyphOrder())
for name, uni, base, acc, dx, dy, bx, width, sc in P:
    if name in cs:
        continue
    bw = f['hmtx'][base][0]
    pen = T2CharStringPen(width or bw, gs)
    gs[base].draw(TransformPen(pen, (1, 0, 0, 1, bx, 0)))
    # akcent škálovaný okolo svojho ľavého dolného rohu
    gs[acc].draw(TransformPen(pen, (sc, 0, 0, sc, dx + 25 * (1 - sc), dy + 472 * (1 - sc) if acc == 'quoteright' else dy)))
    charstring = pen.getCharString(private=private, globalSubrs=cff.GlobalSubrs)
    cs.charStringsIndex.append(charstring)
    cs.charStrings[name] = len(cs.charStringsIndex) - 1
    td.charset.append(name)
    order.append(name)
    f['hmtx'][name] = (width or bw, 25 + bx)
    for t in f['cmap'].tables:
        if t.isUnicode():
            t.cmap[uni] = name

# nezlomiteľná medzera má v pôvodnom fonte nulovú šírku — zarovnáme ju s medzerou
cm = f.getBestCmap()
if 0xA0 in cm and f['hmtx'][cm[0xA0]][0] == 0:
    f['hmtx'][cm[0xA0]] = (f['hmtx'][cm[32]][0], 0)

f.setGlyphOrder(order)
f['maxp'].numGlyphs = len(order)
for n in f['name'].names:
    if n.nameID in (1, 4, 6):
        s = n.toUnicode()
        n.string = s.replace('Rosalia', 'Rosalia SK') if n.nameID != 6 else s.replace('Rosalia', 'RosaliaSK')
for flavor, ext in (('woff2', 'woff2'), ('woff', 'woff')):
    f.flavor = flavor
    f.save(f'{out}/Rosalia-SK.{ext}')
print('ok', len(P), 'glyphs')
