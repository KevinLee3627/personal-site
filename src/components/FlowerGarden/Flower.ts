import { randomEnumValue, randomInt } from "../../util";
import { flowerBitMaps, leafBitmaps, type Bitmap } from "./bitmaps";
import { FLOWER, LEAF, STEM, type FlowerName } from "./constants";
import { PixelDrawing, type Coordinate } from "./PixelDrawing";

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

export class Flower extends PixelDrawing {
  stemHeight: number;
  stemWidth: number;
  leaves: Leaf[] = [];
  flowerStyleName: FlowerName;
  flowerStyleBitmap: Bitmap = [];

  constructor(params: FlowerParams) {
    super(params.ctx, params.origin);
    this.origin = params.origin;
    this.ctx = params.ctx;

    this.stemWidth = randomInt(STEM.WIDTH.MIN, STEM.WIDTH.MAX);
    this.stemHeight = randomInt(STEM.HEIGHT.MIN, STEM.HEIGHT.MAX);

    const flowerStyleChoices = Object.entries(flowerBitMaps);
    const flowerStyleChoice = flowerStyleChoices[randomInt(0, flowerStyleChoices.length - 1)];
    this.flowerStyleName = flowerStyleChoice[0] as FlowerName;
    this.flowerStyleBitmap = flowerStyleChoice[1];
  }

  private generateLeaves(amt: number, leafStyles: Bitmap[]) {
    // STOP FORGETTING NUMBERS ARE NEGATIVE...CANVAS!!!
    const minY = Math.floor(-this.stemHeight * 0.25);
    const maxY = Math.floor(-this.stemHeight * 0.8);
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

      this.leaves.push({
        leafStyle,
        startCoord,
        colorMap: LEAF.COLORS,
      });
    }
  }

  public init() {
    const numLeaves = randomInt(LEAF.MIN_AMOUNT, LEAF.MAX_AMOUNT);
    const leafStyleChoices = Object.values(leafBitmaps);

    this.generateLeaves(numLeaves, leafStyleChoices);
  }

  public draw() {
    // Everything is now drawn from the origin
    this.ctx.save();
    this.ctx.translate(this.origin.x, this.origin.y);

    // STEM
    this.ctx.save();

    this.ctx.fillStyle = STEM.COLORS.STEM;
    this.pxRect(0, 0, this.stemWidth, -this.stemHeight);

    this.ctx.restore();

    // LEAVES
    this.ctx.save();
    this.leaves.forEach((leaf) => this.pxMap(leaf.leafStyle, leaf.startCoord, leaf.colorMap));
    this.ctx.restore();

    // FLOWER
    this.ctx.save();

    const flowerX = -flowerBitMaps[this.flowerStyleName][0].length / 2 + this.stemWidth / 2;
    const flowerY = -this.stemHeight - flowerBitMaps[this.flowerStyleName].length + 8;
    this.pxMap(
      this.flowerStyleBitmap,
      { x: flowerX, y: flowerY },
      FLOWER.COLORS[this.flowerStyleName],
    );

    this.ctx.restore();

    // final restore to get rid of the translation to the flower's origin
    this.ctx.restore();
  }
}
