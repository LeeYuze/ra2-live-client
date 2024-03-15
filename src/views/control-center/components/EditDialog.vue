<script lang="ts" setup>
import {computed, ref} from "vue"
import DynamicTags from "@/views/control-center/components/DynamicTags.vue";
import GameEvent from "@/views/control-center/components/GameEvent.vue";

const props = defineProps({
  visible: {
    type: Boolean
  }
})
const emits = defineEmits(["update:visible"])

const visible = computed({
  get: () => props.visible,
  set: (val) => {
    emits("update:visible", val)
  }
})

const data = ref({
  name: "飞行兵*2",
  priority: 1,
  trigger: ["小心心"],
  isGift: true,
  isLike: true,
  likeNumber: 1
})
</script>

<template>
  <el-dialog v-model="visible" title="编辑" width="800">
    <el-form :model="data" label-width="120">
      <el-form-item label="优先级">
        <el-input-number v-model="data.priority" size="small" :min="1" />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="data.name" size="small" placeholder="起个名字" />
      </el-form-item>
      <el-form-item label="触发内容">
        <dynamic-tags v-model="data.trigger" />
      </el-form-item>
      <div class="flex">
        <el-form-item label="礼物触发">
          <el-switch v-model="data.isGift" size="small" />
        </el-form-item>
        <el-form-item label="点赞触发">
          <el-switch v-model="data.isLike" size="small" />
        </el-form-item>
      </div>
      <el-form-item label="指定点赞数量" v-if="data.isLike">
        <el-input-number v-model="data.likeNumber" size="small" :min="1" />
      </el-form-item>
    </el-form>

    <div class="actions">
      <game-event></game-event>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <div>
          <el-button size="small" type="success">游戏事件</el-button>
        </div>
        <div>
          <el-button @click="visible = false">重置</el-button>
          <el-button type="primary" @click="visible = false"> 确定 </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:deep(.el-form-item__label) {
  font-size: 12px !important;
}
</style>
