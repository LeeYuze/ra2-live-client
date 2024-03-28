import { JsonDB } from "node-json-db"
import { Config } from "node-json-db/dist/lib/JsonDBConfig"
import path from "path-browserify"

export const getDb = () => {
  return new JsonDB(new Config(path.join(__dirname, "../db/db.json"), true, true, "/"))
}
