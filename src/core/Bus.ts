import { Vec2d } from "../types/main";
import AudioManager from "./AudioManager";
import GameObject from "./GameObject";
import InputHandler from "./InputHandler";

export default class Bus extends GameObject {
  frontwheelsPosition: Vec2d;
  backwheelsPosition: Vec2d;
  turnAngle: number;

  forward: boolean;
  braking: boolean;

  ACCELERATION: number = 20;
  BRAKE_ACCELERATION: number = 50;
  TURN_ANGLE_VEL: number = 1 / 64;
  FRICTION_ACCELERATION: number = 3;

  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this.angle = 1 / 2;

    this.frontwheelsPosition = {x: x, y: y + this.height / 2 - 26.7};
    this.backwheelsPosition = {x: x, y: y - this.height / 2 + 33.6};
    this.turnAngle = 0;

    this.forward = true;
    this.braking = false;
  }

  initVertices() {
    this.vertices.push({x: this.position.x - this.width / 2, y: this.position.y - this.height / 2});
    this.vertices.push({x: this.position.x + this.width / 2, y: this.position.y - this.height / 2});
    this.vertices.push({x: this.position.x - this.width / 2, y: this.position.y + this.height / 2});
    this.vertices.push({x: this.position.x + this.width / 2, y: this.position.y + this.height / 2});
  }

  friction() {
    // Velocity reduction
    if (this.velocity == 0) this.acceleration = 0;
    else if (this.velocity > 0) this.acceleration = -3;
    else this.acceleration = 3;

    // Turn angle reduction
    if (Math.abs(this.velocity) > 0) {
      if (this.turnAngle == 0) return;

      this.turnAngle += Math.pow(this.velocity, 2) / 2000000 * (this.turnAngle < 0 ? 1 : -1);
      
      if (this.turnAngle < 0)
        this.turnAngle = Math.min(this.turnAngle, 0);
      else
        this.turnAngle = Math.max(this.turnAngle, 0);
    }
  }

  update(deltaTime: number) {
    this.frontwheelsPosition.x = this.position.x + (this.height / 2 - 26.7) * Math.cos(this.angle * Math.PI);
    this.frontwheelsPosition.y = this.position.y + (this.height / 2 - 26.7) * Math.sin(this.angle * Math.PI);
    this.backwheelsPosition.x = this.position.x - (this.height / 2 - 26.7) * Math.cos(this.angle * Math.PI);
    this.backwheelsPosition.y = this.position.y - (this.height / 2 - 26.7) * Math.sin(this.angle * Math.PI);

    this.velocity += this.acceleration * deltaTime;

    if (this.forward) this.velocity = Math.max(this.velocity, 0);
    else this.velocity = Math.min(this.velocity, 0);

    this.frontwheelsPosition.x += this.velocity * deltaTime * Math.cos((this.angle + this.turnAngle) * Math.PI);
    this.frontwheelsPosition.y += this.velocity * deltaTime * Math.sin((this.angle + this.turnAngle) * Math.PI);
    this.backwheelsPosition.x += this.velocity * deltaTime * Math.cos(this.angle * Math.PI);
    this.backwheelsPosition.y += this.velocity * deltaTime * Math.sin(this.angle * Math.PI);

    this.position.x = (this.frontwheelsPosition.x + this.backwheelsPosition.x) / 2;
    this.position.y = (this.frontwheelsPosition.y + this.backwheelsPosition.y) / 2;

    this.angle = Math.atan2(
      this.frontwheelsPosition.y - this.backwheelsPosition.y,
      this.frontwheelsPosition.x - this.backwheelsPosition.x
    ) / Math.PI;

    this.updateVertices();
  }

  updateVertices() {
    this.vertices[0] = {
      x: this.position.x + (this.width / 2) * Math.cos((this.angle + 1 / 2) * Math.PI) - (this.height / 2) * Math.cos(this.angle * Math.PI),
      y: this.position.y + (this.width / 2) * Math.sin((this.angle + 1 / 2) * Math.PI) - (this.height / 2) * Math.sin(this.angle * Math.PI),
    };
    this.vertices[1] = {
      x: this.vertices[0].x + this.width * Math.cos((this.angle - 1 / 2) * Math.PI),
      y: this.vertices[0].y + this.width * Math.sin((this.angle - 1 / 2) * Math.PI),
    };
    this.vertices[2] = {
      x: this.vertices[1].x + this.height * Math.cos(this.angle * Math.PI),
      y: this.vertices[1].y + this.height * Math.sin(this.angle * Math.PI)
    };
    this.vertices[3] = {
      x: this.vertices[2].x + this.width * Math.cos((this.angle + 1 / 2) * Math.PI),
      y: this.vertices[2].y + this.width * Math.sin((this.angle + 1 / 2) * Math.PI)
    };
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