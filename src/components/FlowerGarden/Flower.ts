import { leafBitmaps, type Bitmap } from "./bitmaps";
import { LEAF, STEM } from "./constants";

const randomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor((max - min + 1) * Math.random()) + min;
};

const clamp = (num: number, min: number, max: number) =>
  Math.max(Math.min(min, num), max);

function randomEnumValue<T extends object>(e: T): T[keyof T] {
  const values = Object.values(e);
  return values[randomInt(0, values.length - 1)];
}

interface Coordinate {
  x: number;
  y: number;
}

enum LeafDirection {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

interface Leaf {
  leafStyle: Bitmap;
  startCoord: Coordinate;
  colorMap: string[];
}

interface FlowerParams {
  origin: Coordinate;
  ctx: CanvasRenderingContext2D;
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

  private generateLeaves(amt: number, leafStyles: Bitmap[]) {
    // STOP FORGETTING NUMBERS ARE NEGATIVE...CANVAS!!!
    const minY = Math.floor(-this.stemHeight * 0.25);
    const maxY = Math.floor(-this.stemHeight * 0.9);
    const slotHeight = Math.floor(Math.abs((maxY - minY) / amt));
    for (let i = 0; i < amt; i++) {
      // How do we make sure leaves are not too close to each other?
      // Guarantee space between leaves
      // Something like sequencer project - 'quantize' spots a leaf can go
      const slotStart = Math.floor(minY - i * slotHeight);
      const y = randomInt(slotStart - slotHeight, slotStart);
      let x = this.stemWidth;
      let leafStyle = leafStyles[randomInt(0, leafStyles.length - 1)];

      const direction = randomEnumValue(LeafDirection);
      if (direction === LeafDirection.LEFT) {
        leafStyle = structuredClone(leafStyle).map((row) => [...row].reverse());
        x = -leafStyle[0].length;
      }

      const startCoord: Coordinate = { x, y };

      const leafColorMap = ["transparent", LEAF.COLORS.LEAF, LEAF.COLORS.VEIN];
      this.leaves.push({
        leafStyle,
        startCoord,
        colorMap: leafColorMap,
      });
    }
  }

  public init() {
    const numLeaves = randomInt(LEAF.MIN_AMOUNT, LEAF.MAX_AMOUNT);
    const leafStyleChoices = Object.values(leafBitmaps);

    this.generateLeaves(numLeaves, leafStyleChoices);
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
