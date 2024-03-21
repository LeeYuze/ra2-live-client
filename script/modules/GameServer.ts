import path from "path-browserify"
import { ipcMain } from "electron"

const { JsonDB } = require("node-json-db")
const { Config } = require("node-json-db/dist/lib/JsonDBConfig")

const db = new JsonDB(new Config(path.join(__dirname, "../db/db.json"), true, true, "/"))

// 定义一个全局变量用于存储所有连接的客户端
const clients: any[] = []

export const runWsServer = async () => {
  const res = await db.getData("/config")

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
