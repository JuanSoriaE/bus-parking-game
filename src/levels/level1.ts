import { LevelSettings } from "../types/main";

export default {
  mapVertices: [
    {x: 0, y: 0}, {x: 1200, y: 0}, {x: 1200, y: 1000}, {x: 0, y: 1000}
  ],
  busInitialPosition: {x: 300, y: 150},
  obstacles: [
    {
      position: {x: 0, y: 0},
      w: 200, h: 800,
    },
    {
      position: {x: 200, y: 600},
      w: 800, h: 200,
    },
    {
      position: {x: 1000, y: 0},
      w: 200, h: 800,
    },
    {
      position: {x: 400, y: 0},
      w: 400, h: 400,
      textureSrc: "grassSquare.png",
    },
  ],
  parkingBox: {
    position: {x: 860, y: 20},
    w: 80, h: 300
  }
} as LevelSettings;