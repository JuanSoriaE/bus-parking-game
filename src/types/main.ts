type Vec2d = {
  x: number,
  y: number
};

type RectangleSetting = {
  position: Vec2d,
  w: number,
  h: number,
  textureSrc?: string,
};

type LevelSettings = {
  mapVertices: Array<Vec2d>,
  busInitialPosition: Vec2d,
  obstacles: Array<RectangleSetting>,
  parkingBox: RectangleSetting,  
};

export type {
  Vec2d,
  LevelSettings,
}