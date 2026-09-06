# SFXMint MCP Server

Free CC0 sound effects for AI agents. Search 4,600+ sounds, get permanent hotlinkable MP3/WAV URLs, and generate new SFX from text — **no API key, no signup**.

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

Prefer a skill over a server? This repo also ships an Agent Skill that uses the plain HTTP API — no MCP server required:

```bash
npx skills add flreey/sfxmint-mcp -y
```

The agent chooses a role for one event, a set for several events, or structured search for a description or gap. These are task branches, not a required sequence. Library files, other permitted sources and local synthesis can be mixed. The skill includes React / Phaser / plain-HTML integration examples. Source: [`skills/sfxmint/SKILL.md`](skills/sfxmint/SKILL.md).

## Tools

| Tool | What it does |
|---|---|
| `get_role_sound` | Ask by event — `button-click`, `purchase-success`, `error`, `coin`, `rain-loop`. Returns a file-checked candidate plus alternates; plain-English aliases work |
| `get_sound_set` | Candidates grouped by event and style (15 sets: `ui-crisp`, `retro-game`, `checkout`, `platformer`, `ai-coding-tool`, …) |
| `search_sounds` | Free-text retrieval with explicit duration, loop and format requirements; hard constraints can produce no candidates |
| `get_sound` | Full metadata for one sound (incl. generation prompt, measured acoustics, license) |
| `generate_sound` | Text-to-SFX (output 1–12 s, takes 10–60 s to render); returns permanent URLs. Rate-limited 3/day per client |
| `get_job` | Status of a generation job |

## Requirements, processing and acceptance

Use REST structured search (`response=structured&limit=3`) or the matching MCP parameters to pass required duration, loop and format explicitly. Check returned requirements; do not substitute `near_matches`. Scores and match types describe ranking, not listening confidence. Legacy `loopable` does not prove a seamless loop.

Sets accept `format=wav|mp3`: `download_urls` follows the requested format, legacy `urls` stays MP3, and `missing_roles` identifies incomplete sets. File decoding and hashes do not certify scene suitability. `content_check` is scoped to the exact scene, event, format and SHA256; unknown content is not accepted.

Task-permitted trimming, filtering and level changes are allowed. Retain originals, source URLs, license, processing recipes and new file hashes; re-measure requirements and preview the result. Changed bytes and new scenes do not inherit the original acceptance. Online generation is separate and only used when the task permits it.

Use URLs returned by the live API, without inventing or rewriting them. See the [API docs](https://sfxmint.com/api/docs), [Phaser guide](https://sfxmint.com/guides/phaser-web-game-sounds), [React guide](https://sfxmint.com/guides/react-app-sounds), and [download example](https://sfxmint.com/examples/download-sounds.mjs).

## Rate limits & fair use

- Search/metadata: no auth, generous limits
- Generation: 3/day per IP on the MCP path (browser path: 5/day)
- Hotlinking is allowed and encouraged; files are served with long-lived immutable caching

## Contact

hello@sfxmint.com · https://sfxmint.com
