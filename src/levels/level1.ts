import { LevelSettings } from "../types/main";

export default {
  mapVertices: [
    {x: 0, y: 0}, {x: 500, y: 0}, {x: 500, y: 800}, {x: 0, y: 800}
  ],
  bus: {
    position: {x: 250, y: 150},
    w: 51, h: 244,
    textureSrc: "bus.png",
  },
  obstacles: [],
  parkingBox: {
    position: {x: 210, y: 450},
    w: 80, h: 300,
    textureSrc: "parkingBox.png",
  },
  audiosSrc: [
    {
      name: "accelerating",
      src: "accelerating.wav",
      volume: 0.4,
    },
    {
      name: "braking",
      src: "braking.wav",
      volume: 0.5,
    },
    {
      name: "engine",
      src: "engine.mp3",
      volume: 0.3,
    },
    {
      name: "backup-beep",
      src: "backup-beep.mp3",
      volume: 0.2,
    },
  ],
} as LevelSettings;