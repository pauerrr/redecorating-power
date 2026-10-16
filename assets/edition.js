/* ==========================================================================
   EDITION SETTINGS — the only file you need to edit for a new edition.
   Everything here shows up on the home page, the deck cover, the
   exercise sheets and the QR codes. Leave a field as "" to hide it.
   ========================================================================== */
window.EDITION = {
  // Where and when. Example: event: "Festival Name", city: "Lisbon", date: "14 March 2027"
  event: "",
  city: "",
  venue: "",
  date: "",
  time: "",                 // e.g. "10:00–13:30"

  // Who runs it
  facilitators: ["Domestic Data Streamers"],

  // Length of the session. Pick "2h", "3h30" or "full-day" — the run of show adapts.
  format: "3h30",

  // Public address of this kit, e.g. "https://your-user.github.io/redecorating-power/"
  // Leave empty and the pages work it out from the browser address.
  siteUrl: "https://pauerrr.github.io/redecorating-power/",

  // Optional: a form, Padlet, Are.na channel or shared doc where teams post their URLs
  submitUrl: "",

  // Optional: hashtag or handle to share results
  hashtag: "#RedecoratingPower",

  // Optional: wifi details to show on the deck's first slides
  wifi: { network: "", password: "" }
};
