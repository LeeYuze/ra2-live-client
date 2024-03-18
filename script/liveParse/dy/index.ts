import startWebsocket from "./ws"
import { Handles } from "./incoming"
import { handleParse } from "../ gameEvent"

process.env.LC_ALL = "zh_CN.UTF-8"
process.env.LANG = "zh_CN.UTF-8"

const handles: Handles = {
  //弹幕
  handleChatMessage(data) {
    handleParse("DY", data)
  },
  // //直播间基本信息
  // handleRoomUserSeqMessage(data) {},
  //礼物
  handleGiftMessage(data) {
    handleParse("DY", data)
  },
  //关注
  handleSocialMessage(data) {
    handleParse("DY", data)
  },
  //点赞
  handleLikeMessage(data) {
    handleParse("DY", data)
  },
  //进入直播间
  handleMemberMessage(data) {
    handleParse("DY", data)
  }
}
export const runDyLiveParse = (liveId: string) => {
  startWebsocket(liveId, handles)
}
