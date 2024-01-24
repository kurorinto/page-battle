import type { PlasmoCSConfig, PlasmoCSUIProps } from "plasmo"
import { useCallback, useEffect, useRef, type FC } from "react"

import { Storage } from "@plasmohq/storage"

import { EXTENSION_ID } from "~constants"
import type { Message } from "~popup"

import Battle from "./Battle"

const storage = new Storage()

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
    const started = JSON.parse(
      await storage.get("page_battle_started")
    ) as boolean
    started && createBattle()
  }

  const createBattle = () => {
    if (!containerRef.current) return
    battle.current = new Battle(containerRef.current)
  }

  const destroyBattle = () => {
    battle.current?.destroy()
  }

  const messageHandler = useCallback<MessageHandler>((messageJSON, sender) => {
    if (sender.id === EXTENSION_ID) {
      const message: Message = JSON.parse(messageJSON)
      message.started ? createBattle() : destroyBattle()
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
