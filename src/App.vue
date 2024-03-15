<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"
import { APP_TITLE } from "@/hooks/useTitle"
import { onMounted } from "vue"
import { ElNotification } from "element-plus"
// 将 Element Plus 的语言设置为中文
import zhCn from "element-plus/es/locale/lang/zh-cn"
const { ipcRenderer } = require("electron")

window.__electronLog && window.__electronLog.log(`Hello, ${APP_TITLE}! \n`)

const { initTheme } = useTheme()

/** 初始化主题 */
initTheme()

onMounted(() => {
  const winState: WinStateDTO = {
    width: 1080,
    height: 850,
    center: true,
    maxable: true,
    resizable: true
  }
  ipcRenderer.send("set_win_size", winState)
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>
