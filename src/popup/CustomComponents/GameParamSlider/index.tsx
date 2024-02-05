import type { ComponentProps, FC, ReactNode } from "react"

import { Slider } from "../../components/ui/slider"

interface GameParamSliderProps extends ComponentProps<typeof Slider> {
  label?: ReactNode
}

const GameParamSlider: FC<GameParamSliderProps> = (props) => {
  const { label } = props
  return (
    <div className="flex flex-col gap-y-[6px]">
      <div className="flex items-center justify-between">
        <div>{label}</div>
        <div>{props.value[0]}</div>
      </div>
      <Slider className="flex-1" {...props} />
    </div>
  )
}

export default GameParamSlider
