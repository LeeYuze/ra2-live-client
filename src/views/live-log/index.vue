<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue"

const db = window.database
const allMessage = ref([])
let ws
const connect = async () => {
  const res = await db.getData("/config")

  const url = "ws://localhost:" + res.wsPort

  ws = new WebSocket(url)

  ws.onopen = function () {
    console.log("WebSocket Connected")
    // 启动心跳包定时器，每秒发送一次心跳包
    startHeartbeat()
  }

  ws.onclose = function () {
    console.log("WebSocket Closed")
    // 停止心跳包定时器
    clearInterval(heartbeatInterval)
    // 断线后重新连接
    setTimeout(function () {
      connect()
    }, 1000) // 重连间隔，单位：毫秒
  }

  ws.onerror = function (error) {
    console.error("WebSocket Error:", error)
    // 出错后也尝试重新连接
    ws.close()
  }

  ws.onmessage = function (message) {
    const res = message.data
    const data = JSON.parse(res)
    allMessage.value.push(data.message)
    // 如果浏览器滚动到底部，则滚动到底部
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth" // 平滑滚动
      })
    }
  }
}

// 心跳包定时器
let heartbeatInterval

// 启动心跳包定时器函数
function startHeartbeat() {
  heartbeatInterval = setInterval(function () {
    // 每秒向服务器发送一次心跳包
    sendHeartbeat()
  }, 1000) // 每秒发送一次心跳包
}

// 向服务器发送心跳包函数
function sendHeartbeat() {
  // 如果 WebSocket 连接已建立，则发送心跳包
  if (ws.readyState === WebSocket.OPEN) {
    ws.send("heartbeat")
  }
}

onMounted(() => {
  connect()
})

onBeforeUnmount(() => {
  ws.close()
  clearInterval(heartbeatInterval)
})
</script>

<template>
  <div class="app-container">
    <div v-for="(item, index) in allMessage" :key="index">
      <div class="text text-webcastMemberMessage" v-if="item.common.method === 'WebcastMemberMessage123'">
        {{ item.user.nickName }}进入直播间
      </div>
      <div class="text text-webcastMemberMessage" v-if="item.common.method === 'WebcastGiftMessage'">
        {{ item.user.nickName }}送{{ item.gift.name }} x {{ item.repeatCount }}
      </div>
      <div class="text text-webcastChatMessage" v-if="item.common.method === 'WebcastChatMessage'">
        {{ item.user.nickName }}：{{ item.content }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text {
  font-size: 12px;
  margin-bottom: 5px;
}
</style>
