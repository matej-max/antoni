# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Produkčný web: Laravel + Filament (CMS), ako klientský frontend nad multi-tenant platformou Listo (`matej-max/listo`, Laravel 13, Filament 5). Tento krok je dizajnový prototyp v statickom HTML/CSS/JS, ktorý sa neskôr prepíše do Blade šablón; štruktúra stránok a komponentov má tomu zodpovedať.

## Users

- **Hosť z okolia (Veľký Krtíš a široké okolie)**, často na mobile: hľadá, kam ísť na obed, na večeru s partnerom alebo s rodinou; chce vidieť jedlo, ponuku s cenami, otváracie hodiny a rezervovať stôl.
- **Obedujúci počas pracovného týždňa**: rýchlo pozrie denné menu (dnes, prípadne celý týždeň), cenu a alergény.
- **Organizátor udalosti**: svadba, krstiny, stužková, narodeniny, firemný večierok; chce vedieť kapacitu priestorov, služby a poslať dopyt.
- **Objednávateľ donášky**: pizza, šaláty, štangle, posúchy; objednáva telefonicky.
- **Maďarsky hovoriaci hosť**: web je dvojjazyčný SK/HU.

## Product Purpose

Web má premeniť záujem o Antoni na návštevu. Rozpráva príbeh jedla a večera v reštaurácii pomocou profesionálnych sezónnych fotografií a končí konkrétnou akciou: rezervácia stola (formulár + telefón). Zároveň slúži ako spoľahlivý zdroj praktických informácií: à la carte ponuka, pizza a donáška, denné menu, eventy, kontakt.

Úspech: viac rezervácií a dopytov na eventy, menej telefonátov typu „aké je dnes menu / dokedy máte otvorené“, silnejšia značka v regióne a organická návštevnosť z obsahovej sekcie.

## Positioning

Reštaurácia, ktorá v menšom regióne ponúka kuchyňu, servis a prostredie na úrovni, akú hostia poznajú z veľkých miest: tradičná slovensko-maďarská kuchyňa vo vlastnom podaní, steaky, sezónne à la carte, vlastná pizza a zážitkové (degustačné) večere. Web to **nesmie tvrdiť** (žiadne „najlepšia“, „top“, „č. 1“); má to ukázať cez jedlo, detail a pokoj.

## Operating Context

- À la carte ponuka sa mení 3–4× ročne (sezóny, napr. „Leto 2026“); pri každej zmene vzniká nové profesionálne fotenie jedál. Spravuje sa vo Filamente.
- Denné menu (Po–Pi, polievka + Menu 1–4, cena, gramáž, alergény) vzniká v aplikácii **Listo** a web ho len zobrazuje. Listo publikuje schválenú verziu cez `GET /api/public/v1/menu/{tenant}/{branch}/{locale}` (schema_version 1: `restaurant`, `menu{starts_on, ends_on, published_at}`, `days[]{date, label, items[]{slot, name, description, portion, price, currency, allergens[], photo_url}}`). Web preberá **obsah, nie formu ani dizajn**.
- Rezervácia stola: formulár (požiadavka, personál potvrdí) + telefón.
- Donáška: informácie, ponuka a telefón; bez košíka.
- Zážitkové / degustačné večere sa konajú príležitostne: web má blok na najbližší termín (skrývateľný) a archív v redakčnej sekcii.
- Plánovaná redakčná sekcia pre SEO a značku (nie klasický blog).

## Capabilities and Constraints

- Jazyky: SK (predvolený) + HU.
- Adresa: Peserany 283, 991 05 Sklabiná (pri Veľkom Krtíši) — PSČ a obec z verejných registrov, overiť.
- Telefón (donáška, rezervácie): +421 948 871 984. Manažér reštaurácie: Miroslav Dobra, +421 903 585 566.
- Otváracie hodiny: Po–Št 11:00–21:00, Pi–So 11:00–22:00, Ne 11:00–21:00. Denné menu od 11:00.
- Priestory: reštaurácia 216 m² (60 osôb), terasa 120 m² (60 osôb), spolu 120 osôb. Pri eventoch: catering, hudba/ozvučenie, parkovanie, výzdoba.
- Šéfkuchári: Roland Zöllei („V jednoduchosti je krása“), Lukáš Lendvay („Gastronómia nie je práca, je to životný štýl“).
- Sociálne siete: Instagram @antoni_restaurant, Facebook.
- Font Rosalia nemá slovenské znaky č ď ľ ĺ ň ŕ ť (a veľké varianty); treba ich doplniť alebo sa im v Rosalii vyhnúť.

## Brand Commitments

- Zachovať: farebnú paletu (#270A03 tmavá espresso hnedá, #564640, #143833 hlboká zelená, #B4ACA5, #CFA670 zlatá/dubová, biela) — možno jemne doladiť a rozšíriť.
- Zachovať fonty: **Rosalia** (display) a **Josefin Sans** (text, UI).
- Zachovať logá: monogram „an“ + „antoni restaurant“, varianta v oblúku (arch).
- Web tvoria profesionálne fotografie jedál zo sezónnych fotení.
- Tón: moderný, svieži, jemne luxusný; nikdy chvastavý.

## Evidence on Hand

- Profesionálne fotky à la carte (máj 2026, 420+ záberov): `/Users/mj/Desktop/PROJEKTY/antoni/2026/05 - maj/A la carte 2026 - fotky` + CSV s názvami jedál.
- Logo SVG (tmavé, biele, arch PNG) a font Rosalia.woff zo súčasného webu.
- Reálne recenzie hostí na súčasnom webe (Michaela K., Oto N., Darina Š.).
- Recap prvého degustačného večera (apríl 2024) so 6 chodmi.
- Žiadne ocenenia, rebríčky ani mediálne tvrdenia sa nesmú vymýšľať.

## Product Principles

1. Jedlo hovorí za reštauráciu; text ho len uvádza.
2. Každá cesta webom končí jasným ďalším krokom: rezervovať, zavolať, prísť.
3. Praktické informácie (dnešné menu, hodiny, telefón) sú vždy na dva ťuky.
4. Obsah sa mení v CMS a v Liste; dizajn musí uniesť ľubovoľnú sezónu bez zásahu dizajnéra.
5. Luxus = pokoj, detail a rešpekt k času hosťa, nie zlato a ornamenty.

## Accessibility & Inclusion

WCAG 2.2 AA; ovládanie klávesnicou, `prefers-reduced-motion`, čitateľné alergény a ceny aj pri veľkom písme.
