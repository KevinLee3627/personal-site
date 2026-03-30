import { randomInt } from "../../util";
import { beeBitmap } from "./bitmaps";
import { BEE } from "./constants";
import { Flower } from "./Flower";
import { PixelDrawing, type Coordinate } from "./PixelDrawing";

interface BeeParams {
  ctx: CanvasRenderingContext2D;
  origin: Coordinate;
  flowers: Flower[];
}

export class Bee extends PixelDrawing {
  flowers: Flower[];
  nextTarget: Flower | null;
  speed: number = 1;

  constructor(params: BeeParams) {
    super(params.ctx, params.origin);
    this.flowers = params.flowers;
    this.nextTarget = this.flowers[randomInt(0, this.flowers.length - 1)];
  }

  private pickFlower(): Flower {
    let candidates: Flower[];
    if (this.nextTarget == null) {
      candidates = this.flowers;
    } else {
      candidates = this.flowers.filter((flower) => flower !== this.nextTarget);
    }
    return this.flowers[randomInt(0, this.flowers.length - 1)];
  }

  private update() {
    if (this.flowers.length === 0) {
      return;
    }

    // 1: pick a random flower (should not be same as last visited flower)
    // 3: sit at that flower for a random amount of time
    // 4. repeat
    if (this.nextTarget == null) {
      this.nextTarget = this.pickFlower();
    }

    // 2: move to that flower (with some variance)
    // To move to a flower...
    const dx = this.origin.x - this.nextTarget.origin.x;
    const dy = this.origin.y - this.nextTarget.origin.y;
    // increment origin.x and y by the SPEED untill x and/or y match the target origin

    this.origin.x -= Math.sign(dx) * this.speed;
    this.origin.y -= Math.sign(dy) * this.speed;

    this.ctx.translate(this.origin.x, this.origin.y);
  }

  public draw() {
    this.ctx.save();
    this.update();
    // we move the bee arounnd by changing its origin, so set startCoord to 0,0 to always draw @ origin
    this.pxMap(beeBitmap, { x: 0, y: 0 }, BEE.COLORS.BEE);
    this.ctx.restore();
  }
}
