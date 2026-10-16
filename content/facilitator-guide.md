# Running the room

## What this workshop is

Participants take the visual identity of a real European government body — a parliament, a prime minister's office, a police force, an anti-corruption bureau — and clone it closely enough to be uncomfortable. Then they fill it with the documented corruption that same state has on record. Same font, same blue, same cookie banner. Opposite content.

The room already knows how to vibe-code. That's the entry ticket, not the lesson. What we teach is how to read design as an argument: the blue is a decision, the crest in the top-left corner is a decision, the passive voice in the press release is a decision. Once you can hear the argument, you can answer it in its own language.

The gap between how power looks and what power did is the whole piece. Participants build a website that lives inside that gap.

## Who it's for

- **People who already ship with a coding agent.** Designers, developers, artists, journalists, students in the last year of a design or media course. If someone has never prompted a model to write HTML, pair them with someone who has.
- **8 to 30 participants**, in teams of 2 to 4. Above 30, add a second facilitator. Teams of one work but tend to stall in phase 2.
- **Any city.** The kit covers 15 states so that no single audience is only looking at its own government. If you run it in one of those 15 countries, expect most of the room to pick the home team. Let them, but push at least one team abroad so the debrief has contrast.

## Formats

Three lengths. The standard one is 3h30. Everything in the deck is timed for it; the other two compress or stretch the same phases.

| Phase | 2h | 3h30 (standard) | Full day |
|---|---|---|---|
| 00 Boot | 10 | 20 | 30 |
| 01 Read the grammar | 15 | 30 | 45 |
| 02 Pick a target | 15 | 25 | 40 |
| Break | — | 10 | 60 (lunch) |
| 03 Clone the skin | 30 | 45 | 75 |
| 04 Pour in the story | 30 | 45 | 75 |
| 05 The register | 15 | 25 | 40 |
| 06 Debrief | 5 | 10 | 15 |
| 07 Publish (full day only) | — | — | 40 |
| **Total** | **120 min** | **210 min** | **420 min** |

In the 2h version, skip exercise E1 (do the authority inventory as a group, out loud, on the projector) and cap presentations at 60 seconds. In the full-day version, the extra time goes to the build phases and to phase 07, where teams publish their site with the disclaimers described below.

## Setup checklist

### Two weeks before

1. **Fork the repository** and publish it with GitHub Pages (steps in the README). The address you get is the address participants will use.
2. **Edit `assets/edition.js`.** Event name, city, venue, date, your names, the public address, and a submission link if you want one. These fill the home page, the deck cover and the exercise sheets.
3. **Recheck the watchlist** at the bottom of this guide. Court cases move. If one has changed, update the dossier and run `python3 build.py`.
4. **Decide your publication policy.** Will teams publish their sites after the session, or keep them in the room? Tell the host venue. Read the section on publishing below before you decide.

### The day before

1. Open every page of the kit on the venue's actual network. Government sites are heavy and some screenshots are 300 KB; the Style Bureau loads thumbnails first, but test it anyway.
2. Print the worksheets you need from the Exercises page: one **E2 Case card** and one **E4 Fact ledger** per team, one **E1 Authority inventory** per pair. Everything else can stay on screen.
3. Pick two "hero" bodies to demo live in phase 00 and 01. Good defaults: the Romanian DNA (an anti-corruption agency with a beautifully dated JSF interface) and the Dutch Rijksoverheid (one of the most disciplined state design systems in Europe).
4. Skim three dossiers so you can point a stuck team at a well-sourced case in under a minute.

### In the room

- Tables of 4 or 5, one projector, power strips at every table. Wifi details on the second slide.
- Deck open in a browser in full screen. Press **N** for speaker notes, **G** for the slide grid, **Q** to put the QR code back on screen at any moment.
- A timer people can see. Phases 03 and 04 eat time; the timer is how you get it back.

## Phase by phase

### 00 — Boot

**What happens.** Doors, coffee, logins. One government homepage full-bleed on the projector, no commentary. Then one question, out loud: *what is this website trying to make you feel?*

**Exercise E0 — First impressions.** Each person writes one word on a sticky note or in the chat. Read them back. Someone will say "trustworthy", someone "boring", someone "I need to renew my passport". All correct. That's the muscle we train today.

**Then** the brief in one line: clone the look, swap the story, keep to the record. Put the QR code up and get everyone into the Style Bureau.

### 01 — Read the grammar of authority

**What happens.** Fifteen minutes of talk, fifteen of exercise. You walk through four moves, pulling live examples from the Bureau:

- **The colour of the state.** 33 of the 45 bodies in the kit lead with a navy or royal blue, measured from the live pages. Blue says stable, cold, competent, and nobody ever lost a tender for choosing it. Point at the exceptions: the Bundestag's yellow, Romania's aubergine parliament, Poland's anti-corruption bureau in deep red, Portugal's teal parliament.
- **Typographic seriousness.** The most common body face in the register is Roboto — Google's house typeface — on 7 of the 45 sites, ahead of Arial. The state would prefer to look like it has no author, and has quietly outsourced the authorship to Google. Then show the countries that went further and wrote their type into rules: France's *Système de Design de l'État* with the Marianne typeface, Italy's *Bootstrap Italia* with Titillium Web, the German federal BundesSans, the Dutch *Rijkshuisstijl*. A design system is a government deciding what authority looks like and enforcing it.
- **The furniture of legitimacy.** Crest top-left. Breadcrumb starting at "Home". Accessibility statement in the footer. A cookie banner that cites a law by article number. Document tables full of reference codes. None of it is decoration.
- **The voice.** Read three of the language samples from the Bureau out loud. Passive constructions. "Measures have been adopted." This is the register teams will write in later, so they need to hear it now.

**Exercise E1 — Authority inventory** (pairs, 15 min). Pick any body in the Bureau. Find six devices that make it look official and sort them into colour, type, furniture or voice. Score each one from 1 to 5 for how much authority it adds. Report back the single strongest one.

**The thesis**, stated plainly so people can quote it at the bar: *the more neutral a design looks, the more work it's doing.*

### 02 — Pick a target, read your file

**What happens.** Teams choose a country and a body. Anti-corruption agencies are the crowd favourite for obvious reasons. Then they read the dossier. Properly. Twenty minutes of reading will feel long. It's meant to.

**Exercise E2 — Case card** (teams, 25 min). One case, one angle. The card asks for the single number that hurts, the date, the court, the legal status of every person they plan to name, and the source link for each. The angles, on the slide:

- **The receipt** — one transaction, fully sourced, given the full institutional treatment.
- **The org chart** — the connection map rendered as an "Our structure" page.
- **The timeline** — the scandal as a "Milestones" or "Our history" page.
- **The press release that should have existed** — the announcement, in the institution's own voice, admitting it.
- **The monument** — a convicted figure given the reverence normally reserved for founders.

**Your job:** walk the tables and push for specificity. "Corruption happened" is boring. A named treasurer, a parallel ledger, a sentence confirmed by the Supreme Court on a given date — that's a website.

**Go / no-go.** Before a team leaves phase 02, check their card against the rule: every named person must have a status line saying *convicted, final* or *resigned*. If it says anything else, they pick someone else. No exceptions. The rule is what lets us do this at all.

### 03 — Clone the skin

**What happens.** The vibe-coding they already know, with the bar raised. The goal isn't "a site that looks governmental". It's "a site that looks like *that* body".

**Exercise E3 — Chrome before content** (teams, 45 min).

1. In the Bureau, open the target and press **Copy style prompt**. Paste it into the agent. It carries fonts, palette, layout anatomy, signature patterns, real wording and a slice of the institution's CSS.
2. Generate the empty shell. Placeholder text only. Get header, crest position, menu, footer and cookie banner right first. The chrome is where the authority lives.
3. Drop the screenshot into the chat as a reference and ask the agent to close the gap.
4. At minute 35, **swap screens** with the next table for two minutes. The other team names the one thing that gives the clone away. Fix it.

**The line to keep repeating:** *would a civil servant sign this off?* If not, it's usually the spacing, a font that's slightly too friendly, or a shadow trying too hard. The state does not do drop shadows for fun.

### 04 — Pour in the story

**What happens.** The skin is ready. Now the content, written in the voice from phase 01.

**The technique is tonal deadpan.** The more damning the fact, the more boringly official the presentation. A prison sentence announced like a change to bin collection days. A missing sum listed in a budget table with a footnote. Never wink. The moment you wink, it becomes a joke and the reader is let off the hook.

**Exercise E4 — Deadpan rewrite and fact ledger** (teams, 45 min).

- Every hard fact on the page gets a line in the ledger: claim, source link, legal status. Real institutions cite themselves obsessively; so do we.
- Stay inside the record. If it isn't in the dossier or its sources, it isn't on the site.
- Keep the institution's own words where possible. Their euphemisms are funnier than ours.
- **Wink audit** at minute 40: each team finds its funniest line and rewrites it more boringly. It will get better.

Start calling time at minute 40. People will want one more page. Done and pointed beats sprawling and vague.

### 05 — The register of works

**Exercise E5 — Spokesperson** (90 seconds per team). Present the site in character, as the institution's press officer launching it. No stepping out of role to explain the joke. If it needs explaining, that's the note.

The room answers two questions after each one: *did the look sell the authority?* and *did the gap land?* We critique the illusion, not the people.

### 06 — Debrief

**Exercise E6 — Spot it in the wild** (whole room, 5 min). Name one interface outside government that uses the same tricks. Banking apps, airline cancellation flows, "we've updated our privacy policy" pop-ups. There's never a shortage.

Close the loop: nobody practised vibe-coding today. They practised reading design as rhetoric and writing back in the same language. That skill doesn't stay in the room.

### 07 — Publish (full day only)

Teams add the disclaimers below, deploy to GitHub Pages or Netlify, and post their link to the submission page. Build a gallery from the links at the end of the day.

## When things go sideways

| What you hear | What's going on | What you do |
|---|---|---|
| "It looks like a generic government site, not a specific one." | They skipped the screenshot step. | Send them back to step 3 of E3. Drop the full screenshot into the agent and ask for a diff. |
| "The joke is too broad." | They're winking. | Make them rewrite their most damning line in the most boring tone possible. Read it out. |
| "We can't find a good fact." | They skimmed. | Sit down and read one case with them, out loud. It takes four minutes. |
| "Can we name this person?" | Fair question. | Check the dossier's status line. Convicted (final) or resigned: yes. Anything else: no. |
| "The agent keeps making it modern and pretty." | Models are trained on nice websites. | Paste the line from the style prompt again: *Do not modernise it. Do not make it pretty.* Then ask it to remove every rounded corner and shadow. |
| "Our site broke and we have ten minutes." | It happens. | Present the screenshot of the last working version. The idea carries it. |
| A team wants to target a person not in the dossiers. | Enthusiasm. | Only if they can show a final conviction or resignation from a primary source in the room. Otherwise, back to the files. |

## Publishing participants' work

Inside the room, clones can be as exact as the team can make them. Outside the room, a near-perfect copy of a police website is a different object. If sites go online:

- **Add a permanent banner** at the top of every page: *Parody / satire. Not affiliated with [institution]. Made at the Redecorating Power workshop.* Make it impossible to miss.
- **Replace official crests, seals and logos** with an invented emblem. Several European countries restrict use of state coats of arms; the invented one is usually funnier anyway.
- **No forms that collect anything.** No login boxes, no "report a crime" inputs, no payment fields. Nothing a visitor could mistake for a real service.
- **Add `<meta name="robots" content="noindex">`** so the page doesn't compete with the real institution in search results.
- **Keep the fact ledger as a visible footnotes section.** Sources on the page are the best defence there is.
- **Use a neutral address.** Don't register domains that imitate the institution's.

The kit itself stays inside these rules: screenshots are reproduced for criticism and education, and named people meet the inclusion rule. Participants' work should too.

## Facts expire: the watchlist

The dossiers are a snapshot taken in October 2026. These cases were unresolved at that point and are the ones most likely to have moved. Check each one before an edition, update the dossier if needed, and run `python3 build.py`.

| Country | Case | Status at snapshot | What to check |
|---|---|---|---|
| France | Libyan financing (Sarkozy) | First-instance conviction for criminal conspiracy only; appeal verdict scheduled for 30 Nov 2026 | Appeal outcome. If upheld and final, it can move into the convicted list. |
| Portugal | Operação Marquês (Sócrates) | Trial ongoing since July 2025; no verdict | Any verdict, and whether it becomes final |
| Portugal | EDP case (Manuel Pinho) | Convicted on appeal; Supreme Court appeal pending | Supreme Court ruling |
| Malta | Caruana Galizia murder (Yorgen Fenech) | Jury trial opened 1 July 2026 | Verdict and appeals |
| Czechia | Čapí hnízdo (Babiš) | Two acquittals annulled; parliament declined to lift immunity, March 2026 | Immunity votes, any new proceedings |
| Spain | ERE Andalusia (Griñán, Chaves) | Convictions annulled by the Constitutional Court, July 2024; resentencing pending | New sentence from the Seville court |
| Germany | Wirecard (Braun) | Trial ongoing | Verdict |
| Belgium | Qatargate (remaining defendants) | Proceedings ongoing for most; Panzeri plea deal 2023 | Trial dates and outcomes |
| Hungary | Völner–Schadl bribery case | No first-instance verdict as of April 2026 | Verdict |
| Bulgaria | KTB collapse (Vasilev) | Unresolved; no final conviction | Any final ruling |
| Poland | Nowak, GetBack, Ziobro | Proceedings ongoing | Verdicts, extradition news |

**The rule for updates is the same as the rule for the kit.** A person moves into the named list only with a final conviction or a documented resignation, and the status line names the court and the year.

## Maintaining the kit

- **Fixing a fact:** edit `content/dossiers/<country>.md`, run `python3 build.py`, commit.
- **Fixing a style token:** edit `content/styles/<country>.json`, run the build, commit.
- **Adding a country:** add a style JSON with three bodies (copy an existing file for the schema), three screenshots named `<country>_<type>.webp` in `/screenshots` plus thumbnails in `/screenshots/thumbs`, and a dossier in `content/dossiers`. Run the build. The Bureau, the deck's data slides and the dossier list all pick it up.
- **Taking new screenshots and re-measuring tokens:** run `python3 tools/capture.py` (all bodies) or `python3 tools/capture.py spain_police` (one). It declines optional cookies, saves the screenshot and thumbnail, measures colours and fonts from the live page and writes them back into the style file. A handful of sites block data-centre networks or answer with a CAPTCHA; run it from an ordinary connection, or capture those by hand. Never solve a CAPTCHA with automation.
- **Rebuilding the PowerPoint:** `cd tools && npm install && npm run pptx`. Set `siteUrl` in `assets/edition.js` first and the file gets real QR codes.

## Credits

Kit by Domestic Data Streamers. Interface type: Roobert where installed, Geist (SIL Open Font License, bundled) everywhere else. QR codes by qrcode-generator (MIT). Screenshots of public government websites reproduced for criticism, parody and education. Research snapshot October 2026.
