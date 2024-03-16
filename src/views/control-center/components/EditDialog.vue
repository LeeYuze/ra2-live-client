<script lang="ts" setup>
import { VueDraggable } from "vue-draggable-plus"
import { computed, onMounted, ref } from "vue"
import DynamicTags from "@/views/control-center/components/DynamicTags.vue"
import GameEvent from "@/views/control-center/components/GameEvent.vue"
import { nanoid } from "nanoid"
import { ElMessage } from "element-plus"

const db = window.database

const props = defineProps({
  visible: {
    type: Boolean
  },
  id: {
    type: String,
    default: ""
  }
})
const emits = defineEmits(["update:visible", "confirm"])

const visible = computed({
  get: () => props.visible,
  set: (val) => {
    emits("update:visible", val)
  }
})

const isEdit = computed({
  get: () => props.id !== "",
  set: () => {}
})

const data = ref<any>({
  id: "",
  name: "",
  priority: 1,
  trigger: [],
  isGift: false,
  isLike: false,
  likeNumber: 1,
  actions: [] as any[]
})

const originData = ref({})

onMounted(() => {
  if (props.id) {
    getData()
  }
})

const getData = async () => {
  const res = await db.find("/controls", (item) => item.id === props.id)
  data.value = { ...res }
  originData.value = { ...res }
}

const resetOnClick = () => {
  data.value = { ...originData.value }
}

const gameEventOnClick = () => {
  const gameEventObject = {
    id: "",
    actionType: 0, //组件类型
    gameType: 0,
    parameter: {
      targetPlayer: 0,
      ownerPlayer: 0,
      unitType: 3,
      count: 1,
      unitLevelType: 2,
      sellBuildType: 0,
      superWeaponType: 0,
      unitCode: ""
    }
  }
  gameEventObject.id = nanoid()
  data.value.actions.push(gameEventObject)
}

const gameEventDeleteOnClick = (id) => {
  data.value.actions = data.value.actions.filter((item) => item.id !== id)
}

const dialogConfirmOnClick = async () => {
  data.value.id = nanoid()

  if (!data.value.name) {
    ElMessage.error("名称不能为空")
    return
  }

  if (data.value.trigger.length === 0) {
    ElMessage.error("触发内容不能为空")
    return
  }

  if (data.value.actions.length === 0) {
    ElMessage.error("请至少设置一种操作")
    return
  }

  if (!isEdit.value) {
    await db.push("/controls[]", data.value)
    ElMessage({
      type: "success",
      message: "新增成功"
    })
  } else {
    const index = await db.getIndex("/controls", data.value.id, "id")
    await db.push(`/controls[${index}]`, data.value)
    ElMessage({
      type: "success",
      message: "修改成功"
    })
  }

  visible.value = false
  emits("confirm")
}
</script>

<template>
  <el-dialog v-model="visible" :title="isEdit ? '编辑' : '新增'" width="800">
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

    <VueDraggable class="actions" :animation="150" ghostClass="ghost" ref="el" v-model="data.actions">
      <div v-for="(item, index) in data.actions" :key="item.id">
        <game-event v-if="item.actionType === 0" v-model="data.actions[index]" @delete="gameEventDeleteOnClick" />
      </div>
    </VueDraggable>

    <template #footer>
      <div class="dialog-footer">
        <div>
          <el-button size="small" type="success" @click="gameEventOnClick">游戏事件</el-button>
        </div>
        <div>
          <el-button @click="resetOnClick">重置</el-button>
          <el-button type="primary" @click="dialogConfirmOnClick"> 确定</el-button>
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

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
