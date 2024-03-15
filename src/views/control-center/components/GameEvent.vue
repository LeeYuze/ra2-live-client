<script lang="ts" setup>
import { ref } from "vue"

const data = ref({
  actionType: 0,
  gameType: 0
})
</script>

<template>
  <div class="game-event">
    <el-form :model="data" label-width="120">
      <el-form-item label="选择事件">

      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
</style>
