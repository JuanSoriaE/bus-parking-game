type Vec2d = {
  x: number,
  y: number
};

type GameObjectSettings = {
  position: Vec2d,
  w: number,
  h: number,
  textureSrc?: string,
};

type AudioSettings = {
  name: string,
  src: string,
  volume: number,
};

type LevelSettings = {
  mapVertices: Array<Vec2d>,
  mapBackgroundTextureSrc?: string,
  bus: GameObjectSettings,
  obstacles: Array<GameObjectSettings>,
  parkingBox: GameObjectSettings,
  audiosSrc?: Array<AudioSettings>,
};

export type {
  Vec2d,
  GameObjectSettings,
  AudioSettings,
  LevelSettings,
}