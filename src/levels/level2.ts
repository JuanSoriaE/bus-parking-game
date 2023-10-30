import { LevelSettings } from "../types/main";

export default {
  mapVertices: [
    {x: 0, y: 0}, {x: 1050, y: 0}, {x: 1050, y: 1250}, {x: 0, y: 1250}
  ],
  bus: {
    position: {x: 325, y: 150},
    w: 51, h: 244,
    textureSrc: "bus.png",
    audiosSrc: [
      ["accelerating", "accelerating.wav"],
      ["braking", "braking.wav"],
      ["engine", "engine.mp3"],
      ["backup-beep", "backup-beep.mp3"],
    ],
  },
  obstacles: [
    {
      position: {x: 0, y: 0},
      w: 200, h: 650,
    },
    {
      position: {x: 0, y: 650},
      w: 600, h: 400,
    },
    {
      position: {x: 450, y: 0},
      w: 400, h: 400,
    },
    {
      position: {x: 850, y: 0},
      w: 200, h: 1050,
    },
    {
      position: {x: 0, y: 1050},
      w: 1050, h: 200,
    },
  ],
  parkingBox: {
    position: {x: 685, y: 700},
    w: 80, h: 300,
    textureSrc: "parkingBox.png",
  },
} as LevelSettings;