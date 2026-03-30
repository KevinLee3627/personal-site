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
  nextFlower: Flower | null = null;
  readonly speed: number = 3;
  landingTimer: number = 0; // # of frames bee has stayed at a flower
  landingDuration: number = 60;
  landingCoordinate: Coordinate | null = null;

  constructor(params: BeeParams) {
    super(params.ctx, params.origin);
    this.flowers = params.flowers;
  }

  private getLandingCoordinate(flower: Flower): Coordinate {
    const beeWidth = this.pxCoord(beeBitmap[0].length);
    const targetXMin = flower.origin.x - beeWidth;
    const targetXMax = flower.origin.x + beeWidth;
    const targetX = randomInt(targetXMin, targetXMax);

    // converting to pxCoord so we're all working on the same coord system
    const flowerStemHeight = this.pxCoord(flower.stemHeight);
    const flowerHeight = this.pxCoord(flower.flowerStyleBitmap.length);
    // max/min flipped b/c positive y = more down...frickin canvas
    const targetYMax = flower.origin.y - flowerStemHeight;
    const targetYMin = flower.origin.y - flowerStemHeight - flowerHeight;

    const targetY = randomInt(targetYMin, targetYMax);
    return { x: targetX, y: targetY };
  }

  private pickFlower(): { flower: Flower; landingCoordinate: Coordinate } {
    const candidates =
      this.nextFlower != null
        ? this.flowers.filter((flower) => flower !== this.nextFlower)
        : this.flowers;

    // ensures that if there's only 1 flower the bee doesn't FREAK OUT!
    const pool = candidates.length > 0 ? candidates : this.flowers;
    const flower = pool[randomInt(0, pool.length - 1)];
    const landingCoordinate = this.getLandingCoordinate(flower);
    return { flower, landingCoordinate };
  }

  private update() {
    if (this.flowers.length === 0) {
      return;
    }

    // 1: pick a random flower (should not be same as last visited flower)
    if (this.nextFlower == null || this.landingCoordinate == null) {
      const { flower, landingCoordinate } = this.pickFlower();
      this.nextFlower = flower;
      this.landingCoordinate = landingCoordinate;
    }

    // 2: move to that flower (with some variance)
    // To move to a flower...
    const dx = this.origin.x - this.landingCoordinate.x;
    const dy = this.origin.y - this.landingCoordinate.y;
    // increment origin.x and y by the SPEED until x and/or y match the target origin
    // math.min clamps speed so there is no 'jitter'
    this.origin.x -= Math.sign(dx) * Math.min(this.speed, Math.abs(dx));
    this.origin.y -= Math.sign(dy) * Math.min(this.speed, Math.abs(dy));

    // 3: sit at that flower for a random amount of time, then reset once
    // the bee has had ennough
    if (dx === 0 && dy === 0) {
      this.landingTimer++;

      if (this.landingTimer >= this.landingDuration) {
        this.landingTimer = 0;
        this.landingDuration = randomInt(BEE.LANDING_DURATION.MIN, BEE.LANDING_DURATION.MAX);
        const { flower, landingCoordinate } = this.pickFlower();
        this.nextFlower = flower;
        this.landingCoordinate = landingCoordinate;
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
