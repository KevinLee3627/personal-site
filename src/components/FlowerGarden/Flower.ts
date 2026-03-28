const STEM = {
  color: "#2acf3b",
  width: 2,
  height: 40,
};

const LEAF = {
  colors: {
    leaf: "rgb(13, 168, 47)",
    vein: "rgb(8, 75, 22)",
  },
  width: 12,
  height: 4,
};

// artisanal, hand-crafted bitmaps
const leafMappings = {
  straight: [
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1],
    [0, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  ],
  droop: [
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0],
    [0, 1, 1, 2, 1, 1, 1, 2, 1, 1, 0, 0],
    [0, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0],
    [1, 1, 1, 0, 0, 0, 0, 1, 1, 2, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  ],
  droop2: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 1, 0],
    [0, 0, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 2, 2, 2, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

interface Coordinate {
  x: number;
  y: number;
}

export interface FlowerParams {
  origin: Coordinate;
  ctx: CanvasRenderingContext2D;
}

export class Flower {
  // The origin is defined as the base of the stem.
  origin: Coordinate;
  ctx: CanvasRenderingContext2D;

  PX_SCALE = 4;

  constructor(params: FlowerParams) {
    this.origin = params.origin;
    this.ctx = params.ctx;
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

  // Given a mapping of pixel coordinates, draw that shape according to the map.
  private pxMap(pxMap: number[][], startCoord: Coordinate, colorMap: string[]) {
    this.ctx.save();

    this.ctx.translate(this.pxCoord(startCoord.x), this.pxCoord(startCoord.y));
    pxMap.forEach((row, rowIdx) => {
      row.forEach((cell, cellIdx) => {
        this.ctx.fillStyle = colorMap[cell];
        this.px(cellIdx, rowIdx);
      });
    });

    this.ctx.restore();
  }

  public draw(ctx: CanvasRenderingContext2D) {
    // Everything is now drawn from the origin
    ctx.save();
    ctx.translate(this.origin.x, this.origin.y);

    // STEM
    ctx.save();

    ctx.fillStyle = STEM.color;
    this.pxRect(0, 0, STEM.width, -STEM.height);

    ctx.restore();

    // LEAF
    ctx.save();

    this.pxMap(leafMappings.droop2, { x: STEM.width, y: -STEM.height / 2 }, [
      "transparent",
      LEAF.colors.leaf,
      LEAF.colors.vein,
    ]);

    this.pxMap(leafMappings.droop, { x: STEM.width, y: -STEM.height }, [
      "transparent",
      LEAF.colors.leaf,
      LEAF.colors.vein,
    ]);
    ctx.restore();

    // Final restore to get rid of the translation to the flower's origin
    ctx.restore();
  }
}
