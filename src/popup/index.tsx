import { useEffect, useState } from "react"

import { Button } from "./components/ui/button"

import "./index.scss"

import {
  getCache,
  setCache,
  type PageBattleData,
  sendMessageToContent
} from "~utils"

import GameParamSlider from "./CustomComponents/GameParamSlider"

const Popup = () => {
  const [loaded, setLoaded] = useState(false)
  const [pageBattleData, setPageBattleData] = useState<PageBattleData>({
    started: false,
    maxFps: 60,
    rocketAccelerated: 1200,
    rocketDeceleratedCoefficient: 2,
    rocketDegSpeed: 300,
    bulletSpeed: 500,
    firingRate: 100
  })

  const init = async () => {
    const cacheData = await getCache()
    setPageBattleData(cacheData)
    setLoaded(true)
  }

  const pageBattleDataSetter = <T extends keyof PageBattleData>(name: T, value: PageBattleData[T]) => {
    setPageBattleData({ ...pageBattleData, [name]: value })
    // 发送消息给content
    sendMessageToContent({ [name]: value })
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    setCache(pageBattleData)
  }, [pageBattleData])

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
          value={[pageBattleData.maxFps]}
          max={60}
          min={10}
          step={1}
          onValueChange={([val]) => {
            pageBattleDataSetter("maxFps", val)
          }}
        />
        <GameParamSlider
          label="飞机加速度"
          value={[pageBattleData.rocketAccelerated]}
          max={10000}
          min={500}
          step={100}
          onValueChange={([val]) => {
            pageBattleDataSetter("rocketAccelerated", val)
          }}
        />
        <GameParamSlider
          label="飞行阻力系数"
          value={[pageBattleData.rocketDeceleratedCoefficient]}
          max={5}
          min={1}
          step={0.1}
          onValueChange={([val]) => {
            pageBattleDataSetter("rocketDeceleratedCoefficient", val)
          }}
        />
        <GameParamSlider
          label="转向灵敏度"
          value={[pageBattleData.rocketDegSpeed]}
          max={1000}
          min={200}
          step={10}
          onValueChange={([val]) => {
            pageBattleDataSetter("rocketDegSpeed", val)
          }}
        />
        <GameParamSlider
          label="子弹速度"
          value={[pageBattleData.bulletSpeed]}
          max={2000}
          min={200}
          step={100}
          onValueChange={([val]) => {
            pageBattleDataSetter("bulletSpeed", val)
          }}
        />
        <GameParamSlider
          label="子弹发射间隔"
          value={[pageBattleData.firingRate]}
          max={500}
          min={10}
          step={10}
          onValueChange={([val]) => {
            pageBattleDataSetter("firingRate", val)
          }}
        />
      </div>
      {loaded && (
        <Button
          variant={pageBattleData.started ? "destructive" : "default"}
          onClick={async () => {
            pageBattleDataSetter("started", !pageBattleData.started)
          }}>
          {pageBattleData.started ? "Stop" : "Start"}
        </Button>
      )}
    </div>
  )
}

export default Popup
