import { sendMessage } from "../../modules/GameServer"

const waitGiftTime = 5000
const waitGiftQueue = {}
const recordSendGiftCountMap = {}

const timeOutHandleWebcastGiftMessage = (queueId, message) => {
  const queueMessage = waitGiftQueue[queueId]
  if (queueMessage && queueMessage.traceId === message.traceId) {
    waitGiftQueue[queueId] = null
    recordSendGiftCountMap[queueId] = null
  }
}

const editMessageGiftCount = (queueId, message, count) => {
  const data = { ...message }
  data.totalCount = recordSendGiftCountMap[queueId]
  data.repeatCount = count
  data.comboCount = count
  data.common.describe = data.common.describe.replace(Number(message.repeatCount), count)
  return data
}

const handleWebcastGiftMessage = (message) => {
  const { user } = message
  const queueId = `${user.id}${message.giftId}`
  // 处理礼物连刷的情况
  // 如果没有礼物，waitGiftQueue[queueId] == 空
  // 如果waitGiftQueue[queueId] 不为空， 判断当前的礼物数量是不是比Queue里的多，不是的话，非连刷，更新队列信息
  // 收到礼物后，立马发送，如果有连刷情况，就减掉之前发送的数量
  const beforeGiftCount = recordSendGiftCountMap[queueId]
  // 本次正确的送礼数量
  const giftCount = Number(message.repeatCount)
  let sendGiftCount = 0
  if (beforeGiftCount) {
    sendGiftCount = giftCount - beforeGiftCount
    recordSendGiftCountMap[queueId] += sendGiftCount
    if (sendGiftCount <= 0) return
    const sendMessageData = editMessageGiftCount(queueId, message, sendGiftCount)
    sendMessage("DY", "live", sendMessageData)
    // 处理消息
  } else if (!beforeGiftCount || giftCount < beforeGiftCount) {
    // 不存在之前送礼物的数量，或者本次送礼数量少于上次送礼数量
    // 直接发送
    sendMessage("DY", "live", message)
    recordSendGiftCountMap[queueId] = giftCount
  }

  waitGiftQueue[queueId] = message
  setTimeout(() => timeOutHandleWebcastGiftMessage(queueId, message), waitGiftTime)
}

export const dyHandleParse = async (data) => {
  const handleType = data.common.method
  switch (handleType) {
    case "WebcastMemberMessage":
      // 进入直播间
      sendMessage("DY", "live", data)
      break
    case "WebcastGiftMessage":
      // 礼物
      handleWebcastGiftMessage(data)
      break
    case "WebcastChatMessage":
      // 弹幕
      sendMessage("DY", "live", data)
      break
    case "WebcastLikeMessage":
      // 点赞
      sendMessage("DY", "live", data)
      break
    case "WebcastSocialMessage":
      // 关注
      sendMessage("DY", "live", data)
      break
  }
}
