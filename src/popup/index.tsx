import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import "./index.scss"
import { Button } from "./components/ui/button"

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
    <div>
      {loaded && (
        <Button
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
          {started ? "Stop" : "Play"}
        </Button>
      )}
    </div>
  )
}

export default Popup
