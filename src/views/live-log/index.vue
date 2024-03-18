<script lang="ts" setup>
import { ref } from "vue"

const { ipcRenderer } = require("electron")

const allLiveMessage = ref<any>([])
ipcRenderer.on("sendAllLiveMessage", (_, data) => {
  allLiveMessage.value = data
})

setInterval(() => {
  ipcRenderer.send("getAllLiveMessage")
  console.log(allLiveMessage.value)
}, 1000)
</script>

<template>
  <div />
</template>

<style lang="scss" scoped></style>
