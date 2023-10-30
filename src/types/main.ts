type Vec2d = {
  x: number,
  y: number
};

type GameObjectSettings = {
  position: Vec2d,
  w: number,
  h: number,
  textureSrc?: string,
  audiosSrc?: Array<Array<string>>,
};

type LevelSettings = {
  mapVertices: Array<Vec2d>,
  mapBackgroundTextureSrc?: string,
  bus: GameObjectSettings,
  obstacles: Array<GameObjectSettings>,
  parkingBox: GameObjectSettings,
};

type AudioManagerAudio = {
  name: string,
  audio: HTMLAudioElement,
};

export type {
  Vec2d,
  GameObjectSettings,
  LevelSettings,
  AudioManagerAudio,
}