import type { Bitmap } from "./bitmaps";

export interface Coordinate {
  x: number;
  y: number;
}

export class PixelDrawing {
  static PX_SCALE = 4;

  origin: Coordinate;
  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D, origin: Coordinate) {
    this.ctx = ctx;
    this.origin = origin;
  }

  public pxCoord(num: number) {
    return Math.round(num * PixelDrawing.PX_SCALE);
  }

  public px(x: number, y: number) {
    this.ctx.fillRect(
      this.pxCoord(x),
      this.pxCoord(y),
      PixelDrawing.PX_SCALE,
      PixelDrawing.PX_SCALE,
    );
  }

  public pxRect(x: number, y: number, width: number, height: number) {
    this.ctx.fillRect(
      this.pxCoord(x),
      this.pxCoord(y),
      width * PixelDrawing.PX_SCALE,
      height * PixelDrawing.PX_SCALE,
    );
  }

  // given a mapping of pixel coordinates, draw that shape according to the map.
  public pxMap(bitmap: Bitmap, startCoord: Coordinate, colorMap: string[]) {
    this.ctx.save();

    this.ctx.translate(this.pxCoord(startCoord.x), this.pxCoord(startCoord.y));
    bitmap.forEach((row, rowIdx) => {
      row.forEach((cell, cellIdx) => {
        this.ctx.fillStyle = colorMap[cell];
        this.px(cellIdx, rowIdx);
      });
    });

    this.ctx.restore();
  }
}
