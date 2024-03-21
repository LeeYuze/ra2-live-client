<script lang="ts" setup>
import { computed } from "vue"
import { dictStore } from "@/store/modules/dict"

const props = defineProps({
  modelValue: {
    default: {
      id: "",
      actionType: 0, //组件类型
      gameType: 0,
      parameter: {
        targetPlayer: 0,
        ownerPlayer: 0,
        unitType: 3,
        limitCount: 500,
        count: 1,
        unitLevelType: 2,
        sellBuildType: 0,
        superWeaponType: 0,
        unitCode: ""
      }
    }
  }
})

const emits = defineEmits(["update:modelValue", "delete"])

const data = computed({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    emits("update:modelValue", value)
  }
})

const dict = dictStore()

const deleteOnClick = () => {
  emits("delete", data.value.id)
}
</script>

<template>
  <div class="game-event">
    <el-form :model="data" label-width="120">
      <el-form-item label="选择事件">
        <el-select v-model="data.gameType" placeholder="请选择游戏事件" size="small" style="width: 140px">
          <el-option
            v-for="item in dict.gameType"
            :disabled="item.value === 5"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-tooltip v-if="![4, 5].includes(data.gameType)" effect="dark" content="设置该操作的对象" placement="top">
          <el-select
            class="ml-10px"
            v-model="data.parameter.targetPlayer"
            placeholder="请选择操作对象"
            size="small"
            style="width: 140px"
          >
            <el-option v-for="item in dict.playerType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-tooltip>
        <el-tooltip v-if="![4, 5].includes(data.gameType)" effect="dark" content="设置操作数量" placement="top">
          <el-input-number class="ml-10px" v-model="data.parameter.count" size="small" :min="1" />
        </el-tooltip>
      </el-form-item>
      <el-form-item v-if="data.gameType === 0" label="生成参数">
        <el-tooltip effect="dark" content="设置该单位属于的对象" placement="top">
          <el-select
            v-model="data.parameter.ownerPlayer"
            placeholder="请选择操作对象"
            size="small"
            style="width: 140px"
          >
            <el-option v-for="item in dict.playerType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-tooltip>
        <el-select
          class="ml-10px"
          v-model="data.parameter.unitType"
          placeholder="请选择单位类型"
          size="small"
          style="width: 140px"
        >
          <el-option v-for="item in dict.unitType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input
          class="ml-10px"
          size="small"
          v-model="data.parameter.unitCode"
          style="width: 120px"
          placeholder="单位代码"
        />
        <el-tooltip effect="dark" content="本次生成最大数量" placement="top">
          <el-input-number class="ml-10px" v-model="data.parameter.limitCount" size="small" :min="1" />
        </el-tooltip>
      </el-form-item>
      <el-form-item v-if="data.gameType === 1" label="武器参数">
        <el-select
          v-model="data.parameter.superWeaponType"
          placeholder="请选择超级武器"
          size="small"
          style="width: 140px"
        >
          <el-option v-for="item in dict.superWeaponType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="data.gameType === 2" label="升级参数">
        <el-select
          v-model="data.parameter.unitLevelType"
          placeholder="请选择升级等级"
          size="small"
          style="width: 140px"
        >
          <el-option v-for="item in dict.unitLevelType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="data.gameType === 3" label="出售参数">
        <el-select
          v-model="data.parameter.sellBuildType"
          placeholder="请选择出售类型"
          size="small"
          style="width: 140px"
        >
          <el-option v-for="item in dict.sellBuildType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" size="small" @click="deleteOnClick">删除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped></style>
