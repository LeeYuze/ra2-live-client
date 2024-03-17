import startWebsocket from "./ws"
import { Handles } from "./incoming"

process.env.LC_ALL = "zh_CN.UTF-8"
process.env.LANG = "zh_CN.UTF-8"

const handles: Handles = {
  // //弹幕
  // handleChatMessage(data) {},
  // //直播间基本信息
  // handleRoomUserSeqMessage(data) {},
  // //礼物
  // handleGiftMessage(data) {},
  // //关注
  // handleSocialMessage(data) {},
  // //点赞
  // handleLikeMessage(data) {},
  // //进入直播间
  // handleMemberMessage(data) {}
}
export const runDyLiveParse = (liveId: string) => {
  startWebsocket(liveId, handles)
}
