<script setup lang="ts">
import {ref} from "vue";
import {DownOutlined, UpOutlined} from "@ant-design/icons-vue";
import {notification} from "ant-design-vue";

const inputText = ref<string>('');
const outputText = ref<string>('');
const encode = () => {
  outputText.value = btoa(inputText.value);
  // 复制到剪贴板
  navigator.clipboard.writeText(outputText.value);
  notification.success({
    message: '编码成功',
    description: '已将编码后的文本复制到剪贴板',
  });
};
const decode = () => {
  inputText.value = atob(outputText.value);
  // 复制到剪贴板
  navigator.clipboard.writeText(outputText.value);
  notification.success({
    message: '解码成功',
    description: '已将解码后的文本复制到剪贴板',
  });
};
</script>

<template>
  <div>
    <a-textarea v-model:value="inputText" placeholder="未编码文本" :rows="4"/>
    <div class="base64-tool__button-container">
      <a-button @click="encode" type="primary">
        <template #icon>
          <DownOutlined/>
        </template>
        编码
      </a-button>
      <a-button @click="decode" type="primary">
        <template #icon>
          <UpOutlined/>
        </template>
        解码
      </a-button>
    </div>
    <a-textarea v-model:value="outputText" placeholder="编码后文本" :rows="4"/>
  </div>
</template>

<style scoped>
.base64-tool__button-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 16px 0;
}
</style>
