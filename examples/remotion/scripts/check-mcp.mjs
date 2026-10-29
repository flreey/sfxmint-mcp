// Read-only metadata check: no key, downloads, generation or account changes.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const endpoint = "https://sfxmint.com/mcp";
const cues = JSON.parse(await readFile(new URL("../sounds.json", import.meta.url), "utf8"));
const headers = { "Content-Type": "application/json", Accept: "application/json, text/event-stream" };
let id = 0;
async function rpc(method, params, notification = false) {
  const message = { jsonrpc: "2.0", method, params };
  if (!notification) message.id = ++id;
  const response = await fetch(endpoint, {
    method: "POST", headers, body: JSON.stringify(message), signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`MCP ${method}: HTTP ${response.status}`);
  const session = response.headers.get("mcp-session-id");
  if (session) headers["Mcp-Session-Id"] = session;
  if (notification) { await response.body?.cancel(); return; }
  let data;
  if (response.headers.get("content-type")?.includes("text/event-stream")) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (!data) {
        const chunk = await reader.read();
        if (chunk.done) break;
        buffer += decoder.decode(chunk.value, { stream: true });
        buffer = buffer.replaceAll("\r\n", "\n");
        let boundary;
        while ((boundary = buffer.indexOf("\n\n")) >= 0) {
          const event = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 2);
          const body = event.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trimStart()).join("\n");
          if (body) { const candidate = JSON.parse(body); if (candidate.id === message.id) data = candidate; }
        }
      }
    } finally { await reader.cancel(); }
  } else data = await response.json();
  if (!data || data.error) throw new Error(JSON.stringify(data?.error ?? "No MCP response"));
  assert.equal(data.id, message.id);
  return data.result;
}

const server = await rpc("initialize", { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "sfxmint-remotion-tutorial", version: "1.0.0" } });
headers["MCP-Protocol-Version"] = server.protocolVersion;
await rpc("notifications/initialized", {}, true);
const { tools } = await rpc("tools/list", {});
for (const name of ["get_sound", "get_role_sound", "get_sound_set", "search_sounds"]) assert.ok(tools.some((tool) => tool.name === name), name);
for (const cue of cues) {
  const result = await rpc("tools/call", { name: "get_sound", arguments: { slug: cue.slug } });
  assert.ok(!result.isError, JSON.stringify(result));
  const sound = result.structuredContent ?? JSON.parse(result.content.find((part) => part.type === "text").text);
  assert.equal(sound.slug, cue.slug);
  assert.equal(sound.wav_url, cue.sourceUrl);
  assert.equal(sound.license, "CC0-1.0");
  const wav = sound.format_metadata?.wav;
  assert.equal(wav?.sha256 ?? wav?.remote_sha256, cue.originalSha256);
  console.log(`${cue.event}: MCP metadata verified; file=${sound.duration_ms}ms, audible=${sound.audible_ms ?? "unknown"}ms`);
}
