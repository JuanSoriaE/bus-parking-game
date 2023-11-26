import { BusSettings, GameObjectSettings, LevelSettings, Vec2d } from "../types/main";
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

    this.level = 3;
    this.mapVertices = new Array<Vec2d>();

    this.bus = new Bus(0, 0, 0, 0, 0, 0);
    this.obstacles = new Array<GameObject>();
    this.parkingBox = new GameObject(0, 0, 0, 0);

    this.lastFrameTime = 0;

    this.initLevel();
  }

  initGameObject(settings: GameObjectSettings) {
    const gameObject: GameObject = new GameObject(
      settings.position.x, settings.position.y,
      settings.w, settings.h,
      settings.angle,
    );

    if (settings.textureSrcId)
      gameObject.setTexture(settings.textureSrcId);

    return gameObject;
  }

  initBus(settings: BusSettings) {
    this.bus = new Bus(
      settings.position.x, settings.position.y,
      settings.w, settings.h,
      settings.frontwheelsOverhang, settings.backwheelsOverhang,
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

  renderBusLights() {
    const busInsideAngle: number = Math.atan2(this.bus.width / 4, this.bus.height);

    if (!this.bus.forward) {
      this.renderer.renderLight(
        this.bus.position.x + (this.bus.height / 2) * Math.cos((1 + this.bus.headingAngle - busInsideAngle) * Math.PI),
        this.bus.position.y + (this.bus.height / 2) * Math.sin((1 + this.bus.headingAngle - busInsideAngle) * Math.PI),
        this.bus.angle, 20, "#ffffff55", "#ffffff00", (17 / 18)
      );
      this.renderer.renderLight(
        this.bus.position.x + (this.bus.height / 2) * Math.cos((1 + this.bus.headingAngle + busInsideAngle) * Math.PI),
        this.bus.position.y + (this.bus.height / 2) * Math.sin((1 + this.bus.headingAngle + busInsideAngle) * Math.PI),
        this.bus.angle, -20, "#ffffff55", "#ffffff00", -(17 / 18)
      );
    }

    if (this.bus.braking) {
      this.renderer.renderLight(
        this.bus.position.x + (this.bus.height / 2) * Math.cos((1 + this.bus.headingAngle - busInsideAngle) * Math.PI),
        this.bus.position.y + (this.bus.height / 2) * Math.sin((1 + this.bus.headingAngle - busInsideAngle) * Math.PI),
        this.bus.angle, 50, "#ff000066", "#ff000000", (5 / 6)
      );
      this.renderer.renderLight(
        this.bus.position.x + (this.bus.height / 2) * Math.cos((1 + this.bus.headingAngle + busInsideAngle) * Math.PI),
        this.bus.position.y + (this.bus.height / 2) * Math.sin((1 + this.bus.headingAngle + busInsideAngle) * Math.PI),
        this.bus.angle, -50, "#ff000066", "#ff000000", -(5 / 6)
      );
    }
  }

  renderGame() {
    this.renderer.origin.x = this.renderer.canvas.width / 2 - this.bus.position.x;
    this.renderer.origin.y = this.renderer.canvas.height / 2 - this.bus.position.y;

    this.renderer.clear();
    this.renderer.renderBackground();
    this.renderer.renderMapBackground(this.mapVertices, this.mapBackgroundTexture);

    this.renderer.renderGameObject(this.parkingBox);

    this.renderer.renderGameObject(this.bus);
    this.renderBusLights();

    for (const obstacle of this.obstacles)
      this.renderer.renderGameObject(obstacle, "#6e3000");
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

    // Rendering
    this.renderGame();

    // Collision detection
    if (this.collisionDetector.rectangleColliedWithRectangles(this.bus, this.obstacles) ||
      this.collisionDetector.isRectangleOutOfRectangle(this.bus, this.mapVertices)) return "YOU CRASHED";

    if (this.collisionDetector.isRectangleInRectangle(this.bus, this.parkingBox) &&
      Math.floor(this.bus.velocity) === 0) return "YOU WON!";

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