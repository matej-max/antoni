# Antoni restaurant — redesign 2026 · odovzdanie dizajnu

Prototyp je statický web (HTML/CSS/JS) v priečinku `web/`. Štruktúrou zodpovedá budúcej Laravel aplikácii: partials = Blade layout a komponenty, `data/*.json` = Filament modely a Listo feed.

## 1. Ako si ho pozrieť

```bash
python3 -m http.server 8765 --directory web
```

Potom otvor `http://localhost:8765`. Úpravy rob v `web/_src/` a zostav cez `python3 web/_src/build.py`.

Užitočné prepínače:

- `?dnes=2026-09-30T12:30` — simuluje dátum a čas (denné menu „dnes“, otvorené/zatvorené, sloty v rezervácii). Ukážkový týždeň z Lista je 28. 9. – 2. 10. 2026.
- Úvodná animácia monogramu sa prehrá raz za reláciu prehliadača. Znova ju uvidíš v novom okne / po vymazaní sessionStorage.
- Pri `prefers-reduced-motion` web beží bez animácií, celý obsah je viditeľný.

## 2. Koncept: „Večer chod po chode“

Domovská stránka je jeden večer v Antoni. Scroll posúva hodiny od 18:30 a každá kapitola je chod:

| Čas | Kapitola | Čo ukazuje |
|---|---|---|
| 18:30 | Príchod | oblúkové „dvere“ sa otvoria na prestretý stôl; priestor, hodiny, parkovanie |
| 18:40 | Mimo lístka | **Kačacie hody** — odporúčanie čašníka, menu hodov, rezervácia na hody |
| 18:45 | Aperitív | drinky, víno |
| 19:00 | Predjedlo | arancini, fazuľovica, tatarák s cenami |
| 19:30 | Hlavný chod | 6 tanierov z lístka (desktop: horizontálna galéria pri scrolle, mobil: swipe) |
| 20:15 | Spoločný stôl | okrúhly stôl sa pomaly otáča; oslavy a svadby (až 120 hostí) |
| 20:40 | Slová hostí | reálne recenzie (bez tvrdení typu „najlepší“) |
| 21:00 | Dezert a káva | crème brûlée, buchty na pare |
| Váš čas | Váš stôl | rezervácia; veľké hodiny ukazujú čas, ktorý si hosť vyberie |

Signatúrne prvky:

- **Hodiny večera** — na mobile v spodnej lište vedľa tlačidla Rezervovať (číslice sa pretáčajú ako počítadlo), na desktope časová os vpravo.
- **Oblúk z loga** — rámuje fotky, tvorí „dvere“ v úvode a kartičku potvrdenia rezervácie.
- **Monogram „an“** sa pri prvej návšteve nakreslí perom (zlatý ťah → biela výplň), rovnaká technika ako komponent v `typewright.md`.
- **Denná doba určuje farbu** — večerné stránky sú tmavé (espresso, hlboká zelená), denné menu je svetlé („obed = deň“).

Stránky: `index`, `ponuka` (à la carte), `pizza` (pizza, šaláty, štangle, donáška), `denne-menu`, `kacacie-hody`, `eventy`, `o-nas`, `kontakt`, `rezervacia`, `medzi-chodmi`, `degustacny-vecer` (vzorový článok).

## 3. Design systém v skratke

**Farby** (zachované + rozšírené): espresso `#270A03`, noc `#120806`, umbra `#564640`, hlboká zelená `#143833`, súmrak `#0B221F`, zlatá `#CFA670` (jediný akcent), kameň `#B4ACA5`, porcelán `#F4F2EF`, bronz `#77572B` (zlatá pre text na svetlom podklade, spĺňa AA).

**Písma:** Rosalia na nadpisy a časy (od cca 28 px vyššie), Josefin Sans na text a ovládanie.

> **Rosalia nemala slovenské znaky** č ď ľ ĺ ň ŕ ť (ani veľké) a maďarské ő ű. Mala tiež nulovú šírku nezlomiteľnej medzery. Pripravil som `web/assets/fonts/Rosalia-SK.woff2`, ktorý chýbajúce znaky skladá z pôvodných obrysov (písmeno + mäkčeň/dĺžeň/apostrof). Skript je v `tools/rosalia_sk.py`. **Pred spustením over, či licencia Rosalie (Muntab_Art) dovoľuje úpravu fontu.** Súčasný web tieto znaky v Rosalii zobrazuje náhradným písmom.

**Logá:** vyčistené SVG v `web/assets/logo/` (monogram, wordmark, celé logo, verzia s oblúkom, favicon). Farbu preberajú z `currentColor`.

**Pohyb:** GSAP 3.13 + ScrollTrigger + Lenis (v Laraveli `npm i gsap lenis`). Ak animácie zlyhajú, web sa sám prepne do statického režimu.

## 4. Laravel + Filament: čo z čoho vznikne

Listo README hovorí, že Listo a klientske weby tvoria jednu multi-tenant Laravel platformu a každý klient môže mať vlastný frontend. Antoni web je teda **téma tenanta `antoni`** nad spoločným dátovým modelom.

### Blade

| Prototyp | Laravel |
|---|---|
| `_src/partials/layout.html` | `layouts/antoni.blade.php` |
| `header.html`, `footer.html`, `bar*.html`, `sheets.html` | `<x-antoni.header>`, `<x-antoni.footer>`, `<x-antoni.bar :variant>` |
| `reserve-form.html` | `<x-antoni.reserve-form />` (Livewire alebo POST) |
| `hours.html` | `<x-antoni.hours />` z nastavení |
| `{{img:…}}` v build.py | `<x-antoni.img :media="$dish->photo" sizes="…" />` (srcset 640/1080/1600) |

### Filament (spravuje reštaurácia)

- **Sezóna à la carte** — názov („Leto 2026“), platnosť od, aktívna. Pri novej sezóne sa duplikuje stará a upravia sa jedlá a fotky.
- **Kategória** — názov, slug, poradie, fotka kategórie (oblúk vedľa zoznamu).
- **Jedlo** — názov SK/HU, popis, gramáž, alergény (1–14), cena, štítky (vege, pikantné, novinka), fotka (voliteľná — bez fotky sa riadok zobrazí len textovo), číslo (pre pizzu).
- **Zážitkový večer** — názov, slug, stav (aktívny / skrytý / archív), termín od–do, hero fotka, chody (repeater: druh chodu, názov, popis, cena, fotka), text, CTA. Aktívny večer sa automaticky zobrazí na domovskej stránke ako kapitola 18:40 „Mimo lístka“. Keď žiadny nebeží, kapitola sa vynechá a hodiny skočia z 18:30 na 18:45.
- **Rezervácia** (z formulára) — dátum, čas, počet hostí, príležitosť, meno, telefón, poznámka, stav (nová / potvrdená / zamietnutá), notifikácia personálu e-mailom alebo SMS.
- **Dopyt na oslavu** — typ, počet hostí, termín, kontakt, správa.
- **Medzi chodmi** — články (pozri časť 6), pojmy slovníka.
- **Nastavenia** — otváracie hodiny, telefóny, adresa, sociálne siete, aktuálna sezóna, recenzie hostí.

### Denné menu z Lista

Web preberá **obsah, nie formu**. Dve možnosti:

1. **Rovnaká platforma (odporúčam):** controller tenanta zavolá `PublicMenuPresenter::data($menu, $locale)` a výsledok vykreslí šablóna `antoni/denne-menu.blade.php`. Žiadne HTTP volanie, rovnaké dáta ako v Liste.
2. **Samostatné nasadenie:** `GET /api/public/v1/menu/antoni/{branch}/{locale}` cez Laravel HTTP client, cache 5 min (feed posiela ETag a `stale-while-revalidate`). Pri výpadku zobraz poslednú úspešnú odpoveď.

Prototyp číta presne tento tvar (`schema_version: 1`, súbor `web/_src/data/listo-menu.sk.json`): `days[].date/label/items[].slot/name/description/portion/price/allergens/photo_url`. Pravidlá zobrazenia:

- `price = 0` → „v cene menu“ (polievka),
- dnešný deň sa vyberie automaticky, minulé dni sú prečiarknuté,
- cez víkend sa zobrazí hláška „Cez víkend varíme à la carte“ a posledný zverejnený týždeň ostane dostupný,
- `menu.published_at` sa ukáže ako „Aktualizované …“,
- pilulka „Obed dnes“ v hlavičke otvorí dnešné menu v paneli na každej stránke.

**Návrh na `schema_version: 2` v Liste:** feed teraz nevie povedať, že je deň sviatok alebo zatvorené (pôvodný Google skript mal `defaultHolidayText`). Doplniť `day.status` (`open | holiday | closed`) a `day.note`. Hodilo by sa aj `menu.notes` (napr. „k menu polievka zdarma“) a textové názvy alergénov pre HU verziu.

> Bezpečnostná poznámka: `antoni-tabulka.js` v tomto priečinku obsahuje v čistom texte token na synchronizáciu s WordPressom. Po prechode na Laravel ho zneplatni a do repozitára ho nedávaj.

## 5. Kačacie hody

Akcia je zvýraznená na troch miestach: kapitola 18:40 na domovskej stránke, vlastná stránka `kacacie-hody.html` a položka „práve teraz“ v menu. Tlačidlá „Rezervovať na hody“ vopred vyplnia príležitosť vo formulári.

Na doplnenie:

- **Názvy jedál som odvodil z fotiek** (paštéta s briošou, pečené stehno s červenou kapustou a knedľou, kačacie prsia, kačacia misa pre dvoch, lokše s makom a slivkami). Treba overiť a doplniť ceny a termín. Komponent ceny už má.
- Fotky hodov sú výrazne slabšie ako profi fotenie à la carte a niektoré pôsobia digitálne dotvorene. Pri ďalšej akcii odporúčam krátke profi fotenie, web stojí na kvalite fotiek.

## 6. „Medzi chodmi“ — redakčná sekcia namiesto blogu

**Prečo tento názov:** nadväzuje na koncept večera. Čo sa nezmestí do lístka, rozpovieme medzi chodmi. Neznie ako firemný blog a v navigácii pôsobí ako súčasť reštaurácie. Alternatívy: „Zápisník“, „Za prechodom“ (pass v kuchyni).

**Forma:** index nie je mriežka kariet, ale lístok príbehov rozdelený na „chody“. Každý chod je téma s vlastným cieľom:

| Chod | Účel | Príklady tém | SEO / značka |
|---|---|---|---|
| **Z kuchyne** | technika a príbeh tanierov z lístka | Sous vide kačacie prsia; Demi-glace; Rib-eye, sviečkovica alebo flank? | long-tail: „sous vide kačacie prsia“, „aký steak vybrať“ |
| **Recept domov** | recept upravený pre domácu kuchyňu | Tatarák doma; Lokše s makom; Arancini z rizota | silné vyhľadávanie receptov, schema `Recipe`, budovanie dôvery |
| **Zážitkové večere** | pozvánky a spomienky na hody a degustácie | Kačacie hody; Šesť chodov aprílového večera | lokálne: „kačacie hody Veľký Krtíš“; schema `Event` |
| **Odkiaľ to je** | miestni dodávatelia, víno, suroviny | Ľudia za surovinami; Víno k jedlu | lokálna autorita, väzby na dodávateľov (spätné odkazy) |
| **Ľudia** | tím, šéfkuchári | Roland Zöllei; Lukáš Lendvay | E-E-A-T, osobnosť značky |
| **Slovník lístka** | krátke definície pojmov z lístka | sous vide, veloute, demi-glace, chimichurri, haruľky… | odpovede pre Google AI Overviews a ChatGPT; každý pojem má vlastnú URL |

Pravidlá:

- Každý článok začína boxom „V skratke“ (vhodný na citovanie v AI vyhľadávaní) a končí jedným CTA: rezervácia alebo najbližší zážitkový večer.
- Jedlá v lístku odkazujú na svoj článok a slovník, články na jedlá. Interné prelinkovanie zbiera návštevnosť späť k rezervácii.
- Rytmus: 1–2 články mesačne + jeden pri každej novej sezóne (nové fotenie = nový príbeh „Sezóna …“).
- Lokálne kľúčové slová patria do stránok, nie do textov na silu: „reštaurácia Veľký Krtíš“, „svadba Veľký Krtíš“, „denné menu Veľký Krtíš“, „oslava Veľký Krtíš“.
- Vzorový článok `degustacny-vecer.html` je prepísaný reálny text zo súčasného webu (apríl 2024).

V indexe sú navrhnuté témy. Odkazy `#` sú zatiaľ prázdne, kým články nevzniknú.

## 7. Obsah na overenie pred spustením

- PSČ a obec: „991 05 Sklabiná“ som prevzal z verejných registrov, súčasný web uvádza len „Peserany 283“.
- E-mail `antoni.restaurant@centrum.sk` je z verejného katalógu, nie zo súčasného webu.
- Podmienky donášky: web uvádza len telefón a „podmienky povieme pri objednávke“. Katalógy píšu o donáške zadarmo do 10 km. Ak to platí, oplatí sa to na webe uviesť.
- Fotka polievky v hrnčeku je priradená k „Antoni fazuľovici“. Over, či ide o správnu polievku.
- Recenzie (Michaela K., Darina Š.) sú zo súčasného webu. Over zdroj a súhlas so zverejnením. Recenziu „TOP 3 reštaurácií“ som zámerne nepoužil.
- Lístok „Leto 2026“ je stále aktuálny aj v októbri?
- Veta „Nápojový lístok vám prinesieme spolu s jedálnym“ opisuje postup obsluhy. Over, či to tak naozaj funguje.
- Texty GDPR a cookies, ochrana osobných údajov.
- HU verzia: prepínač je pripravený, preklady chýbajú.

## 8. Záložná klasická verzia (`web-klasik/`)

Kategóriový štandard spravený poctivo, ako záloha k hlavnej verzii. Hlavnú verziu nemení. Obsah, dáta, fotky, fonty a logá zdieľa s `web/`: priečinky `assets/img`, `fonts`, `logo` a `vendor` sú symbolické odkazy, rovnako `css/antoni.css` a `js/antoni.js`. Vlastné má len `klasik.css`, `klasik.js`, hlavičku, spodnú lištu, domovskú a rezervačnú stránku.

```bash
python3 -m http.server 8766 --directory web-klasik
```

Zostavenie: `python3 web/_src/build.py --theme web-klasik/_src`. Téma prekrýva `partials/` a `pages/` a ostatné podstránky zostaví zo zdieľaných zdrojov vo svetlom režime.

**Domovská stránka:**

1. celoplošná tmavá fotka s logom v strede a dvoma tlačidlami,
2. pás s praktickými informáciami (otvorené teraz, dnešné menu z Lista, adresa),
3. Vitajte v Antoni,
4. pás Kačacie hody,
5. výber 6 jedál z lístka a skratky do kategórií,
6. dnešné denné menu,
7. oslavy a kapacity,
8. galéria so zväčšením,
9. recenzie v karuseli,
10. rezervácia s mapou.

**Rozdiely oproti hlavnej verzii:**

- svetlé obsahové sekcie,
- obdĺžnikové fotky so zaoblením 6 px namiesto oblúkov,
- bez hodín večera,
- na mobile lišta „Zavolať / Rezervovať stôl“.

Pri prípadnom nasadení klasickej verzie treba pred spustením nanovo zapísať DESIGN.md. Súčasný DESIGN.md opisuje hlavnú verziu.

## 9. Súbory

- `web/` — prototyp (zostavené stránky + `assets/`)
- `web/_src/` — zdroje: `partials/`, `pages/`, `data/`, `build.py`
- `tools/export_photos.py` — export fotiek do WebP (640/1080/1600, hero aj 2200), manifest s pôvodnými názvami súborov
- `tools/rosalia_sk.py` — doplnenie SK/HU znakov do Rosalie
- `tools/clean_logo.py` — vyčistenie a rozdelenie log
- `tools/capture.py` — snímky stránok (Playwright)
- `web-klasik/` — záložná klasická verzia (pozri časť 8)
- `PRODUCT.md`, `DESIGN.md` — produktový a dizajnový kontext (DESIGN.md = hlavná verzia)
