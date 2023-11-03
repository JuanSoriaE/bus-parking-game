import { GameObjectSettings, LevelSettings, Vec2d } from "../types/main";
import CollisionDetector from "./CollisionDetector";
import Renderer from "./Renderer";
import GameObject from "./GameObject";
import Bus from "./Bus";
import AudioManager from "./AudioManager";
import InputHandler from "./InputHandler";

export default class Game {
  collisionDetector: CollisionDetector;
  renderer: Renderer;
  inputHandler: InputHandler;
  audioManager: AudioManager;

  level: number;
  mapVertices: Array<Vec2d>;
  mapBackgroundTexture?: HTMLImageElement;

  bus: Bus;
  obstacles: Array<GameObject>;
  parkingBox: GameObject;

  lastFrameTime: number;

  constructor() {
    this.collisionDetector = new CollisionDetector();
    this.inputHandler = new InputHandler();
    this.renderer = new Renderer();
    this.audioManager = new AudioManager();

    this.level = 2;
    this.mapVertices = new Array<Vec2d>();

    this.bus = new Bus(0, 0, 0, 0);
    this.obstacles = new Array<GameObject>();
    this.parkingBox = new GameObject(0, 0, 0, 0);

    this.lastFrameTime = 0;

    this.initLevel();
  }

  initGameObject(settings: GameObjectSettings) {
    const gameObject: GameObject = new GameObject(
      settings.position.x, settings.position.y,
      settings.w, settings.h,
    );

    if (settings.textureSrcId)
      gameObject.setTexture(settings.textureSrcId);

    return gameObject;
  }

  initBus(settings: GameObjectSettings) {
    this.bus = new Bus(
      settings.position.x, settings.position.y,
      settings.w, settings.h,
    );

    if (settings.textureSrcId)
      this.bus.setTexture(settings.textureSrcId);
  }

  async initLevel() {
    const levelSettings: LevelSettings = (await import(`./../levels/level${this.level}.ts`)).default;

    this.mapVertices = levelSettings.mapVertices;
    if (levelSettings.mapBackgroundTextureSrcId)
      this.mapBackgroundTexture = document.getElementById(levelSettings.mapBackgroundTextureSrcId) as HTMLImageElement;

    this.initBus(levelSettings.bus);

    for (const obstacleSettings of levelSettings.obstacles)
      this.obstacles.push(this.initGameObject(obstacleSettings));

    this.parkingBox = this.initGameObject(levelSettings.parkingBox);

    this.audioManager.setAudios(levelSettings.audios ?? []);
  }

  start() {
    this.lastFrameTime = 0;
    this.gameLoop();

    this.audioManager.playSoundEffectInfinite("engine");
  }

  update(deltaTime: number) {
    // Game objects updating
    this.bus.handleInput(this.inputHandler, this.audioManager);
    this.bus.update(deltaTime);

    // Collision detection
    if (this.collisionDetector.rectangleColliedWithRectangles(this.bus, this.obstacles) ||
      this.collisionDetector.isRectangleOutOfRectangle(this.bus, this.mapVertices)) return "YOU CRASHED";

    if (this.collisionDetector.isRectangleInRectangle(this.bus.vertices, this.parkingBox.vertices) &&
      this.bus.velocity === 0) return "YOU WON!";

    // Rendering
    this.renderer.renderGame(this);

    return "";
  }

  finish(msg: string) {
    this.audioManager.stopAllSoundEffects();
    alert(msg);
  }

  gameLoop(curFrameTime: number = 0) {
    const deltaTime: number = (curFrameTime - this.lastFrameTime) / 1000;

    const res: string = this.update(deltaTime);
    if (res !== "") return this.finish(res);

    this.lastFrameTime = curFrameTime;
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}