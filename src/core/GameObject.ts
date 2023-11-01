import { Vec2d } from "../types/main";

export default class GameObject {
  position: Vec2d;
  width: number;
  height: number;
  vertices: Array<Vec2d>;

  angle: number;
  velocity: number;
  acceleration: number;

  textureImage?: HTMLImageElement;

  constructor(x: number, y: number, w: number, h: number) {
    this.position = {x, y};
    this.width = w;
    this.height = h;
    this.vertices = new Array<Vec2d>();

    this.angle = 0;
    this.velocity = 0;
    this.acceleration = 0;

    this.initVertices();
  }

  initVertices() {
    this.vertices.push(this.position);
    this.vertices.push({x: this.position.x + this.width, y: this.position.y});
    this.vertices.push({x: this.position.x, y: this.position.y + this.height});
    this.vertices.push({x: this.position.x + this.width, y: this.position.y + this.height});
  };

  setTexture(textureSrc: string) {
    this.textureImage = new Image();
    this.textureImage.src = `./src/assets/images/${textureSrc}`;
  }
}