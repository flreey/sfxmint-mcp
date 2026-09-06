---
name: sfxmint
description: "Add free CC0 sound effects to a web app or game without an API key, using the SFXMint API (sound roles, sets grouped by event, search) and permanent hotlinkable MP3/WAV URLs. Use when the user asks to add sounds, audio feedback or UI sounds to an app, wants click / notification / success / error / alert sounds, game sound effects (coin, jump, hit, explosion, power-up, game over), ambience loops (rain, forest, drone), or asks where to get free sound effects for an app, game, video, prototype or demo. Not for music, voice or speech."
---

# SFXMint — free CC0 sound effects for apps and games

SFXMint (https://sfxmint.com) is a library of 4,600+ CC0 sound effects with a free JSON API: no API key, no signup, no attribution, no hard limit on lookups. Every audio URL is permanent and hotlinkable. Use it as an option for the user's task: a role for one event, a set for several related events, or search for a description. Text matches and file checks do not prove listening suitability. The user's task determines whether to use library files, other sources, local synthesis or a mixture.

## Use this skill when

- The user wants sound effects or audio feedback in an app, game, video, prototype or demo.
- The user names a cue by what it is for: "button click", "purchase success", "error beep", "coin pickup", "dialogue blip", "rain loop", "task done notification".
- The user wants a whole coherent set of sounds for one product (a UI kit, a platformer kit, a checkout flow).

## Do not use it for

- Music, melodies, jingles with a tune, voice, speech, narration, TTS. SFXMint has none of these. Say so plainly and do not search for them.
- Real recordings of a specific product, brand or person. Every SFXMint sound is AI-generated or synthesized.

## Choose the lookup that fits the task

These are task branches, not a required sequence. A whole-project request can start with a set; use roles or search for gaps. Do not force a library result when another permitted approach fits better.

1. **Role** — the user names an event or interaction.
   `GET https://sfxmint.com/api/v1/roles/{role}?via=skill` returns a file-QC-eligible default (`slug`, `mp3_url`, `wav_url`) plus `alternates` when the ready gate is enabled. Role ids and aliases both work: `button-click`, `click`, `purchase-success`, `dialogue-blip`, `rain-loop`, `error`, `notification`, `coin`, `jump`, `explosion`. Unknown role → HTTP 404 with `roles_url`; use the index or search. An unverified result is not a content acceptance. Full list: `GET https://sfxmint.com/api/v1/roles?via=skill`.
   Optional `style=crisp|soft|spacious` re-ranks the family by measured acoustics; the default `balanced` is the most typical variant.
2. **Set** — the user needs several sounds for one product.
   `GET https://sfxmint.com/api/v1/sets/{id}?format=wav&via=skill` returns `sounds` with alternates, `download_urls` for the requested format, and `missing_roles`. Legacy `urls` always maps roles to MP3. A shared set or style does not certify that cues work together: preview them in the actual product.
3. **Search** — free text that matches no role.
   `GET https://sfxmint.com/api/v1/search?q={words}&response=structured&limit=3&via=skill`. Pass required `max_duration_ms`, `loop=true|false`, and `format=wav|mp3` explicitly. Read candidate `checks` and `unverified_requirements`; hard conditions apply before the limit. `match` and `score` describe retrieval and ranking only. Do not promote `near_matches` into compliant candidates. If no candidate meets a hard condition, report the gap or use another task-permitted approach. Add `&category=` when the family is known.
4. **Generation** — optional only when permitted by the user's task. Local synthesis does not require exhausting this library. Online generation is a separate capability, not an automatic fallback: `POST /api/v1/generate` requires the browser's Turnstile token; the configured MCP server offers `generate_sound`. Respect task restrictions, service quotas and returned errors.

## Content acceptance and local files

Five core platformer events (jump, land, coin, hit, win / level-up) expose `content_check`: verified, unverified or rejected, scoped to scene, role, format and exact file SHA256. Unknown previews remain available but are not accepted content. A decision in `platformer-demo-v1` does not certify another game. The platformer core is reviewed only when all five pass in that scene and format. Keep the selected format's metadata and checksums; WAV evidence does not certify MP3.

When the task permits processing, you may trim, filter or adjust levels. Preserve downloaded originals, source URLs, CC0 license, the processing recipe, and separate SHA256 hashes for originals and outputs. Re-measure delivery conditions and preview the processed result in context; changed bytes do not inherit the original content review. Processing is work to record, not automatically a failure. Do not claim suitability or user acceptance from decoding, waveform analysis or an automated playback check.

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
| `platformer` | platformers, action and adventure prototypes, game jams | jump land coin hit win sword gunshot explosion footsteps door checkpoint death |
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
| `GET /api/v1/search?q=&category=&limit=20&max_duration_ms=&loop=&format=wav|mp3&via=skill` | legacy array `[{slug, title, duration_ms, tags, category, loopable, acoustics, score, match, license, mp3_url, wav_url, page_url}]`; add `response=structured` for `request_id`, parsed constraints, candidate `checks`, `near_matches`, `unverified_requirements` and diagnostics. `score` is ranking only. |
| `GET /api/v1/sounds/{slug}?via=skill` | full metadata incl. `prompt`, `acoustics`, `loopable`, `peaks_url` |
| `https://sfxmint.com/dl/{slug}.mp3` · `.wav` | the audio itself — no query parameters here (see Hotlink rules) |

`acoustics` = `{attack_ms, tail_ms, centroid_hz, character:["bright","punchy","tight"]}` measured from the audio (`null` if unmeasured). Use it to choose between alternates: short `tail_ms` for UI cues, low `centroid_hz` for soft/dark, high for bright. `recommendation_status` separates eligible, unverified and excluded rows. `loopable` is a legacy flag; `loop_status: "prepared"` marks prepared loop metadata, while seam listening evidence and MP3 padding remain separate and may be unknown. Prompt/tag matches are retrieval evidence, not content listening.

```bash
curl "https://sfxmint.com/api/v1/roles/purchase-success?via=skill"
curl "https://sfxmint.com/api/v1/sets/saas-app?via=skill"
curl "https://sfxmint.com/api/v1/search?q=camera+shutter&response=structured&limit=3&via=skill"
```

## Integration snippets

### React / any web app — zero dependencies

After checking conditions, use URLs from the current API response; the values below illustrate the module shape, not certified current recommendations. Download files locally for offline use, then map events to those local files:

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

Loops: inspect the returned `loop_status` and seam evidence, then use a WAV with `loop: true` when your playback test accepts it; start it after `Phaser.Sound.Events.UNLOCKED` if `this.sound.locked`. Guide: https://sfxmint.com/guides/phaser-web-game-sounds

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
- Preview the selected cues together. A common set or style is an organizational aid, not proof of coherence.

## License

CC0-1.0 — commercial use, no attribution, no signup.

## Download files into a project

First use needs no MCP setup. Use REST directly or the dependency-free example at https://sfxmint.com/examples/download-sounds.mjs (Node 20+). The example downloads original files and does not process them. Preserve source URLs, per-format SHA256 and CC0 license; apply task-permitted processing separately as described above. It can download unreviewed previews and records their status, so successful download is not acceptance. Preview event suitability in context and report missing sounds or unresolved qualities.
