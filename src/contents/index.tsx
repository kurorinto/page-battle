import { StyleProvider } from "@ant-design/cssinjs"
import { RocketOutlined } from "@ant-design/icons"
import { Button, ConfigProvider } from "antd"
import zhCN from "antd/es/locale/zh_CN"
import cssText from "data-text:~contents/index.scss"
import type { PlasmoCSConfig, PlasmoCSUIProps } from "plasmo"
import { useCallback, useEffect, useState, type FC } from "react"

const primary = "#006bfd"
const hover = "#005DDD"

// 进行 content_scripts 的配置
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const MyPopup: FC<PlasmoCSUIProps> = ({ anchor }) => {
  const [rotate, setRotate] = useState(135)
  const [direction, setDirection] = useState<
    "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight"
  >()

  const shoot = () => {}

  const keydownHandler = useCallback((e: KeyboardEvent) => {
    // 上下左右控制方向
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      setDirection(
        e.key as "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight"
      )
    }
    // 空格发射
    if (e.key === " ") {
      shoot()
    }
    e.preventDefault()
  }, [])

  useEffect(() => {
    switch (direction) {
      case "ArrowUp":
        setRotate(0)
        break
      case "ArrowDown":
        setRotate(180)
        break
      case "ArrowLeft":
        setRotate(270)
        break
      case "ArrowRight":
        setRotate(90)
        break
      default:
        break
    }
  }, [direction])

  useEffect(() => {
    window.addEventListener("keydown", keydownHandler)
    return () => {
      window.removeEventListener("keydown", keydownHandler)
    }
  }, [])

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primary,
          colorPrimaryHover: hover,
          colorInfo: primary,
          colorInfoText: primary,
          colorLink: primary,
          colorLinkHover: hover,
          colorPrimaryText: primary,
          colorText: "#20242C",
          colorSuccess: "#26bd71",
          colorWarning: "#ff7900",
          colorError: "#f53f3f"
        }
      }}
      locale={zhCN}>
      <StyleProvider
        hashPriority="high"
        container={document.querySelector("plasmo-csui").shadowRoot}>
        <div
          className="fixed z-[19980403]"
          style={{ transform: `rotate(${rotate}deg)` }}>
          <RocketOutlined className="text-[24px]" />
        </div>
      </StyleProvider>
    </ConfigProvider>
  )
}

export default MyPopup
