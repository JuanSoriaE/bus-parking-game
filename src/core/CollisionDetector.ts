import { Vec2d } from "../types/main";
import Bus from "./Bus";
import GameObject from "./GameObject";
import Obstacle from "./Obstacle";

export default class CollisionDetector {
  constructor() {
  }

  isVertexInRectangle(vertex: Vec2d, rectangleVertices: Array<Vec2d>) {
    return vertex.x <= rectangleVertices[1].x && vertex.x >= rectangleVertices[0].x
        && vertex.y <= rectangleVertices[2].y && vertex.y >= rectangleVertices[0].y;
  }

  isVertexInRotatedRectangle(P: Vec2d, rectangleVertices: Array<Vec2d>, rectangleArea: number) {
    const A: Vec2d = rectangleVertices[0];
    const B: Vec2d = rectangleVertices[1];
    const C: Vec2d = rectangleVertices[2];
    const D: Vec2d = rectangleVertices[3];

    const areaAPD: number = Math.abs(
      (P.x * A.y - A.x * P.y)
      + (D.x * P.y - P.x * D.y)
      + (A.x * D.y - D.x * A.y)) / 2;
    const areaDPC: number = Math.abs(
      (P.x * D.y - D.x * P.y)
      + (C.x * P.y - P.x * C.y)
      + (D.x * C.y - C.x * D.y)) / 2;
    const areaCPB: number = Math.abs(
      (P.x * C.y - C.x * P.y)
      + (B.x * P.y - P.x * B.y)
      + (C.x * B.y - B.x * C.y)) / 2;
    const areaPBA: number = Math.abs(
      (B.x * P.y - P.x * B.y)
      + (A.x * B.y - B.x * A.y)
      + (P.x * A.y - A.x * P.y)) / 2;
    
    return areaAPD + areaDPC + areaCPB + areaPBA <= rectangleArea;
  }

  isRectangleInRectangle(rect1: Array<Vec2d>, rect2: Array<Vec2d>) {
    for (const vertex of rect1) {
      if (!this.isVertexInRectangle(vertex, rect2)) return false;
    }

    return true;
  }

  checkBusCollision(bus: Bus, obstacles: Array<Obstacle>) {
    for (const obstacle of obstacles) {
      for (const busVertex of bus.vertices) {
        if (this.isVertexInRectangle(busVertex, obstacle.vertices)) return true;
      }
      for (const obstacleVertex of obstacle.vertices) {
        if (this.isVertexInRotatedRectangle(obstacleVertex, bus.vertices, bus.width * bus.height)) return true;
      }
    }

    return false;
  }
  
  checkcIfOutOfMap(bus: Bus, mapVertices: Array<Vec2d>) {
    for (const vertex of bus.vertices) {
      if (!this.isVertexInRectangle(vertex, mapVertices)) return true;
    }
    return false;
  }

  checkIfWin(bus: Bus, parkingBox: GameObject) {
    return this.isRectangleInRectangle(bus.vertices, parkingBox.vertices) && bus.velocity === 0;
  }
}