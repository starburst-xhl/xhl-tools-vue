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
  <div class="base64-tool">
    <div class="tool-header">
      <h2 class="tool-title">Base64 编解码</h2>
      <p class="tool-description">Base64 是一种基于 64 个可打印字符来表示二进制数据的编码方式，常用于在 URL、Cookie、网页中传输和存储数据。本工具支持 Unicode 字符，确保编码和解码的安全性。</p>
    </div>

    <div class="tool-content">
      <div class="input-section">
        <label class="section-label">输入文本</label>
        <a-textarea v-model:value="inputText" placeholder="输入需要编码或解码的文本..." :rows="4" class="text-input"/>
      </div>
      
      <div class="button-container">
        <a-button @click="encode" type="primary" size="large">
          <template #icon>
            <DownOutlined/>
          </template>
          编码
        </a-button>
        <a-button @click="decode" type="primary" size="large">
          <template #icon>
            <UpOutlined/>
          </template>
          解码
        </a-button>
      </div>
      
      <div class="output-section">
        <label class="section-label">输出结果</label>
        <a-textarea v-model:value="outputText" placeholder="编码或解码后的结果将显示在这里..." :rows="4" class="text-output"/>
      </div>
    </div>

    <div class="tool-info">
      <h3 class="info-title">使用说明</h3>
      <ul class="info-list">
        <li>在上方输入框中输入需要编码或解码的文本</li>
        <li>点击「编码」按钮将普通文本转换为 Base64 编码</li>
        <li>点击「解码」按钮将 Base64 编码转换回普通文本</li>
        <li>编码或解码成功后，结果会自动复制到剪贴板</li>
        <li>支持中文、日文、韩文等各种 Unicode 字符</li>
        <li>所有处理都在浏览器本地完成，数据不会上传到服务器</li>
      </ul>
      
      <h3 class="info-title">Base64 应用场景</h3>
      <ul class="info-list">
        <li>在 URL 参数中传递特殊字符</li>
        <li>在 HTML/CSS 中嵌入图片数据</li>
        <li>在 JSON 数据中传输二进制内容</li>
        <li>在邮件系统中传输附件数据</li>
        <li>简化数据格式，避免编码问题</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.base64-tool {
  width: 100%;
  padding: var(--spacing-lg) 0;
}

.tool-header {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.tool-title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-md);
}

.tool-description {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  max-width: 700px;
  margin: 0 auto;
  line-height: var(--line-height-body);
}

.tool-content {
  background: var(--color-bg-component);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  border: 1px solid var(--color-border-light);
}

.input-section,
.output-section {
  margin-bottom: var(--spacing-md);
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
  margin: var(--spacing-lg) 0;
}

.tool-info {
  background: var(--color-bg-component);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  border: 1px solid var(--color-border-light);
}

.info-title {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.info-title:first-of-type {
  margin-top: 0;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  padding: var(--spacing-sm) 0;
  padding-left: var(--spacing-xl);
  position: relative;
  color: var(--color-text-secondary);
  line-height: var(--line-height-body);
}

.info-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 767px) {
  .tool-header {
    text-align: left;
  }
  
  .tool-title {
    font-size: var(--font-size-h3);
  }
  
  .button-container {
    flex-direction: column;
  }
  
  .button-container .ant-btn {
    width: 100%;
  }
}
</style>
