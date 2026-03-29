import { beeBitmap } from "./bitmaps";
import { BEE } from "./constants";
import { PixelDrawing, type Coordinate } from "./PixelDrawing";

interface BeeParams {
  ctx: CanvasRenderingContext2D;
  origin: Coordinate;
}

export class Bee extends PixelDrawing {
  constructor(params: BeeParams) {
    super(params.ctx, params.origin);
  }

  public draw() {
    this.ctx.save();
    this.ctx.translate(this.origin.x, this.origin.y);
    this.pxMap(beeBitmap, this.origin, BEE.COLORS.BEE);
    this.ctx.restore();
  }
}
