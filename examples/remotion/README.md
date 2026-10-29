# Add sound effects to a Remotion video with SFXMint MCP

[中文教程](README.zh-CN.md) · [Watch the 18-second video](preview/daybook.mp4)

[![Daybook video preview](preview/poster.jpg)](preview/daybook.mp4)

Give an AI coding agent four sound cues, find candidates through SFXMint MCP, then place the selected files on a Remotion timeline. This example uses a fictional budgeting app: a click at 2 seconds, a transition at 6, a success cue at 10, and a logo reveal at 14. It uses sound effects only—no narration or background music.

SFXMint provides AI-generated/synthesized CC0 library sounds. Library lookup needs no account or API key. The four selected sounds and their originals are included, so reproducing this video does not make sound API calls or consume a generation allowance. Remotion and its dependencies retain their own licenses; see [Remotion licensing](https://www.remotion.dev/docs/license).

## 1. Run the finished example

Use Node.js 22 or newer and npm:

```bash
git clone https://github.com/flreey/sfxmint-mcp.git
cd sfxmint-mcp/examples/remotion
npm ci
npm test
npm start
```

In Remotion Studio, select **Daybook** and press play with sound enabled. To render the full video:

```bash
npm run render
```

The result is `out/daybook.mp4` (18 seconds, 1280×720, 30fps). The first render may download Chrome Headless Shell. Alternatively, pass a local browser executable; on macOS with Google Chrome:

```bash
npm run render -- --browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

No separate Python or FFmpeg installation is required for previewing or rendering this example. Initial package/browser installation requires internet access.

## 2. Connect the MCP server to your coding agent

For Claude Code:

```bash
claude mcp add --transport http sfxmint https://sfxmint.com/mcp
```

For clients accepting `mcpServers` configuration:

```json
{
  "mcpServers": {
    "sfxmint": { "url": "https://sfxmint.com/mcp" }
  }
}
```

Use the Streamable HTTP endpoint above. Reconnect/restart the client if needed and confirm that it exposes `get_role_sound`, `get_sound_set`, `search_sounds`, and `get_sound`. Do not add a duplicate server if the SFXMint plugin already supplies one. Client configuration formats differ; see the [repository setup guide](../../README.md#quick-start).

You can independently check the live endpoint from this example:

```bash
npm run mcp:check
```

This script initializes an MCP session, lists the tools, and calls `get_sound` for the four chosen slugs. It checks the returned source URLs, licenses, and original hashes. It performs no file downloads or generation. This checks server connectivity; it does not configure your agent.

## 3. Give your agent this task

```text
Use the connected SFXMint MCP server to select sound effects for this
18-second Remotion app demo. Keep its visuals and event timing unchanged.

Cues:
- 2.0s: a gentle button click
- 6.0s: a soft airy page-transition whoosh
- 10.0s: a soft success chime
- 14.0s: a shimmering logo reveal

Use get_role_sound for named events, or search_sounds with concise sound
descriptions. Use get_sound_set if a kit fits the task. Request WAV where
the tool supports format. Inspect alternatives and closest/missing_terms;
do not treat near_matches or a ranking score as proof of suitability.

Show me the proposed sounds before replacing this example's approved files.
After I choose, download the returned WAV URLs into the project, keep the
originals, and update sounds.json with source pages, hashes, actual file
durations, and any processing. Never put keys or signed URLs in Git.

Place each selected file with Remotion's Audio component at the listed
time. Distinguish audible_ms from the complete file duration; don't cut
off a tail to match a displayed duration. Keep every cue inside 18 seconds.
Run npm test, render, and let me review the result with sound on.
Use library sounds only for this task; do not call generation tools.
```

MCP selects and describes sounds; Remotion handles timing and rendering. A render uses the local files already selected—it does not ask the model to select new sounds each time.

## 4. Understand the tool calls

These are tool arguments for the agent, not shell commands:

```json
{"tool":"get_role_sound","arguments":{"role":"button click","style":"soft","format":"wav"}}
{"tool":"search_sounds","arguments":{"query":"soft airy whoosh","format":"wav","limit":3}}
{"tool":"get_role_sound","arguments":{"role":"success","style":"soft","format":"wav"}}
{"tool":"search_sounds","arguments":{"query":"shimmering logo reveal","format":"wav","limit":3}}
```

Search results may change. The sample fixes these four choices rather than claiming every current first result is identical:

| Time | Event | Selected sound |
|---|---|---|
| 2s | Click | [Wooden UI click](https://sfxmint.com/sounds/ui-click-08) |
| 6s | Transition | [Short video whoosh](https://sfxmint.com/sounds/short-video-whoosh-04) |
| 10s | Success | [Soft rewarding success chime](https://sfxmint.com/sounds/feedback-success-51) |
| 14s | Reveal | [Shimmering logo reveal](https://sfxmint.com/sounds/logo-reveal-03) |

To inspect an exact choice, call `get_sound` with its slug, for example `{"slug":"logo-reveal-03"}`. Use the URLs the server returns. Files under `public/audio/` are processed copies; `originals/` retains the source files. [sounds.json](sounds.json) records both hashes, placement, and processed duration. See [SOUNDS.md](SOUNDS.md) for the recipe.

## 5. Put the files on the timeline

The relevant code in [src/index.tsx](src/index.tsx) is:

```tsx
const { fps } = useVideoConfig();

{cues.map((cue) => (
  <Audio
    key={cue.event}
    src={staticFile(cue.file)}
    from={Math.round(cue.atSeconds * fps)}
    volume={1}
    name={cue.event}
  />
))}
```

`Audio` comes from `@remotion/media`; `staticFile` and `useVideoConfig` come from `remotion`. At 30fps, the four start frames are 60, 180, 300, and 420. These local files have already been leveled; `volume={1}` preserves that processing. Preview any replacement at a suitable level rather than assuming all source files have equal loudness.

`audible_ms` describes measured audible activity; `duration_ms` and format metadata describe the complete file. A 275ms click can live in a one-second WAV with a quiet tail. Use actual file duration for timeline bounds and listen before trimming. See the [Remotion Audio reference](https://www.remotion.dev/docs/media/audio).

## When something does not fit

- **No candidate:** report the gap; inspect `closest` without silently dropping essential requirements. This tutorial does not automatically generate sounds.
- **Wrong sense of a word:** use an event role or clarify the source, e.g. computer mouse versus animal. Reject unrelated results even if the service ranks them highly.
- **Download limit:** the bundled example needs no downloads. For new selections, anonymous scripted downloads have a daily allowance; on `429`, pass on the service message and stop retrying. See [current limits](../../README.md#rate-limits--fair-use).
- **Stale browser or missing dependencies:** run `npm ci`, then retry with the browser option above if needed. All Remotion packages are pinned to the same version.
- **Technical checks pass but it sounds wrong:** audition in the video and replace the cue. Hashes and decoding checks do not judge creative suitability.

Dependency note: Remotion 4.0.539 requests Zod 4.5.4. This example overrides it to 4.6.6 to address [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5). Remotion may print a Zod version-mismatch warning. Type checking, preview startup and a complete local render were checked with this override; it is not an upstream compatibility guarantee. Keep the lockfile when reproducing the example.

This is one selected arrangement, not a benchmark claiming SFXMint beats every other sound library. You can reuse the pattern for product demos, UI walkthroughs, explainers, or short motion graphics.
