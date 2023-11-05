import { Vec2d } from "../types/main";
import Bus from "./Bus";
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

  renderLight(x: number, y: number, radius: number, fromColor: string, toColor: string, angle: number) {
    const radialGradient: CanvasGradient = this.ctx.createRadialGradient(x, y, 0, x, y, Math.abs(radius));
    radialGradient.addColorStop(0, fromColor);
    radialGradient.addColorStop(1, toColor); // Opacity 0
    this.ctx.fillStyle = radialGradient;

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + radius, y);
    this.ctx.lineTo(x + radius, y + radius * (angle < 0 ? -1 : 1));
    this.ctx.lineTo(x + radius * Math.cos(angle), y + radius * (angle < 0 ? -1 : 1));
    this.ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
    this.ctx.lineTo(x, y);

    this.ctx.fill();
  }

  renderBusLights(bus: Bus) {
    const xOffset: number = !bus.isRotated() ? bus.position.x + this.origin.x : 0,
          yOffset: number = !bus.isRotated() ? bus.position.y + this.origin.y : 0;

    if (bus.isRotated()) {
      this.ctx.save();
      this.ctx.translate(bus.position.x + this.origin.x, bus.position.y + this.origin.y);
      this.ctx.rotate(bus.angle * Math.PI)
    }

    // Reverse lights    
    if (!bus.forward) {
      this.renderLight(
        - bus.width / 2 + 5 + xOffset, bus.height / 2 + yOffset, 20,
        "#ffffff55", "#ffffff00",
        (17 / 18) * Math.PI
      );
      this.renderLight(
        bus.width / 2 - 5 + xOffset, bus.height / 2 + yOffset, - 20,
        "#ffffff55", "#ffffff00",
        - (17 / 18) * Math.PI
      );
    }
    
    // Bus brake lights
    if (bus.braking) {
      this.renderLight(
        - bus.width / 2 + 2 + xOffset, bus.height / 2 + yOffset, 50,
        "#ff000066", "#ff000000",
        (5 / 6) * Math.PI
      );
      this.renderLight(
        bus.width / 2 - 2, bus.height / 2, - 50,
        "#ff000066", "#ff000000",
        - (5 / 6) * Math.PI
      );
    }

    this.ctx.restore();
  }

  renderVertices(object: GameObject) {
    this.ctx.fillStyle = "#ff0000";

    for (const vertex of object.vertices) {
      this.ctx.fillRect(vertex.x + this.origin.x, vertex.y + this.origin.y, 5, 5);
    }
  }
}