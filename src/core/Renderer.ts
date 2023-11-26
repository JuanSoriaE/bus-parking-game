import { Vec2d } from "../types/main";
import GameObject from "./GameObject";

export default class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  origin: Vec2d;

  constructor() {
    this.canvas = document.getElementById("cnv") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.ctx.transform(1, 0, 0, -1, 0, this.canvas.height);

    this.origin = {x: 0, y: 0};
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderBackground() {
    this.ctx.fillStyle = "#555";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderMapBackground(mapVertices: Array<Vec2d>, backgroundImage?: HTMLImageElement) {
    if (backgroundImage)
      return this.ctx.drawImage(
        backgroundImage,
        this.origin.x, this.origin.y,
        mapVertices[2].x, mapVertices[2].y
      );

    this.ctx.fillStyle = "#7c8684";
    this.ctx.fillRect(this.origin.x, this.origin.y, mapVertices[2].x, mapVertices[2].y);
  }

  renderGameObject(object: GameObject, color?: string) {
    this.ctx.fillStyle = color || "#000";

    this.ctx.save();
    this.ctx.translate(object.position.x + this.origin.x, object.position.y + this.origin.y);
    this.ctx.rotate(object.angle * Math.PI);

    if (object.textureImage)
      this.ctx.drawImage(
        object.textureImage,
        - object.width / 2,
        - object.height / 2,
        object.width, object.height
      );
    else
      this.ctx.fillRect(
        - object.width / 2,
        - object.height / 2,
        object.width, object.height
      );

    this.ctx.restore();
  }

  renderLight(x: number, y: number, angle: number, radius: number, fromColor: string, toColor: string, lightAngle: number) {
    this.ctx.save();
    this.ctx.translate(x + this.origin.x, y + this.origin.y);
    this.ctx.rotate(angle * Math.PI);

    const radialGradient: CanvasGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, Math.abs(radius));
    radialGradient.addColorStop(0, fromColor);
    radialGradient.addColorStop(1, toColor);
    this.ctx.fillStyle = radialGradient;

    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(radius, 0);
    this.ctx.lineTo(radius, radius * (lightAngle * Math.PI < 0 ? -1 : 1));
    this.ctx.lineTo(radius * Math.cos(lightAngle * Math.PI), radius * (lightAngle * Math.PI < 0 ? -1 : 1));
    this.ctx.lineTo(radius * Math.cos(lightAngle * Math.PI), radius * Math.sin(lightAngle * Math.PI));
    this.ctx.lineTo(0, 0);

    this.ctx.fill();
    this.ctx.restore();
  }

  renderVertex(vertex: Vec2d, color?: string) {
    this.ctx.fillStyle = color || "#ff0000";
    this.ctx.fillRect(vertex.x + this.origin.x - 1, vertex.y + this.origin.y - 1, 3, 2);
  }

  renderVertices(object: GameObject) {
    for (const vertex of object.vertices)
      this.renderVertex(vertex);
  }
}