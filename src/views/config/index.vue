<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { ElMessage } from "element-plus"

const db = window.database

const data = ref<any>({
  wsPort: "",
  roomId: ""
})

const loadDataByDb = async () => {
  try {
    const res = await db.getData("/config")
    data.value = res
  } catch (e) {
    data.value = {
      wsPort: "",
      roomId: ""
    }
  }
}

const saveDataByDb = async () => {
  await db.push(`/config`, data.value)
  ElMessage.success("保存成功")
}

onMounted(() => {
  loadDataByDb()
})
</script>

<template>
  <div class="app-container">
    <el-form :model="data" label-position="top">
      <el-form-item label="Websocket端口号">
        <el-input v-model="data.wsPort" />
      </el-form-item>
      <el-form-item label="抖音号/直播间ID">
        <el-input v-model="data.roomId" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveDataByDb">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  color: #000000;
  font-weight: bold;
}
</style>
