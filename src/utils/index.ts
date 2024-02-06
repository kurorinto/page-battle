import { Storage } from "@plasmohq/storage";

const storage = new Storage()

export interface PageBattleData {
  started?: boolean
  rocketAccelerated?: number
}

const getCacheData = async (): Promise<PageBattleData> => {
  const cacheJSON = await storage.get("page_battle_data")
  return cacheJSON ? JSON.parse(cacheJSON) : {}
}

export function getCache<T extends keyof PageBattleData>(name: T): Promise<PageBattleData[T]>;
export function getCache(): Promise<PageBattleData>;
export async function getCache<T extends keyof PageBattleData>(name?: T) {
  // 取缓存
  const cacheData = await getCacheData()
  return name ? cacheData[name] : cacheData;
}

export const setCache = async (data: PageBattleData) => {
  // 取缓存
  const cacheData = await getCacheData()
  // 更新缓存
  const newCacheData = { ...cacheData, ...data }
  storage.set("page_battle_data", JSON.stringify(newCacheData))
}

export const getCurrentTabId = async (): Promise<chrome.tabs.Tab | undefined> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs.length ? tabs[0] : undefined)
    })
  })
}

/** 获取两个数之间的一个随机整数 isIncludesPoint: 是否包括这两个数 */
export const getRandomInt = (a: number, b: number, isIncludesPoint = true) => {
  let min = Math.ceil(a);
  let max = Math.floor(b);
  if (a > b) {
    [min, max] = [a, b];
  }

  return isIncludesPoint ? Math.floor(Math.random() * (max - min + 1)) + min : Math.floor(Math.random() * (max - min - 1)) + min + 1;
};
