import { PixelDrawing, type Coordinate } from "./PixelDrawing";

interface BeeParams {
  ctx: CanvasRenderingContext2D;
  origin: Coordinate;
}

export class Bee extends PixelDrawing {
  constructor(params: BeeParams) {
    super(params.ctx, params.origin);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.restore();
  }
}
