<script setup lang="ts">
import {ref} from "vue";
import {DownOutlined, UpOutlined} from "@ant-design/icons-vue";
import {copyToClipboard} from "@/utils/clipboard_utils";

const inputText = ref<string>('');
const outputText = ref<string>('');

// Unicode 安全的 Base64 编码
const encode = () => {
  try {
    outputText.value = btoa(unescape(encodeURIComponent(inputText.value)));
    copyToClipboard(outputText.value, '编码成功，已将结果复制到剪贴板');
  } catch {
    outputText.value = '';
  }
};

// Unicode 安全的 Base64 解码
const decode = () => {
  try {
    inputText.value = decodeURIComponent(escape(atob(outputText.value)));
    copyToClipboard(inputText.value, '解码成功，已将结果复制到剪贴板');
  } catch {
    inputText.value = '';
  }
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