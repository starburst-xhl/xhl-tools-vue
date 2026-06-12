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
        <label class="section-label">原始文本</label>
        <a-textarea
          v-model:value="inputText"
          placeholder="输入需要编码的普通文本..."
          :rows="4"
          class="text-input"
        />
      </div>

      <div class="button-container">
        <a-button @click="encode" type="primary">
          <template #icon>
            <DownOutlined />
          </template>
          编码
        </a-button>
        <a-button @click="decode" type="primary">
          <template #icon>
            <UpOutlined />
          </template>
          解码
        </a-button>
      </div>

      <div class="output-section">
        <label class="section-label">URL 编码</label>
        <a-textarea
          v-model:value="outputText"
          placeholder="粘贴 %xx 编码文本进行解码..."
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

/* ===== 统一样式规范 ===== */

/* 区段标签 — 标记输入框/输出框等小区域 */
.section-label {
  display: block;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-sm);
}

/* 按钮容器 — 居中排列 */
.button-container {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

/* 代码字体 */
.text-input,
.text-output {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
}

/* ===== 响应式 ===== */
@media (max-width: 767px) {
  .button-container {
    flex-direction: column;
  }
  .button-container .ant-btn {
    width: 100%;
  }
}
</style>
