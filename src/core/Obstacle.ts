import GameObject from "./GameObject";

export default class Obstacle extends GameObject {
  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
  }
}