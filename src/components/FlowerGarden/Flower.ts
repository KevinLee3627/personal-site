import { leafBitmaps, type Bitmap } from "./bitmaps";
import { LEAF, STEM } from "./constants";

const randomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor((max - min + 1) * Math.random()) + min;
};

interface Coordinate {
  x: number;
  y: number;
}

export interface FlowerParams {
  origin: Coordinate;
  ctx: CanvasRenderingContext2D;
}

interface LeafParams {
  leafStyle: Bitmap;
  startCoord: Coordinate;
  colorMap: string[];
  ctx: CanvasRenderingContext2D;
}

class Leaf {
  leafStyle: Bitmap;
  startCoord: Coordinate;
  colorMap: string[];
  ctx: CanvasRenderingContext2D;
  constructor({ leafStyle, startCoord, colorMap, ctx }: LeafParams) {
    this.leafStyle = leafStyle;
    this.startCoord = startCoord;
    this.colorMap = colorMap;
    this.ctx = ctx;
  }

  public draw() {}
}

export class Flower {
  // the origin is defined as the base of the stem!
  origin: Coordinate;
  ctx: CanvasRenderingContext2D;

  PX_SCALE = 4;
  stemHeight: number;
  stemWidth: number;
  leaves: Leaf[] = [];

  constructor(params: FlowerParams) {
    this.origin = params.origin;
    this.ctx = params.ctx;

    this.stemWidth = randomInt(STEM.WIDTH.MIN, STEM.WIDTH.MAX);
    this.stemHeight = randomInt(STEM.HEIGHT.MIN, STEM.HEIGHT.MAX);
  }

  private pxCoord(num: number) {
    return Math.round(num * this.PX_SCALE);
  }

  private px(x: number, y: number) {
    this.ctx.fillRect(
      this.pxCoord(x),
      this.pxCoord(y),
      this.PX_SCALE,
      this.PX_SCALE,
    );
  }

  private pxRect(x: number, y: number, width: number, height: number) {
    this.ctx.fillRect(
      this.pxCoord(x),
      this.pxCoord(y),
      width * this.PX_SCALE,
      height * this.PX_SCALE,
    );
  }

  // given a mapping of pixel coordinates, draw that shape according to the map.
  private pxMap(bitmap: Bitmap, startCoord: Coordinate, colorMap: string[]) {
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

  public init() {
    const numLeaves = randomInt(LEAF.MIN_AMOUNT, LEAF.MAX_AMOUNT);
    const leafStyleChoices = Object.values(leafBitmaps);

    for (let i = 0; i <= numLeaves; i++) {
      const leafStyle =
        leafStyleChoices[randomInt(0, leafStyleChoices.length - 1)];
      const startCoord: Coordinate = {
        x: this.stemWidth,
        y: randomInt(0, -this.stemHeight),
      };
      const leafColorMap = ["transparent", LEAF.COLORS.LEAF, LEAF.COLORS.VEIN];
      this.leaves.push(
        new Leaf({
          leafStyle,
          startCoord,
          colorMap: leafColorMap,
          ctx: this.ctx,
        }),
      );
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    // Everything is now drawn from the origin
    ctx.save();
    ctx.translate(this.origin.x, this.origin.y);

    // STEM
    ctx.save();

    ctx.fillStyle = STEM.COLORS.STEM;
    this.pxRect(0, 0, this.stemWidth, -this.stemHeight);

    ctx.restore();

    // LEAVES
    ctx.save();
    this.leaves.forEach((leaf) =>
      this.pxMap(leaf.leafStyle, leaf.startCoord, leaf.colorMap),
    );
    ctx.restore();

    // final restore to get rid of the translation to the flower's origin
    ctx.restore();
  }
}
