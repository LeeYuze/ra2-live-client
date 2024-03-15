<template>
  <div class="flex gap-2">
    <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false" @close="handleClose(tag)">
      {{ tag }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
      placeholder="可以是评论内容或礼物名称"
    />
    <el-button v-else class="button-new-tag" size="small" @click="showInput"> + 添加</el-button>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, ref} from "vue"
import {ElInput} from "element-plus"

const emits = defineEmits(["update:modelValue"])

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const dynamicTags = computed({
  get: () => {
    return props.modelValue
  },
  set: (values) => {
    emits("update:modelValue", values)
  }
})

const inputValue = ref("")
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ""
}
</script>
