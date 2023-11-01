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

    if (settings.textureSrc)
      gameObject.setTexture(settings.textureSrc);

    return gameObject;
  }

  initBus(settings: GameObjectSettings) {
    this.bus = new Bus(
      settings.position.x, settings.position.y,
      settings.w, settings.h,
    );

    if (settings.textureSrc)
      this.bus.setTexture(settings.textureSrc);
  }

  async initLevel() {
    const levelSettings: LevelSettings = (await import(`./../levels/level${this.level}`)).default;

    this.mapVertices = levelSettings.mapVertices;
    if (levelSettings.mapBackgroundTextureSrc) {
      this.mapBackgroundTexture = new Image();
      this.mapBackgroundTexture.src = `./src/assets/images/${levelSettings.mapBackgroundTextureSrc}`;
    }

    this.initBus(levelSettings.bus);

    for (const obstacleSettings of levelSettings.obstacles) {
      this.obstacles.push(this.initGameObject(obstacleSettings));
    }

    this.parkingBox = this.initGameObject(levelSettings.parkingBox);

    this.audioManager.setAudios(levelSettings.audiosSrc ?? []);
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