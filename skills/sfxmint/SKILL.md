---
name: sfxmint
description: "Add free CC0 sound effects to a web app or game without an API key, using the SFXMint API (sound roles, coherent sound sets, search) and permanent hotlinkable MP3/WAV URLs. Use when the user asks to add sounds, audio feedback or UI sounds to an app, wants click / notification / success / error / alert sounds, game sound effects (coin, jump, hit, explosion, power-up, game over), ambience loops (rain, forest, drone), or asks where to get free sound effects for an app, game, video, prototype or demo. Not for music, voice or speech."
---

# SFXMint — free CC0 sound effects for apps and games

SFXMint (https://sfxmint.com) is a library of 4,600+ CC0 sound effects with a free JSON API: no API key, no signup, no attribution, no hard limit on lookups. Every audio URL is permanent and hotlinkable. This skill is about picking the right sound *without listening to it*: ask by purpose (role), take a coherent set, and only then search.

## Use this skill when

- The user wants sound effects or audio feedback in an app, game, video, prototype or demo.
- The user names a cue by what it is for: "button click", "purchase success", "error beep", "coin pickup", "dialogue blip", "rain loop", "task done notification".
- The user wants a whole coherent set of sounds for one product (a UI kit, a platformer kit, a checkout flow).

## Do not use it for

- Music, melodies, jingles with a tune, voice, speech, narration, TTS. SFXMint has none of these. Say so plainly and do not search for them.
- Real recordings of a specific product, brand or person. Every SFXMint sound is AI-generated or synthesized.

## Decision flow (follow in this order)

1. **Role** — the user names an event or interaction.
   `GET https://sfxmint.com/api/v1/roles/{role}?via=skill` returns one deterministic, QA-checked default (`slug`, `mp3_url`, `wav_url`) plus `alternates`. Role ids and aliases both work: `button-click`, `click`, `purchase-success`, `dialogue-blip`, `rain-loop`, `error`, `notification`, `coin`, `jump`, `explosion`. Unknown role → HTTP 404 with `roles_url`; then go to step 3. Full list: `GET https://sfxmint.com/api/v1/roles?via=skill`.
   Optional `style=crisp|soft|spacious` re-ranks the family by measured acoustics; the default `balanced` is the most typical variant.
2. **Set** — the user needs several sounds for one product.
   `GET https://sfxmint.com/api/v1/sets/{id}?via=skill` returns `urls` (role → MP3) ready to paste into code, and `sounds` with alternates. Pick the id from the table below; keep the whole product on one set so the cues sound related.
3. **Search** — free text that matches no role.
   `GET https://sfxmint.com/api/v1/search?q={words}&limit=5&via=skill`. Read `match` on each result: `role` and `exact` are reliable; `partial` and `semantic` are best guesses — say so to the user and offer the next two results as alternatives. Add `&category=` (ui, feedback, retro-game, impact, ambience, horror, transition, …) when the family is obvious.
4. **Generation** — only when nothing above fits. Do **not** call `POST /api/v1/generate` from this skill: it is the browser flow and requires a Turnstile token. Either point the user to https://sfxmint.com/generate (free, 5/day), or, if the SFXMint MCP server (`https://sfxmint.com/mcp`) is configured in this environment, call its `generate_sound` tool (3/day). If it returns `rate_limited` with a `note`, relay the note to the user verbatim.

Never invent a slug or URL. Use only URLs returned by the API, unchanged.

## Sound sets — `GET https://sfxmint.com/api/v1/sets/{id}?via=skill`

| id | use for | roles (keys of `urls`) |
|---|---|---|
| `ui-crisp` | dashboards, editors, admin panels, desktop apps — dry, tight, bright | click hover toggle swipe pop menu modal alert notification confirm success error |
| `ui-soft` | mobile apps, chat, meditation and habit trackers — darker, gentler, short | same roles as ui-crisp |
| `ui-spacious` | TV and console menus, kiosks, VR, game UIs — room reverb, longer tails | same roles as ui-crisp |
| `retro-game` | game jams, arcade and platformer prototypes, pixel-art games | pickup jump hit powerup laser explosion gameover |
| `chat-app` | chat apps, social feeds, community and dating apps | send receive like delete refresh camera unlock error |
| `saas-app` | dashboards, editors, admin panels, project tools | click hover toggle menu modal drag undo save error notification |
| `checkout` | shops, marketplaces, ticketing, in-app purchases | add_to_cart purchase success error countdown reward |
| `learning` | language apps, quizzes, flashcards, kids' education | tap correct wrong streak level_up celebration progress |
| `puzzle-game` | match-3, merge, word and tile games | match combo bonus slide win lose countdown celebration |
| `platformer` | platformers, action and adventure prototypes, game jams | jump land coin hit sword gunshot explosion footsteps door checkpoint death |
| `horror-game` | horror games, escape rooms, thrillers, haunted attractions | drone stinger heartbeat creak growl thunder footsteps door wind ambience |
| `video-editing` | YouTube and short-form editing, podcasts, presentations | whoosh swoosh riser braam impact pop scratch ding applause laugh boing typing shutter cash |
| `smart-device` | IoT apps, appliances, wearables, kiosks, in-car UIs | power_on power_off doorbell alarm lock unlock beep vibrate notification error |
| `wellness` | meditation timers, sleep and focus apps, yoga classes | bowl chime gong bell kalimba rain ocean forest wind fireplace |
| `ai-coding-tool` | AI agents, CLIs and coding tools — task lifecycle cues | started done failed needs_input warning notification |

## API quick reference

Base `https://sfxmint.com`. JSON, `Access-Control-Allow-Origin: *`, no key. Append `via=skill` to every `/api/v1/` request (see Attribution).

| Request | Response |
|---|---|
| `GET /api/v1/roles?via=skill` | `[{role, label, aliases, families, audiences, loopable, url}]` |
| `GET /api/v1/roles/{role}?style=balanced&via=skill` | `{role, label, aliases, audiences, style, license:"CC0-1.0", slug, title, duration_ms, loopable, acoustics, mp3_url, wav_url, page_url, alternates:[same shape], family, family_url, url}` — `style` = balanced (default) / crisp / soft / spacious; 404 → `{error:"not_found", message, roles_url}` |
| `GET /api/v1/sets?via=skill` | `[{id, name, tagline, use_for, style, roles, url, page_url}]` |
| `GET /api/v1/sets/{id}?via=skill` | `{id, name, tagline, use_for, style, license, page_url, sounds:{<role>:{role, label, slug, title, duration_ms, loopable, acoustics, mp3_url, wav_url, page_url, alternates:[slug], family_url}}, urls:{<role>: mp3_url}}` |
| `GET /api/v1/search?q=&category=&limit=20&via=skill` | `[{slug, title, duration_ms, tags, category, loopable, acoustics, score, match, license, mp3_url, wav_url, page_url}]` — `match` = role / exact / partial / semantic, `score` 1 → 0.5 |
| `GET /api/v1/sounds/{slug}?via=skill` | full metadata incl. `prompt`, `acoustics`, `loopable`, `peaks_url` |
| `https://sfxmint.com/dl/{slug}.mp3` · `.wav` | the audio itself — no query parameters here (see Hotlink rules) |

`acoustics` = `{attack_ms, tail_ms, centroid_hz, character:["bright","punchy","tight"]}` measured from the audio (`null` if unmeasured). Use it to choose between alternates: short `tail_ms` for UI cues, low `centroid_hz` for soft/dark, high for bright. `loopable: true` = seamless loop; use the WAV for gapless `loop=true` playback (the MP3 has codec padding at the seam).

```bash
curl "https://sfxmint.com/api/v1/roles/purchase-success?via=skill"
curl "https://sfxmint.com/api/v1/sets/saas-app?via=skill"
curl "https://sfxmint.com/api/v1/search?q=camera+shutter&limit=5&via=skill"
```

## Integration snippets

### React / any web app — zero dependencies

Paste the `urls` map from a set response (or the `mp3_url` values from role lookups) into one module:

```ts
// src/sfx.ts
const URLS = {
  click: "https://sfxmint.com/dl/ui-click-30.mp3",
  save: "https://sfxmint.com/dl/feedback-success-22.mp3",
  error: "https://sfxmint.com/dl/feedback-error-34.mp3",
} as const;

export type Sfx = keyof typeof URLS;
const cache = new Map<Sfx, HTMLAudioElement>();
let muted = false;

export function setMuted(m: boolean) {
  muted = m;
}

export function play(name: Sfx, volume = 0.5) {
  if (muted || typeof window === "undefined") return;
  let a = cache.get(name);
  if (!a) {
    a = new Audio(URLS[name]);
    a.preload = "auto";
    cache.set(name, a);
  }
  a.currentTime = 0;
  a.volume = volume;
  a.play().catch(() => {}); // blocked until the first user gesture — ignore
}
```

Use: `onClick={() => { play("click"); save(); }}`. Guide: https://sfxmint.com/guides/react-app-sounds

### Phaser 3

```js
const SFX = { jump: "https://sfxmint.com/dl/retro-game-jump-06.mp3", coin: "https://sfxmint.com/dl/retro-game-coin-13.mp3" }; // urls map from GET /api/v1/sets/platformer?via=skill

preload() {
  for (const [key, url] of Object.entries(SFX)) this.load.audio(key, url);
}
create() {
  this.sound.play("coin", { volume: 0.6 });
}
```

Loops: `this.sound.add("ambience", { loop: true, volume: 0.3 }).play()` with a `loopable: true` WAV; start it after `Phaser.Sound.Events.UNLOCKED` if `this.sound.locked`. Guide: https://sfxmint.com/guides/phaser-web-game-sounds

### Plain HTML

```html
<audio id="sfx-click" src="https://sfxmint.com/dl/ui-click-30.mp3" preload="auto"></audio>
<button onclick="const a = document.getElementById('sfx-click'); a.currentTime = 0; a.volume = 0.5; a.play().catch(() => {})">
  Save
</button>
```

## Hotlink rules

- `/dl/{slug}.mp3` and `/dl/{slug}.wav` are permanent and immutable (`Cache-Control: immutable`, CORS `*`). Hotlinking is allowed and encouraged: no key, no referer check, no expiry.
- Never append query parameters to `/dl/` URLs — `via=skill` belongs on `/api/v1/` requests only. Never rewrite, shorten or proxy them.
- Bundling is fine: copying the files into `public/` or `assets/` is allowed (CC0) and is the right choice for offline builds and app stores.
- Do not mirror the catalog in bulk; fetch what the project uses.

## Attribution — what `via=skill` does

Adding `via=skill` to API requests only tells SFXMint that the request came through this skill, so the maintainer can see whether the skill is being used. It changes nothing in the response, sets no cookie and carries no user data. Omitting it is fine; do not describe it to the user as required.

## UX rules (flag these if the user's design breaks them)

- Play only after a user gesture (click, key, tap). Browsers block audio before the first interaction and `audio.play()` rejects — catch it; never play on mount or page load.
- Ship a mute toggle and remember it (localStorage). Default volume ≤ 0.6; UI cues 0.3–0.5.
- UI cues ≤ 300 ms, one sound per event, no sound on hover on touch devices, never on every keystroke.
- Preload the 3–5 sounds used most (`preload="auto"`); MP3 for size, WAV for loops or when quality matters.
- Keep one set (or one style) per product so cues sound like they belong together.

## License

CC0-1.0 — commercial use, no attribution, no signup.
