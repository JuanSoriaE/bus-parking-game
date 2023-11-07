import { LevelSettings } from "../types/main";

export default {
  mapVertices: [
    {x: 0, y: 0}, {x: 800, y: 0}, {x: 800, y: 800}, {x: 0, y: 800}
  ],
  bus: {
    position: {x: 700, y: 150},
    w: 52, h: 263.5,
    textureSrcId: "bus-volvo-9800",
    frontwheelsOverhang: 41.8,
    backwheelsOverhang: 41.8,
  },
  obstacles: [
    {
      position: {x: 0, y: 800},
      w: 700, h: 700,
      angle: 1 / 4,
    },
    {
      position: {x: 280, y: 370},
      w: 52, h: 274,
      angle: 5 / 4,
      textureSrcId: "bus-irizar-i6",
    },
    {
      position: {x: 430, y: 520},
      w: 52, h: 263.5,
      angle: 5 / 4,
      textureSrcId: "bus-volvo-9800",
    },
  ],
  parkingBox: {
    position: {x: 360, y: 440},
    w: 80, h: 300,
    angle: 1 / 4,
    textureSrcId: "parkingBoxImg",
  },
  audios: [
    {
      name: "accelerating",
      srcId: "acceleratingAudio",
      volume: 0.4,
    },
    {
      name: "braking",
      srcId: "brakingAudio",
      volume: 0.5,
    },
    {
      name: "engine",
      srcId: "engineAudio",
      volume: 0.3,
    },
    {
      name: "backup-beep",
      srcId: "backupBeepAudio",
      volume: 0.2,
    },
  ],
} as LevelSettings;