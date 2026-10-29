# Audio provenance and processing

All four sounds are AI-generated/synthesized SFXMint library assets under CC0-1.0. No attribution is required. Source URLs, original SHA-256, processed SHA-256, gain, duration and placement are recorded in [sounds.json](sounds.json). Originals remain in `originals/`; processed playback files are in `public/audio/`.

Processing used for this selected arrangement:

1. Decode to stereo PCM16 at 48kHz.
2. Remove leading near-silence with FFmpeg `silenceremove=start_periods=1:start_duration=0:start_threshold=-50dB:start_silence=0.005`. Keep the tail.
3. Compute RMS across 20ms windows above -45dBFS. Apply a constant gain toward -24dBFS active RMS, capped so the PCM peak is at most -3dBFS. Actual gain and file duration are in the manifest. This is level matching, not a guarantee of identical perceived loudness.
4. Place at 2, 6, 10 and 14 seconds without looping or time stretching.

The processed files are bundled so users do not need the processing tools to reproduce playback. `npm test` checks original and output hashes, PCM structure, signal and timeline bounds. No inference about listening suitability is made by those checks. Audition any changed file in context.

The example's selected arrangement was reviewed by the project owner. This is not blanket approval for new edits or new scenes.
