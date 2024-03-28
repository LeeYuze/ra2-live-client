import { mainLog } from "../utils/logger"
import { getDb } from "../utils/db"

const Koa = require("koa")

let db = getDb()

export const runWebServer = async () => {
  let res
  let port
  try {
    res = await db.getData("/config")
    port = res.webPort
  } catch (e) {
    mainLog.error(e)
    port = 8080
  }
  const app = new Koa()

  app.use(async (ctx) => {
    ctx.set("Access-Control-Allow-Origin", "*")
    ctx.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
    )
    ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS")
    if (ctx.path === "/controls" && ctx.method === "GET") {
      db = getDb()
      const controls = await db.getData("/controls")
      ctx.body = {
        res: controls
      }
    }

    if (ctx.path === "/config" && ctx.method === "GET") {
      db = getDb()
      const config = await db.getData("/config")
      ctx.body = {
        res: config
      }
    }
  })

  app.listen(port, () => {
    console.log("-----------------Koa: running!port:" + port)
  })
}
