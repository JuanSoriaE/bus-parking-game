import { Vec2d } from "../types/main";
import GameObject from "./GameObject";

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

  rectangleColliedWithRectangles(rectA: GameObject, rectangles: Array<GameObject>) {
    for (const rectB of rectangles) {
      for (const rectAVertex of rectA.vertices) {
        if ((rectB.angle === 0 && this.isVertexInRectangle(rectAVertex, rectB.vertices)) ||
            (rectB.angle !== 0 && this.isVertexInRotatedRectangle(rectAVertex, rectB.vertices, rectB.width * rectB.height))) return true;
      }
      for (const rectBVertex of rectB.vertices) {
        if ((rectA.angle === 0 && this.isVertexInRectangle(rectBVertex, rectA.vertices)) ||
            (rectA.angle !== 0 && this.isVertexInRotatedRectangle(rectBVertex, rectA.vertices, rectA.width * rectA.height))) return true;
      }
    }

    return false;
  }
  
  isRectangleOutOfRectangle(rectA: GameObject, rectBVertices: Array<Vec2d>) {
    for (const rectAVertex of rectA.vertices) {
      if (!this.isVertexInRectangle(rectAVertex, rectBVertices)) return true; // Map angle always = 0
    }
    return false;
  }
}