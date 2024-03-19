<script lang="ts" setup>
import { ref } from "vue"

const { ipcRenderer } = require("electron")

// 0未连接 1连接成功 2连接失败
const state = ref<Number>(0)
const loading = ref<Boolean>(false)
const text = ref<String>("连接到直播间")

const connectOnClick = async () => {
  loading.value = true
  if (state.value === 1) {
    // 断开
    ipcRenderer.send("disConnect_live_room")
    state.value = 0
    loading.value = false
    text.value = "连接到直播间"
  } else {
    ipcRenderer.send("connect_live_room")
  }
}

ipcRenderer.on("connect_live_success", () => {
  loading.value = false
  state.value = 1
  text.value = "断开连接直播间"
})

ipcRenderer.on("connect_live_fail", () => {
  loading.value = false
  state.value = 2
  text.value = "重新连接直播间"
})
</script>

<template>
  <div class="live-run-bar">
    <span v-if="state === 1" class="text text-success mb-5px">连接成功</span>
    <span v-if="state === 2" class="text text-danger mb-5px">连接失败</span>
    <el-button type="primary" :loading="loading" link @click="connectOnClick">{{ text }}</el-button>
  </div>
</template>

<style lang="scss" scoped>
.live-run-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text {
  font-size: 12px;
}

.text-success {
  color: #67c23a;
}

.text-danger {
  color: #f56c6c;
}
</style>
