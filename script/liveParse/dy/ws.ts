import type { Handles } from "./incoming"
import { parseLiveUrl } from "./parse"
import { initWsConnect } from "./connect"
import { heartbeat, incoming } from "./incoming"

const startWebsocket = async (liveId: string, handlers: Handles) => {
  const { ttwid, liveRoomId } = await parseLiveUrl(liveId)

  //  每8秒发送一次心跳，保持服务器持续连接
  let timer: NodeJS.Timer

  const ws = await initWsConnect({ ttwid, liveRoomId })

  ws.binaryType = "arraybuffer"

  ws.onopen = () => {
    timer = setInterval(() => {
      heartbeat(ws)
    }, 8000)
    // logger.info('connected')
  }

  ws.onclose = () => {
    clearInterval(timer)
    // logger.warn('disconnected')
  }

  ws.onerror = (err) => console.error(err.error)

  ws.onmessage = (data) => incoming(data, ws, handlers)

  return ws
}

export default startWebsocket
