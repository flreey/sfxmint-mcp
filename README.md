# SFXMint MCP Server

Free CC0 sound effects — [describe a sound to find it](https://sfxmint.com), preview, and download WAV/MP3. **No signup, no API key, no attribution.** Agents can [ask by role](https://sfxmint.com/roles), [take one of 18 sets](https://sfxmint.com/sets), or search the library, and get permanent hotlinkable URLs. With an [API key](https://sfxmint.com/dashboard/keys), they can also generate a sound the library lacks.

- **Endpoint (Streamable HTTP):** `https://sfxmint.com/mcp`
- **Docs:** https://sfxmint.com/api/docs
- **Registry:** published as [`com.sfxmint/sounds`](https://registry.modelcontextprotocol.io/v0/servers?search=sfxmint) on the official MCP Registry
- **License of all audio:** [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) — public domain, commercial use welcome, no attribution required

Sounds are AI-generated or procedurally synthesized and offered under CC0. Audio URLs are immutable, CORS-enabled and free to hotlink. Download files into the project when offline playback is required; preview suitability in the actual app or game.

## Quick start

Claude Code:

```bash
claude mcp add --transport http sfxmint https://sfxmint.com/mcp
```

Cursor / generic `mcpServers` config:

```json
{ "mcpServers": { "sfxmint": { "url": "https://sfxmint.com/mcp" } } }
```

To let the agent generate sounds too, add your API key (only `generate_sound` and `get_generation` use it):

```bash
claude mcp add --transport http sfxmint https://sfxmint.com/mcp --header "Authorization: Bearer $SFXMINT_API_KEY"
```

```json
{ "mcpServers": { "sfxmint": { "url": "https://sfxmint.com/mcp", "headers": { "Authorization": "Bearer sfx_live_…" } } } }
```

Prefer a skill over a server? This repo also ships an Agent Skill that uses the plain HTTP API — no MCP server required:

```bash
npx skills add flreey/sfxmint-mcp -y
```

The agent chooses a role for one event, a set for several events, or structured search for a description or gap. These are task branches, not a required sequence. Library files, other permitted sources and local synthesis can be mixed. The skill includes React / Phaser / plain-HTML integration examples. Source: [`skills/sfxmint/SKILL.md`](skills/sfxmint/SKILL.md).

No agent involved? The [`sfxmint`](https://www.npmjs.com/package/sfxmint) CLI puts the same files in a project directly:

```bash
npx sfxmint add coin jump hit
```

It writes the audio plus a `sounds.json` manifest recording each file's source URL, SHA-256 and license, and ships a small Web Audio runtime (`createSoundboard`) for first-gesture unlock, overlapping cues and a persisted mute. Source: [flreey/sfxmint-npm](https://github.com/flreey/sfxmint-npm).

## Tools

| Tool | What it does |
|---|---|
| `get_role_sound` | Ask by event — `button-click`, `purchase-success`, `error`, `coin`, `notification`. Returns a file-checked candidate plus alternates; plain-English aliases work |
| `get_sound_set` | Candidates grouped by event and style (18 sets: `ui-crisp`, `retro-game`, `checkout`, `platformer`, `ai-coding-tool`, …) |
| `search_sounds` | Free-text retrieval with explicit duration, loop and format requirements; hard constraints can produce no candidates |
| `get_sound` | Full metadata for one sound (incl. a short description, measured acoustics, license) |
| `generate_sound` | Make a new sound from a description when the library has nothing suitable. Needs an API key; one credit per generation of up to four CC0 WAV takes, given back if none can be made |
| `get_generation` | Status of a generation and fresh download links for its takes |

The four library tools never need a key. Generation needs an [SFXMint API key](https://sfxmint.com/dashboard/keys) in the `Authorization` header (a free account comes with free credits); without one, `generate_sound` answers `api_key_required` with `isError`. Ask the user before spending credits, and let them listen to the takes. The same generation is available over REST as `POST https://sfxmint.com/api/v1/orders` ([docs](https://sfxmint.com/api/docs#authentication)). `get_job` and `POST /api/v1/generate` stay retired; existing job records remain readable at `GET /api/v1/jobs/{job_id}`.

## Requirements, processing and acceptance

Use REST structured search (`response=structured&limit=3`) or the matching MCP parameters to pass required duration, loop and format explicitly. Check returned requirements; do not substitute `near_matches`. Scores and match types describe ranking, not listening confidence. Legacy `loopable` does not prove a seamless loop.

Sets accept `format=wav|mp3`: `download_urls` follows the requested format, legacy `urls` stays MP3, and `missing_roles` identifies incomplete sets. File decoding and hashes do not certify scene suitability. `content_check` is scoped to the exact scene, event, format and SHA256; unknown content is not accepted.

Task-permitted trimming, filtering and level changes are allowed. Retain originals, source URLs, license, processing recipes and new file hashes; re-measure requirements and preview the result. Changed bytes and new scenes do not inherit the original acceptance. The API and MCP server have no generation path; generating on the website, local synthesis or an external service remains a separate, task-authorized choice.

Use URLs returned by the live API, without inventing or rewriting them. See the [API docs](https://sfxmint.com/api/docs), [Phaser guide](https://sfxmint.com/guides/phaser-web-game-sounds), [React guide](https://sfxmint.com/guides/react-app-sounds), and [download example](https://sfxmint.com/examples/download-sounds.mjs).

## Rate limits & fair use

- Search/metadata: no auth, generous limits
- Hotlinking is allowed and encouraged; files are served with long-lived immutable caching

## Contact

hello@sfxmint.com · https://sfxmint.com
