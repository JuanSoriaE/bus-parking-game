type Vec2d = {
  x: number,
  y: number
};

type GameObjectSettings = {
  position: Vec2d,
  w: number,
  h: number,
  textureSrcId?: string,
};

type AudioSettings = {
  name: string,
  srcId: string,
  volume: number,
};

type LevelSettings = {
  mapVertices: Array<Vec2d>,
  mapBackgroundTextureSrcId?: string,
  bus: GameObjectSettings,
  obstacles: Array<GameObjectSettings>,
  parkingBox: GameObjectSettings,
  audios: Array<AudioSettings>,
};

export type {
  Vec2d,
  GameObjectSettings,
  AudioSettings,
  LevelSettings,
}