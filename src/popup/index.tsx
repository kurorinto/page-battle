import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import { Button } from "./components/ui/button"

import "./index.scss"

import { Slider } from "./components/ui/slider"

const storage = new Storage()

export interface Message {
  started: boolean
}

const getCurrentTabId = async (): Promise<chrome.tabs.Tab | undefined> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs.length ? tabs[0] : undefined)
    })
  })
}

const Popup = () => {
  const [loaded, setLoaded] = useState(false)
  const [started, setStarted] = useState(false)
  const [rocketSpeed, setRocketSpeed] = useState(5)
  const [bulletSpeed, setBulletSpeed] = useState(15);
  const [firingRate, setFiringRate] = useState(10);

  const init = async () => {
    const storageStarted = JSON.parse(
      await storage.get("page_battle_started")
    ) as boolean
    setStarted(storageStarted)
    setLoaded(true)
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    storage.set("page_battle_started", started)
  }, [started])

  return (
    <div className="w-[360px] p-[8px] flex flex-col gap-y-[12px] bg-[#fff]">
      <div className="text-[20px]">
        <div>Page Battle</div>
        <div className="text-[14px]">在页面上开始你的飞机大战吧！</div>
        <div className="text-gray-500 text-[12px]">
          操作说明：W(或↑)前进，A(或←)左转，D(或→)右转。空格发射
        </div>
      </div>
      <div className="flex flex-col gap-y-[4px]">
        <div className="flex items-center">
          <div className="break-all text-nowrap">飞机速度：</div>
          <div className="w-[30px] mr-[4px]">({rocketSpeed})</div>
          <Slider
            className="flex-1"
            value={[rocketSpeed]}
            max={100}
            step={1}
            onValueChange={([val]) => {
              setRocketSpeed(val)
            }}
          />
        </div>
        <div className="flex items-center">
          <div className="break-all text-nowrap">子弹速度：</div>
          <div className="w-[30px] mr-[4px]">({bulletSpeed})</div>
          <Slider
            className="flex-1"
            value={[bulletSpeed]}
            max={100}
            step={1}
            onValueChange={([val]) => {
              setBulletSpeed(val)
            }}
          />
        </div>
        <div className="flex items-center">
          <div className="break-all text-nowrap">子弹射速：</div>
          <div className="w-[30px] mr-[4px]">({firingRate})</div>
          <Slider
            className="flex-1"
            value={[firingRate]}
            max={100}
            step={1}
            onValueChange={([val]) => {
              setFiringRate(val)
            }}
          />
        </div>
      </div>
      {loaded && (
        <Button
          variant={started ? "destructive" : "default"}
          onClick={async () => {
            setStarted(!started)

            const currentTab = await getCurrentTabId()
            if (currentTab) {
              const message: Message = {
                started: !started
              }
              chrome.tabs.sendMessage(currentTab.id, JSON.stringify(message))
            }
          }}>
          {started ? "Stop" : "Start"}
        </Button>
      )}
    </div>
  )
}

export default Popup
