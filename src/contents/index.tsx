import type { PlasmoCSConfig, PlasmoCSUIProps } from "plasmo"
import { useCallback, useEffect, useRef, type FC } from "react"

import { EXTENSION_ID } from "~constants"
import { getCache, type PageBattleData } from "~utils"

import Battle from "./Battle"

type MessageHandler = Parameters<typeof chrome.runtime.onMessage.addListener>[0]

// 进行 content_scripts 的配置
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const MyPopup: FC<PlasmoCSUIProps> = ({ anchor }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const battle = useRef<Battle>()

  // 初始化
  const init = async () => {
    const cacheData = await getCache()
    setGameSettings(cacheData)
  }

  const createBattle = () => {
    if (!containerRef.current) return
    battle.current = new Battle(containerRef.current)
  }

  const destroyBattle = () => {
    battle.current?.destroy()
  }

  const setGameSettings = (data: PageBattleData) => {
    Object.keys(data).forEach((key: keyof PageBattleData) => {
      switch (key) {
        case "started":
          data.started ? createBattle() : destroyBattle()
          break
        case 'maxFps':
          battle.current.maxFps = data.maxFps
          break
        case 'rocketAccelerated':
          battle.current.rocketAccelerated = data.rocketAccelerated
          break
        case 'rocketDeceleratedCoefficient':
          battle.current.rocket.deceleratedCoefficient = data.rocketDeceleratedCoefficient
          break
        case 'rocketDegSpeed':
          battle.current.rocket.degSpeed = data.rocketDegSpeed
          break
        case 'bulletSpeed':
          battle.current.rocket.bulletSpeed = data.bulletSpeed
          break
        case 'firingRate':
          battle.current.rocket.firingRate = data.firingRate
          break
        default:
          break
      }
    })
  }

  const messageHandler = useCallback<MessageHandler>((messageJSON, sender) => {
    if (sender.id === EXTENSION_ID) {
      const data: PageBattleData = JSON.parse(messageJSON)
      setGameSettings(data)
    }
  }, [])

  useEffect(() => {
    init()
    chrome.runtime.onMessage.addListener(messageHandler)

    return () => {
      chrome.runtime.onMessage.removeListener(messageHandler)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 19980403,
        pointerEvents: "none"
      }}
    />
  )
}

export default MyPopup
