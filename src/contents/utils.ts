import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** 获取两个数之间的一个随机整数 isIncludesPoint: 是否包括这两个数 */
export const getRandomInt = (a: number, b: number, isIncludesPoint = true) => {
  let min = Math.ceil(a);
  let max = Math.floor(b);
  if (a > b) {
    [min, max] = [a, b];
  }

  return isIncludesPoint ? Math.floor(Math.random() * (max - min + 1)) + min : Math.floor(Math.random() * (max - min - 1)) + min + 1;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
