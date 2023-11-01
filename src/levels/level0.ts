import { LevelSettings } from "../types/main";

export default {
  mapVertices: [
    {x: 0, y: 0}, {x: 5000, y: 0}, {x: 5000, y: 5000}, {x: 0, y: 5000}
  ],
  mapBackgroundTextureSrc: "grid.jpg",
  bus: {
    position: {x: 250, y: 150},
    w: 51, h: 244,
    textureSrc: "bus.png",
  },
  obstacles: [],
  parkingBox: {
    position: {x: 0, y: 0},
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