export const STEM = {
  COLORS: { STEM: "#2ACF3B" },
  WIDTH: { MIN: 2, MAX: 2 },
  HEIGHT: { MIN: 40, MAX: 70 },
};

export const LEAF = {
  COLORS: ["transparent", "rgb(13, 168, 47)", "rgb(8, 75, 22)"],
  MIN_AMOUNT: 2,
  MAX_AMOUNT: 5,
};

// export enum FLOWER_NAME {
//   ROSE = "ROSE",
//   LAVENDER = "LAVENDER",
//   YELLOW = "YELLOW",
// }

export type FlowerName = "ROSE" | "PINK" | "YELLOW" | "CYAN" | "LAVENDER";

export const FLOWER = {
  COLORS: {
    ROSE: ["transparent", "black", "#A42121"],
    PINK: ["transparent", "#9e0b97", "#df5ed8", "#e0c723"],
    YELLOW: ["transparent", "#cfb411", "#ffdb02", "#ae6f2f"],
    CYAN: ["transparent", "#1b7d76", "#30e0d4"],
    LAVENDER: ["transparent", "#7c4399", "#c082e0", "#f5e165", "#501f68", "#2a6e18"],
  },
};
