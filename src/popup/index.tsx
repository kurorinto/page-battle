import { useEffect, useRef, useState } from 'react'

import './index.scss'

import { Button, Input } from 'antd'

const Popup = () => {
  const [data, setData] = useState('click')

  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    window.addEventListener('message', (event) => {
      console.log('EVAL output: ' + event.data)
    })
  }, [])

  return (
    <div className="flex flex-col p-[16px] w-[300px]">
      <Button
        onClick={() => {
          iframeRef.current.contentWindow.postMessage('10 + 20', '*')
          setData(data === 'click' ? 'clicked' : 'click')
        }}>
        {data}
      </Button>
    </div>
  )
}

export default Popup
