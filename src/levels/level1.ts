import { LevelSettings } from "../types/main";

export default {
  mapVertices: [
    {x: 0, y: 0}, {x: 500, y: 0}, {x: 500, y: 800}, {x: 0, y: 800}
  ],
  bus: {
    position: {x: 250, y: 150},
    w: 51, h: 244,
    textureSrcId: "busImg",
  },
  obstacles: [],
  parkingBox: {
    position: {x: 210, y: 450},
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