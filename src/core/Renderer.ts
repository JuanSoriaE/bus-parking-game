import { Vec2d } from "../types/main";
import Bus from "./Bus";
import Game from "./Game";
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

  canvasArrow(fromx: number, fromy: number, tox: number, toy: number) {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    this.ctx.moveTo(fromx, fromy);
    this.ctx.lineTo(tox, toy);
    this.ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    this.ctx.moveTo(tox, toy);
    this.ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
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

  renderBus(bus: Bus) {
    if (!bus.textureImage) return;

    this.ctx.save();
    this.ctx.translate(bus.position.x + this.origin.x, bus.position.y + this.origin.y);
    this.ctx.rotate((bus.angle - 1 / 2) * Math.PI);

    this.ctx.drawImage(
      bus.textureImage,
      - bus.width / 2, - bus.height / 2,
      bus.width, bus.height
    );

    // Reverse lights    
    if (!bus.forward) {
      this.renderLight(
        - bus.width / 2 + 5, - bus.height / 2, 20,
        "#ffffff55", "#ffffff00",
        - Math.PI
      );
      this.renderLight(
        bus.width / 2 - 5, - bus.height / 2, - 20,
        "#ffffff55", "#ffffff00",
        Math.PI
      );
    }
    
    // Bus brake lights
    if (bus.braking) {
      this.renderLight(
        - bus.width / 2 + 2, - bus.height / 2, 50,
        "#ff000066", "#ff000000",
        - (5 / 6) * Math.PI
      );
      this.renderLight(
        bus.width / 2 - 2, - bus.height / 2, - 50,
        "#ff000066", "#ff000000",
        (5 / 6) * Math.PI
      );
    }

    this.ctx.restore();
  }

  renderObstacles(obstacles: Array<GameObject>) {
    this.ctx.fillStyle = "#96452a";

    for (const obstacle of obstacles) {
      if (obstacle.textureImage) {
        this.ctx.drawImage(
          obstacle.textureImage,
          obstacle.position.x + this.origin.x, obstacle.position.y + this.origin.y,
          obstacle.width, obstacle.height
        );

        continue;
      }

      this.ctx.fillRect(
        obstacle.position.x + this.origin.x, obstacle.position.y + this.origin.y,
        obstacle.width, obstacle.height
      );
    }
  }

  renderParkingBox(parkingBox: GameObject | null) {
    if (!parkingBox || !parkingBox.textureImage) return;

    this.ctx.drawImage(
      parkingBox.textureImage,
      parkingBox.position.x + this.origin.x, parkingBox.position.y + this.origin.y,
      parkingBox.width, parkingBox.height
    );
  }

  renderGame(game: Game) {
    this.origin.x = this.canvas.width / 2 - game.bus.position.x;
    this.origin.y = this.canvas.height / 2 - game.bus.position.y;

    this.clear();

    this.renderBackground();
    this.renderMapBackground(game.mapVertices, game.mapBackgroundTexture);

    this.renderParkingBox(game.parkingBox);
    this.renderObstacles(game.obstacles);
    this.renderBus(game.bus);
  }
}