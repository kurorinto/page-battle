import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import { Button } from "./components/ui/button"

import "./index.scss"

import GameParamSlider from "./CustomComponents/GameParamSlider"

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
  const [maxFps, setMaxFps] = useState(60);
  /** 飞机加速度 */
  const [rocketAccelerated, setRocketAccelerated] = useState(5)
  /** 飞机转向灵敏度 */
  const [rocketDegSpeed, setRocketDegSpeed] = useState(5)
  /** 飞机飞行阻力系数 */
  const [rocketDeceleratedCoefficient, setRocketDeceleratedCoefficient] = useState(5)
  /** 子弹速度 */
  const [bulletSpeed, setBulletSpeed] = useState(15)
  /** 子弹射速 */
  const [firingRate, setFiringRate] = useState(10)

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
          操作说明：W(或↑)前进，A(或←)左转，D(或→)右转，空格发射
        </div>
      </div>
      <div className="flex flex-col gap-y-[12px]">
        <GameParamSlider
          label="最大帧率"
          value={[maxFps]}
          max={60}
          min={10}
          step={1}
          onValueChange={([val]) => {
            setMaxFps(val)
          }}
        />
        <GameParamSlider
          label="飞机加速度"
          value={[rocketAccelerated]}
          max={100}
          step={1}
          onValueChange={([val]) => {
            setRocketAccelerated(val)
          }}
        />
        <GameParamSlider
          label="飞行阻力系数"
          value={[rocketDeceleratedCoefficient]}
          max={100}
          step={1}
          onValueChange={([val]) => {
            setRocketDeceleratedCoefficient(val)
          }}
        />
        <GameParamSlider
          label="转向灵敏度"
          value={[rocketDegSpeed]}
          max={100}
          step={1}
          onValueChange={([val]) => {
            setRocketDegSpeed(val)
          }}
        />
        <GameParamSlider
          label="子弹速度"
          value={[bulletSpeed]}
          max={100}
          step={1}
          onValueChange={([val]) => {
            setBulletSpeed(val)
          }}
        />
        <GameParamSlider
          label="子弹射速"
          value={[firingRate]}
          max={100}
          step={1}
          onValueChange={([val]) => {
            setFiringRate(val)
          }}
        />
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
