export const randomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor((max - min + 1) * Math.random()) + min;
};

export function randomEnumValue<T extends object>(e: T): T[keyof T] {
  const values = Object.values(e);
  return values[randomInt(0, values.length - 1)];
}
