import type WebSocket from "ws"
import protobuf from "protobufjs"

import { mainLog } from "../../utils/logger"
import { tools } from "../../utils"
import type { DY } from "./proto/dy"
import path from "path"
import GlobalConfig from "../../modules/GlobalConfig"

const isDev = GlobalConfig.IS_DEV_MODE

const proto = !isDev
  ? path.join(process.resourcesPath, "./extraResources/dy.proto")
  : path.join("./extraResources/dy.proto")

export interface Handles {
  handleChatMessage?: (data: DY.ChatMessage) => void
  handleCommonTextMessage?: (data: DY.CommonTextMessage) => void
  handleGiftMessage?: (data: DY.GiftMessage) => void
  handleLikeMessage?: (data: DY.LikeMessage) => void
  handleMatchAgainstScoreMessage?: (data: DY.MatchAgainstScoreMessage) => void
  handleMemberMessage?: (data: DY.MemberMessage) => void
  handleRoomUserSeqMessage?: (data: DY.RoomUserSeqMessage) => void
  handleSocialMessage?: (data: DY.SocialMessage) => void
  handleUpdateFanTicketMessage?: (data: DY.UpdateFanTicketMessage) => void
  handleUnknowMessage?: (method: string, data: Buffer) => void
}

export async function heartbeat(ws: WebSocket) {
  const root = await protobuf.load(proto)
  const PushFrame = root.lookupType("douyin.PushFrame")

  const obj = PushFrame.create({ payloadType: "hb" })
  ws.ping(PushFrame.encode(obj).finish())
}

export async function incoming(
  data: any,
  ws: WebSocket,
  {
    handleChatMessage,
    handleCommonTextMessage,
    handleGiftMessage,
    handleLikeMessage,
    handleMatchAgainstScoreMessage,
    handleMemberMessage,
    handleRoomUserSeqMessage,
    handleSocialMessage,
    handleUpdateFanTicketMessage,
    handleUnknowMessage
  }: Handles
) {
  const root = await protobuf.load(proto)
  mainLog.info(proto)
  const PushFrame = root.lookupType("douyin.PushFrame")
  const Response = root.lookupType("douyin.Response")
  const ChatMessage = root.lookupType("douyin.ChatMessage")
  const CommonTextMessage = root.lookupType("douyin.CommonTextMessage")
  const RoomUserSeqMessage = root.lookupType("douyin.RoomUserSeqMessage")
  const SocialMessage = root.lookupType("douyin.SocialMessage")
  const MatchAgainstScoreMessage = root.lookupType("douyin.MatchAgainstScoreMessage")
  const MemberMessage = root.lookupType("douyin.MemberMessage")
  const GiftMessage = root.lookupType("douyin.GiftMessage")
  const LikeMessage = root.lookupType("douyin.LikeMessage")
  const UpdateFanTicketMessage = root.lookupType("douyin.UpdateFanTicketMessage")

  const buf = data.data
  const pushframe = PushFrame.decode(new Uint8Array(buf)) as unknown as DY.PushFrame

  const { logId, payload } = pushframe

  const payloadBuffer = await tools.doUnzip(Buffer.from(payload))
  const response = Response.decode(Buffer.from(payloadBuffer)) as unknown as DY.Response

  const { messagesList, needAck, internalExt } = response

  if (needAck) {
    const obj = PushFrame.create({ logId, payload: internalExt })
    ws.send(PushFrame.encode(obj).finish())
  }

  for (const msg of messagesList) {
    try {
      const data = Buffer.from(msg.payload, "base64")
      switch (msg.method) {
        case "WebcastChatMessage":
          if (handleChatMessage) {
            handleChatMessage(tools.unPackData<DY.ChatMessage>(data, ChatMessage))
          }
          break
        case "WebcastMatchAgainstScoreMessage":
          if (handleMatchAgainstScoreMessage) {
            handleMatchAgainstScoreMessage(
              tools.unPackData<DY.MatchAgainstScoreMessage>(data, MatchAgainstScoreMessage)
            )
          }
          break
        case "WebcastLikeMessage":
          if (handleLikeMessage) {
            handleLikeMessage(tools.unPackData<DY.LikeMessage>(data, LikeMessage))
          }
          break
        case "WebcastMemberMessage":
          if (handleMemberMessage) {
            handleMemberMessage(tools.unPackData<DY.MemberMessage>(data, MemberMessage))
          }

          break
        case "WebcastGiftMessage":
          if (handleGiftMessage) {
            handleGiftMessage(tools.unPackData<DY.GiftMessage>(data, GiftMessage))
          }
          break
        case "WebcastSocialMessage":
          if (handleSocialMessage) {
            handleSocialMessage(tools.unPackData<DY.SocialMessage>(data, SocialMessage))
          }
          break
        case "WebcastRoomUserSeqMessage":
          if (handleRoomUserSeqMessage) {
            handleRoomUserSeqMessage(tools.unPackData<DY.RoomUserSeqMessage>(data, RoomUserSeqMessage))
          }
          break
        case "WebcastUpdateFanTicketMessage":
          if (handleUpdateFanTicketMessage) {
            handleUpdateFanTicketMessage(tools.unPackData<DY.UpdateFanTicketMessage>(data, UpdateFanTicketMessage))
          }
          break
        case "WebcastCommonTextMessage":
          if (handleCommonTextMessage) {
            handleCommonTextMessage(tools.unPackData<DY.CommonTextMessage>(data, CommonTextMessage))
          }
          break
        default:
          if (handleUnknowMessage) handleUnknowMessage(msg.method, data)
          break
      }
    } catch (error) {
      // console.error(error)
    }
  }
}
