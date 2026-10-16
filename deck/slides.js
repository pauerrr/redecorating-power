/* ==========================================================================
   REDECORATING POWER — the deck script.
   One source for both the HTML deck (deck/index.html) and the PowerPoint
   export (tools/build-pptx.js). Edit text here; both outputs follow.
   Slide types: cover, join, phase, question, exercise, statement, timeline,
   rule, palette, fonts, systems, annotate, voice, list, ladder, compare,
   brk, close.
   ========================================================================== */
(function (root) {

const PHASES = {
  "00": { name: "Boot", color: "lime" },
  "01": { name: "Read the grammar", color: "sky" },
  "02": { name: "Pick a target", color: "yellow" },
  "03": { name: "Clone the skin", color: "lilac" },
  "04": { name: "Pour in the story", color: "red" },
  "05": { name: "The register", color: "blue" },
  "06": { name: "Debrief", color: "ink" }
};

/* minutes per block for each format: Boot, Grammar, Target, Break, Skin, Story, Register, Debrief, Publish */
const FORMATS = {
  "2h":       [10, 15, 15, 0, 30, 30, 15, 5, 0],
  "3h30":     [20, 30, 25, 10, 45, 45, 25, 10, 0],
  "full-day": [30, 45, 40, 60, 75, 75, 40, 15, 40]
};
const BLOCKS = [
  { ph: "00", name: "Boot" }, { ph: "01", name: "Read the grammar" }, { ph: "02", name: "Pick a target" },
  { ph: "—", name: "Break" }, { ph: "03", name: "Clone the skin" }, { ph: "04", name: "Pour in the story" },
  { ph: "05", name: "The register" }, { ph: "06", name: "Debrief" }, { ph: "07", name: "Publish" }
];

const SLIDES = [

  { t: "cover",
    notes: "Doors open. Leave this up while people arrive. If wifi is shaky, say so now and point at the next slide." },

  { t: "join",
    notes: "Everyone opens the kit on their own laptop now. Wait until most screens show the Style Bureau. Press Q at any time later to bring the QR code back." },

  { t: "phase", ph: "00", title: "Boot", line: "Before anyone explains anything.",
    notes: "Short. The point of this phase is to feel the design before we name it." },

  { t: "question", shot: "romania_anti-corruption",
    q: "What is this website trying to make you feel?",
    caption: "dna.ro — Direcția Națională Anticorupție, Romania",
    notes: "No commentary. Sixty seconds of silence is fine. Then take three answers. Someone will say 'trustworthy', someone 'boring', someone 'I need to renew my passport'. All correct." },

  { t: "exercise", id: "E0", ph: "00", title: "First impressions", time: "5 min", who: "Everyone", out: "One word each",
    steps: ["Look at the homepage on the wall for sixty seconds. Don't read it. Feel it.",
            "Write one word for what it wants you to feel.",
            "Read the words out. They stay on the wall until the debrief."],
    link: "exercises/#e0",
    notes: "Collect the words on sticky notes or in the chat. Keep them visible — you'll return to them in phase 06." },

  { t: "statement", big: "Clone the look of power. Fill it with the record.",
    small: "You already know how to vibe-code. Today is about what the code can't tell you: why a ministry's website feels the way it does, and how to turn that feeling against it.",
    notes: "This is the whole brief. Say it once, slowly. The room knows how to prompt a model; we are not teaching that." },

  { t: "timeline", title: "How the next hours go",
    notes: "The run of show adapts to the format set in assets/edition.js. Point out where the break is; people relax once they know." },

  { t: "rule", title: "Convicted or resigned. Nothing else.",
    points: ["Every person named in the kit holds a final conviction for a corruption-related offence, or resigned over a documented scandal and is described only as having resigned.",
             "On trial, acquitted, or cleared on appeal: left out, named by role only. Several were pulled during research for exactly that reason.",
             "Truth is a defence. It also makes the work sharper: when you can't exaggerate, you have to be precise."],
    notes: "Read this slide out loud. It is the condition that lets us do any of this. If someone pushes back ('but everyone knows he did it'), the answer is: then the court will say so eventually, and we'll update the file." },

  /* ------------------------------------------------------------- 01 */
  { t: "phase", ph: "01", title: "Read the grammar of authority", line: "Colour, type, furniture, voice.",
    notes: "Fifteen minutes of talk, fifteen of exercise. Keep the talk moving; let the data slides do the work." },

  { t: "palette", title: "The colour of the state",
    line: "The lead colour of all 45 bodies, measured from the live pages.",
    notes: "Count the blues out loud if the room is quiet. Blue says stable, cold, competent, and nobody ever lost a tender for choosing it. Then point at the exceptions: the Bundestag's yellow, Romania's aubergine parliament, the Polish anti-corruption bureau in deep red, Portugal's teal parliament." },

  { t: "fonts", title: "The state would rather look authorless",
    line: "Most common body typeface across the 45 sites.",
    notes: "Roboto is Google's house typeface. The joke writes itself, so let it: the state wanted to look authorless and outsourced the authorship to Google. Arial is the old way of saying the same thing." },

  { t: "systems", title: "Some states write their type into the rules",
    items: [
      { country: "France", name: "Système de Design de l'État", font: "Marianne", shot: "france_central-government" },
      { country: "Italy", name: "Bootstrap Italia", font: "Titillium Web", shot: "italy_government" },
      { country: "Germany", name: "Corporate Design der Bundesregierung", font: "BundesSans", shot: "germany_police" },
      { country: "Netherlands", name: "Rijkshuisstijl", font: "RijksSans", shot: "netherlands_central-government" }
    ],
    notes: "A design system is a government deciding what authority looks like and then enforcing it across hundreds of sites. France even names its typeface after the national symbol. These are the easiest targets to clone precisely, because the rules are public." },

  { t: "annotate", shot: "spain_parliament", title: "The furniture of legitimacy",
    points: ["Crest, top left. Always.",
             "A welcome in five languages.",
             "Breadcrumb that starts at Home.",
             "Accessibility link in the footer.",
             "A cookie banner that cites a law by article number: Ley 34/2002, artículo 22.2.",
             "Document lists full of reference codes."],
    caption: "congreso.es — Congreso de los Diputados, Spain",
    notes: "None of this is decoration. Each item says: a serious institution built this and followed procedure. When teams clone a site, these are the parts that make it believable." },

  { t: "voice", title: "The voice",
    picks: [["france_police", 3], ["greece_central-government", 2], ["romania_anti-corruption", 2], ["poland_parliament", 1]],
    notes: "Read each one in the original language if anyone in the room can, then the translation. Passive constructions, careful hedges, consent by not objecting. This is the register teams will write in during phase 04." },

  { t: "statement", big: "The more neutral a design looks, the more work it's doing.", dark: true,
    notes: "The thesis. Pause after it. People will quote it at the bar; let them." },

  { t: "exercise", id: "E1", ph: "01", title: "Authority inventory", time: "15 min", who: "Pairs", out: "Six devices, scored",
    steps: ["Open any body in the Style Bureau. Look at the screenshot, then the original.",
            "List six things that make it look official. Sort each: colour, type, furniture or voice.",
            "Score each from 1 to 5 for how much authority it adds.",
            "Report the strongest one to the room in one sentence."],
    link: "exercises/#e1",
    notes: "Walk the room. Pairs usually find colour and type quickly and miss furniture. Nudge them toward breadcrumbs, cookie banners, reference numbers." },

  /* ------------------------------------------------------------- 02 */
  { t: "phase", ph: "02", title: "Pick a target, read your file", line: "One body. One dossier. One case. One angle.",
    notes: "Teams form now if they haven't. Two to four people each." },

  { t: "list", kicker: "Choosing", title: "How to pick",
    items: [{ h: "Pick the body first", d: "Use the Style Bureau filters. Anti-corruption agencies are the crowd favourite. Draw your own conclusions." },
            { h: "Then open its country's dossier", d: "Every Style Bureau file links to it. Read it properly — twenty minutes will feel long, and that's the point." },
            { h: "Stay away from home, at least once", d: "If the whole room picks its own country, push one team abroad. The debrief needs contrast." },
            { h: "Pick one case, not three", d: "A focused site beats a survey. You can always make a second one at home." }],
    notes: "If people ask which country has the 'best' material: they all do. The Netherlands has a cabinet that resigned over a benefits scandal; Malta's file reads like a thriller; Romania's anti-corruption directorate lists final convictions on its own homepage." },

  { t: "list", kicker: "Five angles", title: "Pick one",
    items: [{ h: "The receipt", d: "One transaction, fully sourced, given the full institutional treatment." },
            { h: "The org chart", d: "The connection map, rendered as the 'Our structure' page every ministry has." },
            { h: "The timeline", d: "The scandal as a 'Milestones' or 'Our history' page." },
            { h: "The press release that should have existed", d: "The announcement, in the institution's own voice, admitting it." },
            { h: "The monument", d: "A convicted figure honoured like a founder." }],
    notes: "The receipt is the safest for a first build. The monument is the most dangerous and the funniest; make sure the person qualifies under the rule." },

  { t: "ladder", title: "Specific beats loud",
    rungs: ["Corruption happened in Spain.",
            "A governing party kept a secret slush fund.",
            "In May 2018 the Audiencia Nacional found the governing party had run a parallel financing structure since at least 1989–90. The network's ringleader got 51 years and 11 months; the Tribunal Supremo confirmed it in October 2020."],
    source: "Spain dossier, case 2.1 (Gürtel)",
    notes: "Read the three rungs in order. The third one is a website. The first one is a tweet nobody remembers. Push every team up the ladder during the exercise." },

  { t: "exercise", id: "E2", ph: "02", title: "Case card", time: "25 min", who: "Team", out: "One case, one angle, every name checked",
    steps: ["Pick a country and one body from the Style Bureau.",
            "Read that country's dossier. Choose one case and one angle.",
            "Fill the card: the number that hurts, the date, the court, the source.",
            "Every person you will name gets a status line: convicted (final) or resigned.",
            "Show a facilitator. Go / no-go before you leave this phase."],
    link: "exercises/#e2",
    notes: "This is the checkpoint that keeps the session clean. Check every card. If a name doesn't have 'convicted, final' or 'resigned' next to it in the dossier, the team picks someone else. No exceptions." },

  { t: "brk", title: "Break", line: "The state runs on coffee too.",
    notes: "Ten minutes in the standard format. Start the next block on time; teams with momentum will thank you." },

  /* ------------------------------------------------------------- 03 */
  { t: "phase", ph: "03", title: "Clone the skin", line: "Chrome before content.",
    notes: "This is the vibe-coding they already know, with the bar set higher: not 'looks governmental', but 'looks like that exact body'." },

  { t: "list", kicker: "Workflow", title: "Four moves",
    items: [{ h: "Copy the style prompt", d: "Style Bureau → your body → Copy style prompt. Paste it into your agent. Fonts, palette, layout, patterns, wording and reference CSS, already assembled." },
            { h: "Build the empty shell", d: "Header, emblem, menu, breadcrumb, footer, cookie banner. Placeholder text only. The authority lives in the chrome." },
            { h: "Diff against the screenshot", d: "Drop the full screenshot into the chat. Ask for a list of every difference, then for the fixes." },
            { h: "Swap screens", d: "At minute 35, trade laptops with the next table for two minutes. They name the one thing that gives you away." }],
    notes: "Demo step 1 live on the projector with one of your hero bodies. It takes thirty seconds and saves ten questions." },

  { t: "list", kicker: "The civil-servant test", title: "Would they sign it off?",
    items: [{ h: "Spacing too generous", d: "Government sites are dense. Air is a luxury the budget didn't cover." },
            { h: "A font that's slightly too friendly", d: "If it has personality, it isn't the state's." },
            { h: "Rounded corners and soft shadows", d: "The state does not do drop shadows for fun." },
            { h: "Missing furniture", d: "No breadcrumb, no accessibility link, no cookie legalese: no authority." }],
    notes: "If the agent keeps producing a modern startup site, the line to paste is: 'Do not modernise it. Remove every rounded corner, shadow and animation the original does not have.'" },

  { t: "exercise", id: "E3", ph: "03", title: "Chrome before content", time: "45 min", who: "Team", out: "An empty shell a civil servant would sign off",
    steps: ["Copy style prompt, paste into your agent.",
            "Ask for the empty shell only. Placeholder text.",
            "Add the screenshot. Ask for every difference, then fix.",
            "Minute 35: swap screens for two minutes. Fix what they spot.",
            "Tick the furniture checklist on the sheet."],
    link: "exercises/#e3",
    notes: "Call the swap at minute 35 loudly. It's the most useful two minutes of the build." },

  /* ------------------------------------------------------------- 04 */
  { t: "phase", ph: "04", title: "Pour in the story", line: "The more damning the fact, the more boring the delivery.",
    notes: "Now the content. Everything they write uses the institution's own register." },

  { t: "compare", title: "Never wink",
    left: { label: "Winking", text: "LOL, turns out the ruling party had a secret piggy bank for 20 years." },
    right: { label: "Deadpan", head: "Notice 10/2020", text: "The Tribunal Supremo has confirmed sentences of up to 51 years and 11 months in the Gürtel case. The party has been designated a 'beneficiario a título lucrativo'. No action is required from citizens." },
    source: "Facts: Spain dossier, case 2.1",
    notes: "Read the left one. Some laughs. Read the right one. Better laughs, and a slightly worse feeling. That second reaction is what we're after. The wink lets the reader off the hook; the deadpan doesn't." },

  { t: "exercise", id: "E4", ph: "04", title: "Deadpan rewrite & fact ledger", time: "45 min", who: "Team", out: "A page with every fact sourced and no winks",
    steps: ["Write the content in the institution's voice. Steal its phrases from the Style Bureau.",
            "Every hard fact gets a ledger row: claim, source link, status.",
            "Keep their words where you can. Their euphemisms are funnier than yours.",
            "Minute 40 — wink audit: rewrite your funniest line more boringly.",
            "Build a Sources section from the ledger."],
    link: "exercises/#e4",
    notes: "Start calling time at minute 40. People will want one more page. Done and pointed beats sprawling and vague." },

  /* ------------------------------------------------------------- 05 */
  { t: "phase", ph: "05", title: "The register of works", line: "Ninety seconds each. In character.",
    notes: "Line up the laptops or the screen-share order before you start. Transitions eat time." },

  { t: "exercise", id: "E5", ph: "05", title: "Spokesperson", time: "90 sec per team", who: "Team, in character", out: "A launch, not an explanation",
    steps: ["One person is the institution's press officer. The others stand behind looking serious.",
            "Launch the site as if it were a real service update.",
            "No stepping out of role. If it needs explaining, that's the note.",
            "The room answers two questions: did the look sell the authority? Did the gap land?"],
    link: "exercises/#e5",
    notes: "Keep a visible timer. Applause between teams is the transition. Critique the illusion, not the people." },

  /* ------------------------------------------------------------- 06 */
  { t: "phase", ph: "06", title: "Debrief", line: "Nobody practised vibe-coding today.",
    notes: "Go back to the wall of words from E0." },

  { t: "statement", big: "You practised reading design as rhetoric, and writing back in the same language.",
    small: "That doesn't stay in this room. Onboarding flows that fake friendliness, cancellation pages that fake helpfulness, 'we've updated our privacy policy' pop-ups that fake consent. Aesthetics are always making an argument.",
    notes: "Then run E6: everyone names one interface outside government that uses the same tricks." },

  { t: "exercise", id: "E6", ph: "06", title: "Spot it in the wild", time: "5 min", who: "Everyone", out: "One example each",
    steps: ["Name one interface outside government that uses the same authority devices.",
            "Say which device, and what it was protecting.",
            "Look at the words from the start. Did any of them change?"],
    link: "exercises/#e6",
    notes: "Five minutes, quick fire. End on a laugh if you can." },

  { t: "list", kicker: "If you publish", title: "Outside the room, a perfect clone is a different object",
    items: [{ h: "A permanent banner", d: "Parody / satire. Not affiliated with the institution. Made at the Redecorating Power workshop." },
            { h: "An invented emblem", d: "Replace official crests and seals. Several states restrict their use; the invented one is usually funnier." },
            { h: "No forms, no logins", d: "Nothing a visitor could mistake for a real service." },
            { h: "noindex, sources visible, neutral address", d: "Don't compete with the real site in search. Keep the ledger on the page. Don't register look-alike domains." }],
    notes: "Read this even if nobody plans to publish today. Someone will, next week." },

  { t: "close",
    notes: "Point at the QR code: the kit stays online. Thank the host. If there's a submission link, put it on screen and leave it there while people pack up." }
];

const DECK = { SLIDES, PHASES, FORMATS, BLOCKS };
if (typeof module !== "undefined" && module.exports) module.exports = DECK; else root.DECK = DECK;
})(this);
