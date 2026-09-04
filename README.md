# SFXMint MCP Server

Free CC0 sound effects for AI agents. Search 4,600+ sounds, get permanent hotlinkable MP3/WAV URLs, and generate new SFX from text — **no API key, no signup**.

- **Endpoint (Streamable HTTP):** `https://sfxmint.com/mcp`
- **Docs:** https://sfxmint.com/api/docs
- **Registry:** published as [`com.sfxmint/sounds`](https://registry.modelcontextprotocol.io/v0/servers?search=sfxmint) on the official MCP Registry
- **License of all audio:** [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) — public domain, commercial use welcome, no attribution required

Every sound is AI-generated (Stable Audio) or procedurally synthesized, so the library is copyright-clean by construction. Audio URLs are permanent, immutable, CORS-enabled and free to hotlink — safe to embed directly in generated apps, games and videos.

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

It teaches the agent to ask by *purpose* (role → set → search) instead of guessing keywords, and carries ready-to-paste React / Phaser / plain-HTML snippets. Source: [`skills/sfxmint/SKILL.md`](skills/sfxmint/SKILL.md).

## Tools

| Tool | What it does |
|---|---|
| `get_role_sound` | **Start here.** Ask by event — `button-click`, `purchase-success`, `error`, `coin`, `rain-loop`. Returns one QA-checked default plus alternates; plain-English aliases work |
| `get_sound_set` | A coherent kit for one product in one call (15 sets: `ui-crisp`, `retro-game`, `checkout`, `platformer`, `ai-coding-tool`, …) |
| `search_sounds` | Free-text search over 4,600+ sounds; never returns empty (semantic fallback) |
| `get_sound` | Full metadata for one sound (incl. generation prompt, measured acoustics, license) |
| `generate_sound` | Text-to-SFX (output 1–12 s, takes 10–60 s to render); returns permanent URLs. Rate-limited 3/day per client |
| `get_job` | Status of a generation job |

## Example

> "Find me a rain ambience loop" → `search_sounds(query: "rain ambience")` →
> `https://sfxmint.com/dl/ambience-rain-01.mp3` (CC0, hotlink-safe, 11 s)

## Rate limits & fair use

- Search/metadata: no auth, generous limits
- Generation: 3/day per IP on the MCP path (browser path: 5/day)
- Hotlinking is allowed and encouraged; files are served with long-lived immutable caching

## Contact

hello@sfxmint.com · https://sfxmint.com
