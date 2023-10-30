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
    if (e.key == " ") {
      this.game.bus.forward = !this.game.bus.forward;
      if (!this.game.bus.forward) this.game.bus.audioManager?.playSoundEffectInfinite("backup-beep");
      else this.game.bus.audioManager?.stopSoundEffect("backup-beep");

      return;
    }

    if (this.pressedKeys.includes(e.key)) return;

    this.pressedKeys.push(e.key);
  }

  update() {
    if (this.pressedKeys.includes("w")) {
      this.game.bus.audioManager?.playSoundEffect("accelerating");

      if (this.game.bus.forward) this.game.bus.acceleration = Controller.ACCELERATION;
      else this.game.bus.acceleration = - Controller.ACCELERATION;
    } else {
      this.game.bus.audioManager?.stopSoundEffect("accelerating");
    }

    if (this.pressedKeys.includes("s")) {
      this.game.bus.braking = true;

      if (Math.abs(this.game.bus.velocity) > 0) this.game.bus.audioManager?.playSoundEffect("braking");
      else this.game.bus.audioManager?.stopSoundEffect("braking");

      if (this.game.bus.forward) this.game.bus.acceleration = - Controller.BRAKE_ACCELERATION;
      else this.game.bus.acceleration = Controller.BRAKE_ACCELERATION;
    } else {
      this.game.bus.braking = false;
      this.game.bus.audioManager?.stopSoundEffect("braking");
    }

    if (this.pressedKeys.includes("d")) this.game.bus.turn(- Controller.TURN_ANGLE);
    if (this.pressedKeys.includes("a")) this.game.bus.turn(Controller.TURN_ANGLE);
  }
}