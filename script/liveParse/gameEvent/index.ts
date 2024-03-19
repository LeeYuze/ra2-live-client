import { dyHandleParse } from "./dy"

export const handleParse = (platform, data) => {
  switch (platform) {
    case "DY":
      dyHandleParse(data)
      break
  }
}
