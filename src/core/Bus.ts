import { Vec2d } from "../types/main";
import AudioManager from "./AudioManager";
import GameObject from "./GameObject";
import InputHandler from "./InputHandler";

export default class Bus extends GameObject {
  frontwheelsPosition: Vec2d;
  backwheelsPosition: Vec2d;
  frontwheelsOverhang: number;
  backwheelsOverhang: number;
  headingAngle: number;
  turnAngle: number;

  forward: boolean;
  braking: boolean;

  ACCELERATION: number = 20;
  BRAKE_ACCELERATION: number = 50;
  TURN_ANGLE_VEL: number = 1 / 64;
  FRICTION_ACCELERATION: number = 3;

  constructor(x: number, y: number, w: number, h: number, frontwheelsOverhang: number, backwheelsOverhang: number) {
    super(x, y, w, h);

    this.frontwheelsOverhang = frontwheelsOverhang;
    this.backwheelsOverhang = backwheelsOverhang;
    this.frontwheelsPosition = {x: x, y: y + this.height / 2 - frontwheelsOverhang};
    this.backwheelsPosition = {x: x, y: y - this.height / 2 + backwheelsOverhang};
    this.headingAngle = 1 / 2;
    this.turnAngle = 0;

    this.forward = true;
    this.braking = false;
  }

  update(deltaTime: number) {
    this.frontwheelsPosition.x = this.position.x + (this.height / 2 - this.frontwheelsOverhang) * Math.cos(this.headingAngle * Math.PI);
    this.frontwheelsPosition.y = this.position.y + (this.height / 2 - this.frontwheelsOverhang) * Math.sin(this.headingAngle * Math.PI);
    this.backwheelsPosition.x = this.position.x - (this.height / 2 - this.backwheelsOverhang) * Math.cos(this.headingAngle * Math.PI);
    this.backwheelsPosition.y = this.position.y - (this.height / 2 - this.backwheelsOverhang) * Math.sin(this.headingAngle * Math.PI);

    this.velocity += this.acceleration * deltaTime;

    if (this.braking && Math.abs(this.velocity) < 5) this.velocity = 0;

    this.frontwheelsPosition.x += this.velocity * deltaTime * Math.cos((this.headingAngle + this.turnAngle) * Math.PI);
    this.frontwheelsPosition.y += this.velocity * deltaTime * Math.sin((this.headingAngle + this.turnAngle) * Math.PI);
    this.backwheelsPosition.x += this.velocity * deltaTime * Math.cos(this.headingAngle * Math.PI);
    this.backwheelsPosition.y += this.velocity * deltaTime * Math.sin(this.headingAngle * Math.PI);

    this.position.x = (this.frontwheelsPosition.x + this.backwheelsPosition.x) / 2;
    this.position.y = (this.frontwheelsPosition.y + this.backwheelsPosition.y) / 2;

    this.headingAngle = Math.atan2(
      this.frontwheelsPosition.y - this.backwheelsPosition.y,
      this.frontwheelsPosition.x - this.backwheelsPosition.x
    ) / Math.PI;

    this.angle = 1 / 2 + this.headingAngle;
    this.updateVertices();
  }

  turn(turnAngle: number) {
    this.turnAngle += turnAngle;
    this.turnAngle = Math.min(Math.max(this.turnAngle, -1 / 4), 1 / 4);
  }

  handleInput(inputHandler: InputHandler, audioManager: AudioManager) {
    if (inputHandler.pressedKeys.includes("w")) {
      audioManager.playSoundEffect("accelerating");
      
      if (this.forward) this.acceleration = this.ACCELERATION;
      else this.acceleration = - this.ACCELERATION;
    } else {
      audioManager.stopSoundEffect("accelerating");

      // Friction
      if (this.velocity === 0) this.acceleration = 0;
      else if (this.velocity > 0) this.acceleration = - this.FRICTION_ACCELERATION;
      else this.acceleration = this.FRICTION_ACCELERATION;
    }

    if (inputHandler.pressedKeys.includes("s")) {
      if (this.velocity !== 0) audioManager.playSoundEffect("braking");
      else audioManager.stopSoundEffect("braking");

      this.braking = true;
      if (this.forward) this.acceleration = - this.BRAKE_ACCELERATION;
      else this.acceleration = this.BRAKE_ACCELERATION;
    } else {
      audioManager.stopSoundEffect("braking");
      
      this.braking = false;
    }

    if (inputHandler.pressedKeys.includes("a")) this.turn(this.TURN_ANGLE_VEL);
    if (inputHandler.pressedKeys.includes("d")) this.turn(- this.TURN_ANGLE_VEL);

    // Switch keys
    if (inputHandler.pressedKeys.includes(" ")) {
      this.forward = !this.forward;
      if (!this.forward) audioManager.playSoundEffectInfinite("backup-beep");
      else audioManager.stopSoundEffect("backup-beep");

      inputHandler.deletePressedKey(" ");
    }
  }
}