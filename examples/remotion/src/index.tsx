import React from "react";
import { Audio } from "@remotion/media";
import { Composition, registerRoot, staticFile, useVideoConfig } from "remotion";
import { Daybook } from "./Daybook";
import cues from "../sounds.json";

function Video() {
  const { fps } = useVideoConfig();
  return (
    <>
      <Daybook />
      {cues.map((cue) => (
        <Audio
          key={cue.event}
          src={staticFile(cue.file)}
          from={Math.round(cue.atSeconds * fps)}
          volume={1}
          name={cue.event}
        />
      ))}
    </>
  );
}

registerRoot(() => (
  <Composition
    id="Daybook"
    component={Video}
    width={1280}
    height={720}
    fps={30}
    durationInFrames={540}
  />
));
