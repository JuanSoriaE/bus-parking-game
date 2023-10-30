import { LevelSettings } from "../types/main";

export default {
  mapVertices: [
    {x: 0, y: 0}, {x: 500, y: 0}, {x: 500, y: 800}, {x: 0, y: 800}
  ],
  bus: {
    position: {x: 250, y: 150},
    w: 51, h: 244,
    textureSrc: "bus.png",
    audiosSrc: [
      ["accelerating", "accelerating.wav"],
      ["braking", "braking.wav"],
      ["engine", "engine.mp3"],
      ["backup-beep", "backup-beep.mp3"],
    ],
  },
  obstacles: [],
  parkingBox: {
    position: {x: 210, y: 450},
    w: 80, h: 300,
    textureSrc: "parkingBox.png",
  },
} as LevelSettings;