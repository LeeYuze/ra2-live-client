<script lang="ts" setup>
import EditDialog from "@/views/control-center/components/EditDialog.vue";
import {ref} from "vue";

const tableData: any = [
]

const isVisible = ref<Boolean>(false)
</script>

<template>
  <div class="app-container">
    <el-button type="primary" icon="plus" @click="isVisible = true">添加新的</el-button>
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
        <template #default>
          <el-button type="primary" link>修改</el-button>
          <el-button type="danger" link>删除</el-button>
          <el-button type="info" link>调试</el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit-dialog v-model:visible="isVisible" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-table th.el-table__cell) {
  background-color: #ffffff !important;
}
</style>
