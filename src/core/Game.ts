import { LevelSettings, Vec2d } from "../types/main";
import Bus from "./Bus";
import CollisionDetector from "./CollisionDetector";
import Controller from "./Controller";
import GameObject from "./GameObject";
import Renderer from "./Renderer";

export default class Game {
  renderer: Renderer;
  controller: Controller;
  collisionDetector: CollisionDetector;
  bus: Bus;
  obstacles: Array<GameObject>;
  parkingBox: GameObject;
  level: number;
  mapVertices: Array<Vec2d>;
  lastFrameTime: number;

  constructor() {
    this.renderer = new Renderer();
    this.controller = new Controller(this);
    this.collisionDetector = new CollisionDetector();
    this.bus = new Bus(0, 0, 51, 244);
    this.obstacles = new Array<GameObject>();
    this.parkingBox = new GameObject(0, 0, 0, 0);
    this.level = 1;
    this.mapVertices = new Array<Vec2d>();

    this.lastFrameTime = 0;

    this.initLevel().then(() => this.start());
  }

  async initLevel() {
    const levelSettings: LevelSettings = (await import(`./../levels/level${this.level}`)).default;

    this.mapVertices = levelSettings.mapVertices;
    
    this.bus.position = levelSettings.busInitialPosition;

    this.parkingBox = new GameObject(levelSettings.parkingBox.position.x, levelSettings.parkingBox.position.y, levelSettings.parkingBox.w, levelSettings.parkingBox.h);

    for (const obstacleSettings of levelSettings.obstacles) {
      this.obstacles.push(new GameObject(
        obstacleSettings.position.x, obstacleSettings.position.y,
        obstacleSettings.w, obstacleSettings.h,
        obstacleSettings.textureSrc,
      ));
    }
  }

  start() {
    this.lastFrameTime = 0;
    this.gameLoop();
  }

  update(deltaTime: number) {
    this.controller.update();

    this.bus.update(deltaTime);
  }

  finish(msg: string) {
    alert(msg);
  }

  gameLoop(curFrameTime: number = 0) {
    const deltaTime: number = (curFrameTime - this.lastFrameTime) / 1000;
    
    this.update(deltaTime);

    if (this.collisionDetector.checkBusCollision(this.bus, this.obstacles)
      || this.collisionDetector.checkcIfOutOfMap(this.bus, this.mapVertices)) return this.finish("YOU CRASHED");
    if (this.collisionDetector.checkIfWin(this.bus, this.parkingBox)) return this.finish("YOU WON");

    this.renderer.renderGame(this);

    this.lastFrameTime = curFrameTime;
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}