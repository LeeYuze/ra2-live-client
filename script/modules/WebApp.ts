import path from "path-browserify"

const Koa = require("koa")
const { JsonDB } = require("node-json-db")
const { Config } = require("node-json-db/dist/lib/JsonDBConfig")

const db = new JsonDB(new Config(path.join(__dirname, "../db/db.json"), true, true, "/"))

export const runWebServer = async () => {
  const controls = await db.getData("/controls")

  const res = await db.getData("/config")
  const port = res.webPort
  const app = new Koa()

  app.use(async (ctx) => {
    ctx.set("Access-Control-Allow-Origin", "*")
    ctx.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
    )
    ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS")
    if (ctx.path === "/controls" && ctx.method === "GET") {
      ctx.body = {
        res: controls
      }
    }
  })

  app.listen(port, () => {
    console.log("-----------------Koa: running!port:" + port)
  })
}
