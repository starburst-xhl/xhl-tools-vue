<script setup lang="ts">
import {ref} from "vue";
import {DownOutlined, UpOutlined} from "@ant-design/icons-vue";
import {copyToClipboard} from "@/utils/clipboard_utils";
import ToolTips from "@/components/ToolTips.vue";

const inputText = ref<string>('');
const outputText = ref<string>('');

// URL 编码
const encode = () => {
  try {
    outputText.value = encodeURIComponent(inputText.value);
    copyToClipboard(outputText.value, '编码成功，已将结果复制到剪贴板');
  } catch {
    outputText.value = '';
  }
};

// URL 解码
const decode = () => {
  try {
    inputText.value = decodeURIComponent(outputText.value);
    copyToClipboard(inputText.value, '解码成功，已将结果复制到剪贴板');
  } catch {
    inputText.value = '';
  }
};
</script>

<template>
  <div class="url-code-tool">
    <div class="tool-content">
      <div class="input-section">
        <label class="section-label">输入文本</label>
        <a-textarea
          v-model:value="inputText"
          placeholder="输入需要编码或解码的文本..."
          :rows="4"
          class="text-input"
        />
      </div>

      <div class="button-container">
        <a-button @click="encode" type="primary" size="large">
          <template #icon>
            <DownOutlined />
          </template>
          编码
        </a-button>
        <a-button @click="decode" type="primary" size="large">
          <template #icon>
            <UpOutlined />
          </template>
          解码
        </a-button>
      </div>

      <div class="output-section">
        <label class="section-label">输出结果</label>
        <a-textarea
          v-model:value="outputText"
          placeholder="编码或解码后的结果将显示在这里..."
          :rows="4"
          class="text-output"
        />
      </div>

      <ToolTips :tips="[
        '将特殊字符转换为 %xx 格式，确保 URL 安全传输',
        '支持中文、日文、韩文等各种 Unicode 字符',
        '编码或解码成功后结果自动复制到剪贴板',
        '所有处理在浏览器本地完成，数据不会上传到服务器',
      ]" />
    </div>
  </div>
</template>

<style scoped>
.url-code-tool {
  width: 100%;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.input-section,
.output-section {
  margin-bottom: var(--spacing-sm);
}

.section-label {
  display: block;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-sm);
}

.text-input,
.text-output {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

/* 响应式设计 */
@media (max-width: 767px) {
  .button-container {
    flex-direction: column;
  }

  .button-container .ant-btn {
    width: 100%;
  }
}
</style>
