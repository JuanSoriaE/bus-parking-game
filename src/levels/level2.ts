import { LevelSettings } from "../types/main";

export default {
  mapVertices: [
    {x: 0, y: 0}, {x: 800, y: 0}, {x: 800, y: 1200}, {x: 0, y: 1200}
  ],
  bus: {
    position: {x: 300, y: 150},
    w: 52, h: 274,
    textureSrcId: "bus-irizar-i6",
    frontwheelsOverhang: 41.8,
    backwheelsOverhang: 41.8,
  },
  obstacles: [
    {
      position: {x: 100, y: 300},
      w: 200, h: 600,
    },
    {
      position: {x: 200, y: 800},
      w: 400, h: 400,
    },
    {
      position: {x: 400, y: 1100},
      w: 800, h: 200,
    },
    {
      position: {x: 700, y: 700},
      w: 200, h: 600,
    },
    {
      position: {x: 600, y: 200},
      w: 400, h: 400,
    },
  ],
  parkingBox: {
    position: {x: 500, y: 800},
    w: 80, h: 300,
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