<script lang="ts" setup>
import EditDialog from "@/views/control-center/components/EditDialog.vue"
import { onMounted, ref } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"

const db = window.database

onMounted(() => {
  getTableData()
})

const tableData: any = ref([])

const editId = ref<String>("")

const isVisible = ref<Boolean>(false)

const getTableData = async () => {
  try {
    tableData.value = []
    const res = await db.getData("/controls")
    tableData.value = [...res]
  } catch (e) {
    tableData.value = []
  }
}

const addOnClick = () => {
  editId.value = ""
  isVisible.value = true
}

const editOnClick = (id) => {
  editId.value = id
  isVisible.value = true
}

const debugOnClick = (row) => {
  const { ipcRenderer } = require("electron")

  const { trigger, isGift } = row
  if (isGift) {
    const msg = {
      common: {
        method: "WebcastGiftMessage"
      },
      gift: {
        name: trigger[0]
      },
      repeatCount: 1,
      user: {
        nickName: "测试人员"
      }
    }
    ipcRenderer.send("send_debug_message", msg)
  } else if (!isGift) {
    const msg = {
      common: {
        method: "WebcastChatMessage"
      },
      content: trigger[0],
      repeatCount: 1,
      user: {
        nickName: "测试人员"
      }
    }
    ipcRenderer.send("send_debug_message", msg)
  }
}

const deleteOnClick = (id) => {
  ElMessageBox.confirm("您确定删除此条数据吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      const index = await db.getIndex("/controls", id, "id")
      db.delete(`/controls[${index}]`)
      getTableData()
      ElMessage({
        type: "success",
        message: "删除成功"
      })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除"
      })
    })
}
</script>

<template>
  <div class="app-container">
    <el-button type="primary" icon="plus" @click="addOnClick">添加新的</el-button>
    <el-button type="primary" icon="RefreshLeft" @click="getTableData">刷新</el-button>

    <el-table class="top-10px" :data="tableData">
      <el-table-column width="100" label="序号">
        <template #default="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" width="150" />
      <el-table-column label="优先级" prop="priority" width="100" />
      <el-table-column label="触发内容" prop="trigger" width="120" />
      <el-table-column label="礼物触发" prop="isGift" align="center" width="100">
        <template #default="scope">
          <span :class="{ 'text-primary': scope.row.isGift, 'text-danger': !scope.row.isGift }">{{
            scope.row.isGift === true ? "是" : "否"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" link @click="editOnClick(scope.row.id)">修改</el-button>
          <el-button type="danger" link @click="deleteOnClick(scope.row.id)">删除</el-button>
          <el-button type="info" link @click="debugOnClick(scope.row)">调试</el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit-dialog v-if="isVisible" v-model:visible="isVisible" :id="editId" @confirm="getTableData" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-table th.el-table__cell) {
  background-color: #ffffff !important;
}
</style>
