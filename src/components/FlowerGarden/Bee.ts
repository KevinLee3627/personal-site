import { beeBitmap } from "./bitmaps";
import { BEE } from "./constants";
import type { Flower } from "./Flower";
import { PixelDrawing, type Coordinate } from "./PixelDrawing";

interface BeeParams {
  ctx: CanvasRenderingContext2D;
  origin: Coordinate;
  flowers: Flower[];
}

export class Bee extends PixelDrawing {
  flowers: Flower[];

  constructor(params: BeeParams) {
    super(params.ctx, params.origin);
    this.flowers = params.flowers;
  }

  public draw() {
    this.ctx.save();
    this.ctx.translate(this.origin.x, this.origin.y);
    this.pxMap(beeBitmap, this.origin, BEE.COLORS.BEE);
    this.ctx.restore();
  }
}
