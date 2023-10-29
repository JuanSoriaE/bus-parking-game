import { Vec2d } from "../types/main";

export default class GameObject {
  position: Vec2d;
  width: number;
  height: number;
  angle: number;
  velocity: number;
  acceleration: number;
  vertices: Array<Vec2d>;
  textureImage?: HTMLImageElement;

  constructor(x: number, y: number, w: number, h: number, textureSrc?: string) {
    this.position = {x, y};
    this.width = w;
    this.height = h;
    this.angle = 0;
    this.velocity = 0;
    this.acceleration = 0;
    this.vertices = new Array<Vec2d>();

    this.initTextureImage(textureSrc);
    this.initVertices();
  }

  initVertices() {
    this.vertices.push(this.position);
    this.vertices.push({x: this.position.x + this.width, y: this.position.y});
    this.vertices.push({x: this.position.x, y: this.position.y + this.height});
    this.vertices.push({x: this.position.x + this.width, y: this.position.y + this.height});
  };

  initTextureImage(textureSrc?: string) {
    if (!textureSrc) return;

    this.textureImage = new Image();
    this.textureImage.src = `./src/assets/${textureSrc}`;
  }
}