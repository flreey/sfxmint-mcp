# SFXMint

The `sfxmint` MCP server finds free CC0 sound effects for apps, games and videos (https://sfxmint.com). No API key is needed to search or download.

- One named event (button click, coin pickup, game over): `get_role_sound`.
- Several events for one app or game: `get_sound_set`.
- A described sound or a gap: `search_sounds`. When nothing matches every word, it returns the closest sounds and says what is missing; judge them and let the user listen.
- One sound by id: `get_sound`.

Download the chosen files into the project and keep a `SOUNDS.md` listing each file with its `page_url`, the CC0 license and that the sounds are AI-generated (a game on Steam or itch.io discloses that). The server's own instructions cover download allowances and generating a missing sound.
