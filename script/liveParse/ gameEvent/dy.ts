import { sendMessage } from "../../modules/GameServer"

const { ipcMain } = require("electron")

const allLiveMessage: any[] = []

const waitGiftTime = 6000
const waitGiftQueue = {}

/**
 * 2个时间，是否小于等于maxDifferenceInSeconds
 */
const checkTimeDifference = (sendTime1, sendTime2, maxDifferenceInSeconds) => {
  const date1 = new Date(sendTime1)
  const date2 = new Date(sendTime2)

  const timeDifference = Math.abs(date2 - date1)
  const timeDifferenceInSeconds = timeDifference / 1000

  return timeDifferenceInSeconds <= maxDifferenceInSeconds
}

const timeOutHandleWebcastGiftMessage = (message) => {
  const { user } = message
  const queueId = `${user.id}${message.giftId}`
  const queueMessage = waitGiftQueue[queueId]
  if (
    queueMessage &&
    queueMessage.traceId === message.traceId &&
    !checkTimeDifference(Date.now(), queueMessage.sendTime, waitGiftTime / 1000)
  ) {
    waitGiftQueue[queueId] = null
    sendMessage(JSON.stringify(message))
  }
}

const handleWebcastGiftMessage = (message) => {
  const { user } = message
  const queueId = `${user.id}${message.giftId}`
  // 处理礼物连刷的情况
  // 如果没有礼物，waitGiftQueue[queueId] == 空
  // 如果waitGiftQueue[queueId] 不为空， 判断当前的礼物数量是不是比Queue里的多，不是的话，非连刷，更新队列信息
  const queueMessage = waitGiftQueue[queueId]
  if (queueMessage) {
    // 同用户同礼物新的送礼数量，少于队列中的送礼数量，说明连刷中断了
    if (
      !checkTimeDifference(message.sendTime, queueMessage.sendTime, waitGiftTime / 1000) &&
      message.repeatCount < queueMessage.repeatCount
    ) {
      sendMessage(JSON.stringify(queueMessage))
    }
  }
  waitGiftQueue[queueId] = message

  setTimeout(() => timeOutHandleWebcastGiftMessage(message), waitGiftTime)
  // sendMessage(JSON.stringify(message))
}

export const dyHandleParse = async (data) => {
  const handleType = data.common.method
  // const db = new JsonDB(new Config(path.join(__dirname, "../db/db.json"), true, true, "/"))
  // let dbData = await db.getData("/controls")
  // dbData = [...dbData]

  switch (handleType) {
    case "WebcastMemberMessage":
      // 进入直播间
      allLiveMessage.push(data)
      break
    case "WebcastGiftMessage":
      // 礼物
      handleWebcastGiftMessage(data)
      allLiveMessage.push(data)
      break
    case "WebcastChatMessage":
      // 弹幕
      allLiveMessage.push(data)
      break
    case "WebcastLikeMessage":
      // 点赞
      allLiveMessage.push(data)
      break
    case "WebcastSocialMessage":
      // 关注
      allLiveMessage.push(data)
      break
  }
}

ipcMain.on("getAllLiveMessage", (event) => {
  event.sender.send("sendAllLiveMessage", allLiveMessage)
})
