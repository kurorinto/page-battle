import type { PlasmoCSConfig, PlasmoCSUIProps } from "plasmo"
import { useEffect, type FC, useRef } from "react"

import Battle from "./Battle"

// 进行 content_scripts 的配置
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const MyPopup: FC<PlasmoCSUIProps> = ({ anchor }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // 初始化
  const init = () => {
    if (!containerRef.current) return 
    new Battle(containerRef.current)
  }

  useEffect(() => {
    init()
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
