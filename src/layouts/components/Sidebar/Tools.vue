<script lang="ts" setup>
const { ipcRenderer } = require("electron")

const connectOnClick = async () => {
  ipcRenderer.send("connect_live_room")
}
</script>

<template>
  <div>
    <el-button type="primary" link @click="connectOnClick">连接到直播间</el-button>
  </div>
</template>

<style lang="scss" scoped></style>
