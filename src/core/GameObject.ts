import { Vec2d } from "../types/main";

export default class GameObject {
  position: Vec2d; // Center of the object
  width: number;
  height: number;
  vertices: Array<Vec2d>;

  angle: number;
  velocity: number;
  acceleration: number;

  textureImage?: HTMLImageElement;

  constructor(x: number, y: number, w: number, h: number, angle?: number) {
    this.position = {x, y};
    this.width = w;
    this.height = h;
    this.vertices = new Array<Vec2d>(4);

    this.angle = angle || 0;
    this.velocity = 0;
    this.acceleration = 0;

    this.updateVertices();
  }

  rotateVertices() {
    /* 
    Rotate relative to the center of the Object

    | cosθ -sinθ |   | x |
    |            | * |   |
    | sinθ  cosθ |   | y |
    */
    const cos: number = Math.cos(this.angle * Math.PI);
    const sin: number = Math.sin(this.angle * Math.PI);

    for (let i = 0; i < this.vertices.length; i++) {
      const centerRelativePostion: Vec2d = {
        x: this.vertices[i].x - this.position.x,
        y: this.vertices[i].y - this.position.y
      };

      this.vertices[i] = {
        x: this.position.x + centerRelativePostion.x * cos - centerRelativePostion.y * sin,
        y: this.position.y + centerRelativePostion.x * sin + centerRelativePostion.y * cos
      };
    }
  }

  setTexture(textureSrcId: string) {
    this.textureImage = document.getElementById(textureSrcId) as HTMLImageElement;
  }

  isRotated() {
    return this.angle !== 0;
  }

  updateVertices() {
    this.vertices[0] = {x: this.position.x - this.width / 2, y: this.position.y - this.height / 2};
    this.vertices[1] = {x: this.position.x + this.width / 2, y: this.position.y - this.height / 2};
    this.vertices[2] = {x: this.position.x + this.width / 2, y: this.position.y + this.height / 2};
    this.vertices[3] = {x: this.position.x - this.width / 2, y: this.position.y + this.height / 2};

    if (this.isRotated())
      this.rotateVertices();
  }
}