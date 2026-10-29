import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const cues = JSON.parse(await readFile(new URL("sounds.json", root), "utf8"));
assert.equal(new Set(cues.map((cue) => cue.event)).size, cues.length);
for (const cue of cues) {
  const file = await readFile(new URL(`public/${cue.file}`, root));
  const original = await readFile(new URL(cue.original, root));
  assert.equal(createHash("sha256").update(file).digest("hex"), cue.sha256, cue.event);
  assert.equal(createHash("sha256").update(original).digest("hex"), cue.originalSha256, cue.event);
  assert.equal(file.toString("ascii", 0, 4), "RIFF");
  assert.equal(file.toString("ascii", 8, 12), "WAVE");
  let sampleRate, byteRate, blockAlign, samples;
  for (let offset = 12; offset + 8 <= file.length;) {
    const id = file.toString("ascii", offset, offset + 4);
    const size = file.readUInt32LE(offset + 4);
    assert.ok(offset + 8 + size <= file.length, "Truncated WAV chunk");
    if (id === "fmt ") {
      assert.ok(size >= 16);
      assert.equal(file.readUInt16LE(offset + 8), 1, "Expected PCM");
      assert.equal(file.readUInt16LE(offset + 22), 16, "Expected 16-bit audio");
      sampleRate = file.readUInt32LE(offset + 12);
      byteRate = file.readUInt32LE(offset + 16);
      blockAlign = file.readUInt16LE(offset + 20);
    }
    if (id === "data") samples = file.subarray(offset + 8, offset + 8 + size);
    offset += 8 + size + (size % 2);
  }
  assert.ok(samples?.length && byteRate > 0 && blockAlign > 0);
  assert.equal(samples.length % blockAlign, 0);
  const seconds = samples.length / byteRate;
  assert.ok(Math.abs(seconds - cue.fileDurationSeconds) <= 1 / sampleRate);
  assert.ok(cue.atSeconds >= 0 && cue.atSeconds + seconds <= 18, "Cue exceeds video");
  let peak = 0;
  for (let i = 0; i < samples.length; i += 2) peak = Math.max(peak, Math.abs(samples.readInt16LE(i)));
  assert.ok(peak > 0 && peak < 32767, "Empty or clipped PCM");
  console.log(`${cue.event}: hashes OK; ${seconds.toFixed(3)}s; ends at ${(cue.atSeconds + seconds).toFixed(3)}s`);
}
