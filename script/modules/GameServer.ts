// const clients: any[] = []
let client: any = null
export const runServer = () => {
  const WebSocketServer = require("ws").Server
  const wss = new WebSocketServer({ port: 8181 })

  // 定义一个发送消息给所有客户端的函数

  wss.on("connection", function (ws) {
    // 将新连接的WebSocket对象添加到clients数组中
    client = ws
    //
    // ws.on("message", function (message) {
    //   // 可选：在接收到消息时进行处理
    // })

    ws.on("close", function () {
      console.log("client disconnected")

      client = null
    })
  })
}

export const sendMessage = (message) => {
  if (client == null) return
  client.send(message)
}
