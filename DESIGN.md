---
name: Antoni restaurant
description: One evening at Antoni, told course by course; night grounds, plated photography, the logo's arch, gold as the only accent.
colors:
  espresso: "#270A03"
  umber: "#564640"
  forest: "#143833"
  stone: "#B4ACA5"
  gold: "#CFA670"
  white: "#FFFFFF"
  night: "#120806"
  night-2: "#1A0D09"
  forest-deep: "#0B221F"
  gold-soft: "#E4CBA3"
  gold-deep: "#A9824D"
  bronze: "#77572B"
  porcelain: "#F4F2EF"
  porcelain-2: "#E9E5DF"
  linen-line: "#D9D2C9"
  ink-soft: "#CFC8C1"
  error: "#E08A6E"
  error-noon: "#A2391B"
typography:
  display:
    fontFamily: "Rosalia SK, Josefin Sans, Georgia, serif"
    fontSize: "clamp(3.1rem, 2.1rem + 4.6vw, 6rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "0"
  headline:
    fontFamily: "Rosalia SK, Josefin Sans, Georgia, serif"
    fontSize: "clamp(2.6rem, 1.9rem + 3.2vw, 5rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "0"
  title:
    fontFamily: "Rosalia SK, Josefin Sans, Georgia, serif"
    fontSize: "clamp(1.9rem, 1.5rem + 1.6vw, 2.9rem)"
    fontWeight: 400
    lineHeight: 1.06
  subtitle:
    fontFamily: "Josefin Sans, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 1.2rem + .6vw, 1.7rem)"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "0.005em"
  lead:
    fontFamily: "Josefin Sans, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 1.05rem + .45vw, 1.4rem)"
    fontWeight: 300
    lineHeight: 1.5
  body:
    fontFamily: "Josefin Sans, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.62
    fontFeature: "lnum"
  small:
    fontFamily: "Josefin Sans, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: ".9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Josefin Sans, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: ".75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.18em"
  button:
    fontFamily: "Josefin Sans, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: ".8125rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.16em"
rounded:
  field: "2px"
  box: "4px"
  sheet-desktop: "6px"
  sheet-mobile: "22px"
  full: "999px"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "24px"
  s-6: "32px"
  s-7: "48px"
  s-8: "64px"
  s-9: "96px"
  s-10: "128px"
  gutter: "clamp(20px, 5vw, 64px)"
  section: "clamp(72px, 10vw, 140px)"
  max-width: "1360px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.night}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "4px 26px 0"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.gold-soft}"
    textColor: "{colors.night}"
  button-small:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.night}"
    rounded: "{rounded.full}"
    padding: "4px 20px 0"
    height: "42px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.porcelain}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "4px 26px 0"
    height: "52px"
  button-ghost-hover:
    backgroundColor: "{colors.porcelain}"
    textColor: "{colors.night}"
  button-primary-noon:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.porcelain}"
    rounded: "{rounded.full}"
  button-primary-noon-hover:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.porcelain}"
  input:
    backgroundColor: "rgba(255,255,255,.035)"
    textColor: "{colors.porcelain}"
    rounded: "{rounded.field}"
    padding: "16px 16px 12px"
    height: "54px"
  input-noon:
    backgroundColor: "{colors.white}"
    textColor: "{colors.espresso}"
    rounded: "{rounded.field}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.porcelain}"
    rounded: "{rounded.full}"
    padding: "4px 18px 0"
    height: "44px"
  chip-selected:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.night}"
  today-pill:
    backgroundColor: "transparent"
    textColor: "{colors.porcelain}"
    rounded: "{rounded.full}"
    padding: "3px 14px 0"
    height: "36px"
  catnav-link-active:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.night}"
    rounded: "{rounded.full}"
    padding: "4px 16px 0"
    height: "40px"
  daytab-selected:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.porcelain}"
    padding: "12px 4px 10px"
  sheet-panel:
    backgroundColor: "{colors.night-2}"
    textColor: "{colors.porcelain}"
    rounded: "{rounded.sheet-mobile}"
  reserve-card:
    backgroundColor: "{colors.porcelain}"
    textColor: "{colors.espresso}"
    padding: "64px 32px 48px"
    width: "420px"
  drawer:
    backgroundColor: "{colors.forest-deep}"
    textColor: "{colors.porcelain}"
---

# Design System: Antoni restaurant

## Overview

**Creative North Star: "Večer chod po chode"**

The Evening, Course by Course: the site is one evening at Antoni. Night grounds shift with the hour, from dusk forest to espresso to deepest night, and the home page is ordered as a sequence of timed chapters (18:30 Príchod through 21:00 Dezert a káva, ending at the guest's own reservation time). Professional seasonal plate photography carries the story at full bleed or inside the arch taken from the logo; Rosalia SK sets the hairline display voice in porcelain white, Josefin Sans carries everything practical. Lunch is daylight: the daily menu page flips to a porcelain ground.

Density is calm and editorial: generous section padding, one idea per chapter, lists set as ruled menu lines rather than boxed tiles. Luxury is expressed as stillness, detail and exact information (tabular prices, hours, allergens), never through gold ornament. Gold appears as thin lines, times, prices and the one primary action.

The motion grammar is part of the world: a monogram that draws itself, a hero photo that opens through the arch like a door, curtain reveals on photographs, a rolling odometer clock that tracks the chapter, and a body background that cross-fades to each chapter's tone. Everything collapses to static under `prefers-reduced-motion`.

**Key Characteristics:**
- Dark, warm night grounds by default; a single light "noon" theme for the daily menu.
- Gold (#CFA670) is the only accent; on light grounds its text form is bronze.
- The arch (fully rounded top, square bottom) is the signature frame for photos, the success ticket, notices and day tabs.
- Hairline gold rules divide content; no card grids, no boxed tiles.
- Rosalia SK display at weight 400 only; Josefin Sans for text and all UI.
- Times of the evening in gold Rosalia are the home page's chapter markers and the reservation finale.

## Colors

A warm brown-black night palette with one gold accent, a deep forest for dusk and drawers, and porcelain for daylight.

### Primary
- **Dining-Room Gold** (`gold`): the only accent. Primary button fill, chapter times, prices, active nav underline, selected chips/slots, rule lines at 22% and 50% alpha (`rgba(207,166,112,.22)` / `.5`), focus outline, live status dot.
- **Candlelit Gold** (`gold-soft`): the hover wipe that rises inside primary buttons.
- **Oak Gold** (`gold-deep`): deeper gold reserved for tonal use in imagery-adjacent details.
- **Bronze** (`bronze`): gold's accessible text form on porcelain (the noon theme's `--accent-ink`); never used on night grounds.

### Secondary
- **Deep Forest** (`forest`): brand green; the noon-theme button hover.
- **Dusk Forest** (`forest-deep`): mobile drawer ground, the 18:30 chapter tone, the events page hero ground.

### Neutral
- **Deepest Night** (`night`): default page ground, hero, footer, text on gold.
- **Night Raise** (`night-2`): raised ground for sheets and image placeholders behind arches.
- **Espresso** (`espresso`): brand dark; chapter grounds for Kačacie hody, Spoločný stôl and Rezervácia; text on porcelain; noon primary button.
- **Umber** (`umber`): muted ink on noon; scrollbar thumb.
- **Stone** (`stone`): muted ink on night (meta lines, column heads, legal).
- **Soft Porcelain Ink** (`ink-soft`): secondary body copy on night grounds.
- **Porcelain** (`porcelain`) / **Porcelain Shade** (`porcelain-2`) / **Linen Line** (`linen-line`): primary ink on night; the noon ground; the reservation ticket; linen is the divider inside that ticket.
- **White** (`white`): raised ground and input fill in the noon theme only.
- **Ember** (`error`) / **Brick** (`error-noon`): invalid-field border and error text on night; error text on porcelain.

### Named Rules
**The One Gold Rule.** Gold is the only accent hue. Forest and espresso are grounds, not accents; no second highlight color is introduced for emphasis.

**The Hour Ground Rule.** Section grounds are chosen by time of evening: forest-deep for dusk, espresso for feature chapters and reservation, night for the rest. Index chapters declare their tone and the body cross-fades to it (1.2s). Noon (porcelain) is reserved for lunch content.

**The Bronze-on-Light Rule.** On porcelain, any gold text becomes bronze; gold remains only as a fill or dot.

## Typography

**Display Font:** Rosalia SK (patched Rosalia with Slovak and Hungarian glyphs; falls back to Josefin Sans, Georgia, serif)
**Body Font:** Josefin Sans (with Avenir Next, Segoe UI, system-ui)

**Character:** A hairline, high-contrast display face spoken softly in porcelain or gold, paired with a geometric sans that is quiet in running text and crisp in tracked uppercase UI.

### Hierarchy
- **Display** (400, `clamp(3.1rem, 2.1rem + 4.6vw, 6rem)`, 1.02): page h1s and the home h1 "Dobrý večer v Antoni".
- **Headline** (400, `clamp(2.6rem, 1.9rem + 3.2vw, 5rem)`, 1.02): section titles, chapter times, menu category titles, day titles.
- **Title** (400, `clamp(1.9rem, 1.5rem + 1.6vw, 2.9rem)`, 1.06): chapter names, chef names, course names; dish and plate names run a step lower (about 1.6–2.2rem) in Rosalia.
- **Subtitle** (Josefin 400, `clamp(1.35rem, 1.2rem + .6vw, 1.7rem)`, 1.25): sans h4.
- **Lead** (Josefin 300, `clamp(1.15rem, 1.05rem + .45vw, 1.4rem)`, 1.5): intro paragraphs, max 34–38ch.
- **Body** (Josefin 400, 1.0625rem, 1.62): running text, prose max 66ch; menu item names at 1.1875rem.
- **Label** (Josefin 600, .75rem / .6875rem, 0.14–0.18em, uppercase): navigation, buttons, field labels, column heads, menu slot names (Polievka, Menu 1), allergen summary.

### Named Rules
**The Single Weight Display Rule.** Rosalia SK is set at weight 400 with zero tracking and balanced wrapping; never bold, never letterspaced, never in uppercase.

**The Tabular Numbers Rule.** Prices, hours, gramáž, dates and indices use `tabular-nums lining-nums`; prices are gold (bronze on noon) and never wrap.

**The Optical Baseline Rule.** Josefin Sans sits high in its box; pills and buttons compensate with extra top padding (for example `4px 26px 0`) rather than symmetric padding.

## Layout

A centered wrap (max 1360px) with fluid gutter `clamp(20px, 5vw, 64px)` and section padding `clamp(72px, 10vw, 140px)`. The grid is 4 columns on mobile, 8 from 640px, 12 from 1100px, with gaps of 16/24/32px. Spacing follows a 4-8-12-16-24-32-48-64-96-128 scale.

Compositions are asymmetric and staggered rather than gridded: course bands of 5fr 4fr 3fr with descending offsets (96–128px), even items dropped by 96px in galleries, and split text/photo layouts (5/7, 7/5, 7fr 4fr) with the photo sticky on desktop. The home page runs as a vertical sequence of chapters; on desktop (≥1240px) a fixed time rail sits at the right edge and chapter content keeps a 210px corridor clear for it.

Breakpoints: 640px (grid 8), 900px (header grows to 84px, mobile bottom bar disappears, split heroes), 1100px (grid 12, sticky asides), 1240px (full desktop nav replaces the menu button, rail appears). On mobile a fixed bottom bar (68px) holds open status, call and "Rezervovať stôl"; body is padded to clear it.

Horizontal scrolling strips with snap (62–78% item width) replace grids on mobile; on desktop the main-course track is pinned and scrubbed horizontally with a gold progress hairline.

## Elevation & Depth

Flat by default. Depth comes from ground tone (night vs. night-2 vs. espresso), photographic scrims (gradients from `rgba(18,8,6,…)`), and 1px gold hairlines drawn as `inset 0 0 0 1px` box-shadows on pills, icon buttons and ghost buttons. Real shadows exist only on things that float above the page.

### Shadow Vocabulary
- **Ticket lift** (`box-shadow: 0 30px 60px -20px rgba(0,0,0,.55), 0 8px 18px -8px rgba(0,0,0,.35)`): the reservation success ticket.
- **Peek float** (`box-shadow: 0 30px 60px -25px rgba(0,0,0,.7)`): the cursor-following dish photo preview.
- **Sheet rise** (`box-shadow: 0 -20px 50px -20px rgba(0,0,0,.6)`): bottom sheets.
- **Hairline** (`box-shadow: inset 0 0 0 1px rgba(207,166,112,.5)`): outlined pills and round icon buttons; turns full gold on hover.

### Named Rules
**The Float-Only Shadow Rule.** A shadow means the element floats over the page (sheet, peek, ticket). Anything in flow is flat and separated by hairlines.

## Shapes

Three forms carry the system. **The arch** (`border-radius: 999px 999px 0 0`) comes from the logo and frames photographs, the hero door, the dish photo in sheets, the peek preview and the map; a softened variant with 4–6px bottom corners (`999px 999px 4px 4px`) is used for the success ticket, notice and next-up boxes, and the day tabs. **The pill** (999px) is every button, chip, slot, tag, catnav link and the language toggle; round 44–46px circles for icon buttons and socials. **The near-square** (2px) is reserved for form fields, the stepper and checkboxes, with 4px for summary boxes and wide pizza photos. Rectangular photos in `.frame` have no radius.

Lines are 1px, horizontal, and gold-tinted; arch outlines (`arch-line`) echo a frame 10px outside it with no bottom edge.

## Components

### Buttons
Solid, quiet pills with a rising wipe.
- **Shape:** full pill (999px), min height 52px (small: 42px).
- **Primary:** gold fill, night text, Josefin 600 .8125rem, 0.16em tracking, uppercase, padding `4px 26px 0`.
- **Hover / Focus:** a gold-soft layer slides up from below (420ms, `cubic-bezier(.16,1,.3,1)`); a trailing arrow shifts 4px right; active scales to .98; focus is a 2px gold outline offset 3px.
- **Ghost:** transparent with a 50% gold inset hairline; hover wipes in a porcelain fill with night text.
- **Noon:** espresso fill, porcelain text, forest wipe; ghost becomes espresso.
- **Loading / Disabled:** text hides behind a 18px spinning ring; disabled at 45% opacity.
- **Text link:** uppercase tracked label with a gold 1px underline that contracts to 30% on hover.

### Chips, Slots and Tags
- **Style:** pills with a 50% gold inset hairline, min height 44px, Josefin .9375rem; slots min-width 74px with tabular numerals.
- **State:** selected fills gold with night text (espresso/porcelain on noon); hover turns the hairline full gold; disabled slots drop to 35% with a strike-through.
- **Tag:** small uppercase pill (.6875rem); "new" variant filled gold.

### Inputs / Fields
- **Style:** 54px tall, 2px radius, 1px 50% gold border, faint white fill (3.5%) on night, white on noon; label above in uppercase tracked .6875rem muted.
- **Focus:** border turns gold plus a 3px `rgba(207,166,112,.22)` halo.
- **Error:** ember border and ember text below (brick on noon).
- **Stepper and checkbox** share the 2px field language; checked checkbox fills gold with a night tick. Selects use a gold chevron.

### Navigation
- **Header:** transparent over the hero, turning solid ground with a hairline after scroll, hiding on scroll down. Three-column grid with the monogram centered. Desktop (≥1240px): tracked uppercase links left and right, gold underline that draws from the left on hover/current; SK/HU toggle and a small primary button. Mobile: "Menu" with two hairlines (the shorter extends on hover) and the "Dnes na obed" today pill with a pulsing gold dot.
- **Drawer:** full-screen dusk-forest panel revealed with a top-down clip (800ms); Rosalia links staggered in by 50ms, with small uppercase stone annotations (Leto 2026, Po – Pi).
- **Bottom bar (mobile):** open status, round phone button, small primary "Rezervovať stôl"; slides away at the reservation chapter.
- **Category nav / day tabs:** sticky below the header; pill links in muted ink, active fills gold (espresso on noon). Day tabs are soft arches with day and date; today carries a gold dot, past days are struck through.

### Menu Lines
The system's list form, used for à la carte items, daily menu, hours, spaces, services, contact and glossary: rows separated by 1px gold-tinted rules (the first row also ruled on top), name left in Josefin 1.1875rem, price right in gold tabular numerals, description and meta below in smaller muted text. Items with a photo show a small arch glyph and open a bottom sheet; on desktop they also show a cursor-following arch peek.

### Sheets
Bottom sheet on mobile (night-2, 22px top corners, gold grip, slides up 600ms over a 62% dark backdrop); centered 560px dialog on desktop (6px radius, fades and rises 24px). Dish sheets lead with the photo in an arch.

### Evening Clock (signature)
On the home page each chapter declares a time and label; a Rosalia odometer in gold (bottom bar on mobile, the right-edge rail on desktop) rolls digit columns to the current chapter's time, and the rail's dots fill gold for the active chapter. The reservation chapter's clock takes the time chosen in the form. Chapter headings stack the gold time over the porcelain chapter name.

### Reservation Ticket
The one card in the system: a porcelain arch-topped ticket (420px max) with the monogram, bronze tracked label, guest name in Rosalia and a linen-ruled date/time block; it lands with a small rotate-and-rise and the ticket-lift shadow.

### Motion
Easing `cubic-bezier(.16,1,.3,1)` for exits and reveals, `cubic-bezier(.65,0,.35,1)` for symmetrical moves; durations 180ms (state), 420ms (wipes, underlines), 900ms (odometer). Scroll motion runs through Lenis and GSAP ScrollTrigger only when motion is allowed: words fade up 28px, photos reveal with a bottom-up curtain and settle from 1.14–1.2 scale, the hero arch opens to full bleed on a pinned scrub, the shared table photo rotates slowly as it passes. Reduced motion removes all of it.

## Do's and Don'ts

### Do:
- **Do** keep gold (#CFA670) as the single accent, and switch gold text to bronze (#77572B) on porcelain.
- **Do** frame hero and feature photographs in the arch (`999px 999px 0 0`), or let them run full bleed with a night scrim.
- **Do** set lists as ruled menu lines with gold tabular prices on the right.
- **Do** set Rosalia SK at weight 400 only, and use Josefin Sans for every label, button, field and paragraph.
- **Do** give pills and buttons top-heavy padding (`4px … 0`) to center Josefin optically.
- **Do** pick section grounds by the hour (forest-deep, espresso, night), and keep porcelain for lunch.
- **Do** honor `prefers-reduced-motion` by rendering every reveal in its final state.

### Don't:
- **Don't** lay content out as grids of boxed cards; the reservation ticket is the only card.
- **Don't** add a second accent color, gradients in gold, or gold ornament; luxury here is calm and exact.
- **Don't** set Rosalia in bold, in uppercase, or with tracking, and don't use it for UI labels or numbers that need to align (it has no tabular figures).
- **Don't** add drop shadows to in-flow elements; shadows are only for sheets, the peek and the ticket.
- **Don't** use gold chapter times outside the evening sequence and the reservation clock; on other pages headings stand alone.
- **Don't** round form fields like pills; fields stay at 2px.
