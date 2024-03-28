import { ipcMain } from "electron"
import { getDb } from "../utils/db"

const db = getDb()

// 定义一个全局变量用于存储所有连接的客户端
const clients: any[] = []

export const runWsServer = async () => {
  let res
  try {
    res = await db.getData("/config")
  } catch (err) {
    await db.push(`/config`, {
      webPort: "8080",
      wsPort: "8181",
      roomId: ""
    })
    res = await db.getData("/config")
  }

  const WebSocketServer = require("ws").Server
  const wss = new WebSocketServer({ port: res.wsPort })

  // 当有新连接时
  wss.on("connection", function (ws) {
    console.log("Client connected")

    // 将新连接的WebSocket对象添加到clients数组中
    clients.push(ws)

    ws.on("close", function () {
      console.log("Client disconnected")

      // 在关闭连接时从clients数组中移除对应的客户端
      const index = clients.indexOf(ws)
      if (index !== -1) {
        clients.splice(index, 1)
      }
    })

    // 可选：在接收到消息时进行处理
    // ws.on("message", function (message) {
    //   console.log("Received: ", message);
    // });
  })
}

export const sendMessage = (platform, type, message) => {
  // 遍历所有连接的客户端，并发送消息
  clients.forEach((client) => {
    client.send(JSON.stringify({ type, message, platform }))
  })
}

ipcMain.on("send_debug_message", (_, msg) => {
  sendMessage("DY", "live", msg)
})
