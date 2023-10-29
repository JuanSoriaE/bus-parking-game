import Game from "./Game";

export default class Controller {
  static TURN_ANGLE: number = 1 / 64;
  static ACCELERATION: number = 20;
  static BRAKE_ACCELERATION: number = 50;

  game: Game;

  pressedKeys: Array<string>;

  constructor(game: Game) {
    this.game = game;

    this.pressedKeys = new Array<string>();

    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener("keydown", (e: KeyboardEvent) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e: KeyboardEvent) => this.handleKeyUp(e));
  }

  handleKeyUp(e: KeyboardEvent) {
    const idxOfKeyUp: number = this.pressedKeys.indexOf(e.key);
    this.pressedKeys[idxOfKeyUp] = this.pressedKeys[this.pressedKeys.length - 1];
    this.pressedKeys.pop();
  }

  handleKeyDown(e: KeyboardEvent) {
    // Switch keys
    if (e.key == " ") return this.game.bus.forward = !this.game.bus.forward;

    if (this.pressedKeys.includes(e.key)) return;

    this.pressedKeys.push(e.key);
  }

  update() {
    if (this.pressedKeys.includes("w")) {
      if (this.game.bus.forward) this.game.bus.accelerate(Controller.ACCELERATION);
      else this.game.bus.accelerate(- Controller.ACCELERATION);
    }
    if (this.pressedKeys.includes("s")) {
      if (this.game.bus.forward) this.game.bus.accelerate(- Controller.BRAKE_ACCELERATION);
      else this.game.bus.accelerate(Controller.BRAKE_ACCELERATION);
    }
    if (this.pressedKeys.includes("d")) this.game.bus.turn(- Controller.TURN_ANGLE);
    if (this.pressedKeys.includes("a")) this.game.bus.turn(Controller.TURN_ANGLE);
  }
}