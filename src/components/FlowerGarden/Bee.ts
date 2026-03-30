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
  nextFlower: Flower | null;
  speed: number = 3;
  landingTimer: number = 0; // # of frames bee has stayed at a flower
  landingDuration: number = 60;

  constructor(params: BeeParams) {
    super(params.ctx, params.origin);
    this.flowers = params.flowers;
    this.nextFlower = this.flowers[randomInt(0, this.flowers.length - 1)];
  }

  private pickFlower(): Flower {
    let candidates: Flower[];
    if (this.nextFlower == null) {
      candidates = this.flowers;
    } else {
      candidates = this.flowers.filter((flower) => flower !== this.nextFlower);
    }
    return candidates[randomInt(0, candidates.length - 1)];
  }

  private setLandingDuration() {
    this.landingDuration = randomInt(BEE.LANDING_DURATION.MIN, BEE.LANDING_DURATION.MAX);
  }

  private resetLandingTimer() {
    this.landingTimer = 0;
  }

  private update() {
    if (this.flowers.length === 0) {
      return;
    }

    // 1: pick a random flower (should not be same as last visited flower)
    if (this.nextFlower == null) {
      this.nextFlower = this.pickFlower();
    }

    // 2: move to that flower (with some variance)
    // To move to a flower...
    console.log(beeBitmap[0].length);

    // set the target to somewhre 'around' the flower
    // const targetXMin = this.nextFlower.origin.x - this.pxCoord(beeBitmap[0].length);
    // const targetXMax = this.nextFlower.origin.x + this.pxCoord(beeBitmap[0].length);
    const dx = this.origin.x - this.nextFlower.origin.x;
    const dy = this.origin.y - this.nextFlower.origin.y;
    // increment origin.x and y by the SPEED until x and/or y match the target origin
    // math.min clamps speed so there is no 'jitter'
    this.origin.x -= Math.sign(dx) * Math.min(this.speed, Math.abs(dx));
    this.origin.y -= Math.sign(dy) * Math.min(this.speed, Math.abs(dy));

    // 3: sit at that flower for a random amount of time
    if (dx === 0 && dy === 0) {
      this.landingTimer++;

      if (this.landingTimer >= this.landingDuration) {
        this.resetLandingTimer();
        this.setLandingDuration();
        this.nextFlower = this.pickFlower();
      }
    }

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
