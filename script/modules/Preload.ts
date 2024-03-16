import path from "path-browserify"

const { JsonDB } = require("node-json-db")
const { Config } = require("node-json-db/dist/lib/JsonDBConfig")

const db = new JsonDB(new Config(path.join(__dirname, "../db/db.json"), true, true, "/"))

window.database = db
