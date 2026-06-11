<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";
import { CopyOutlined, UploadOutlined } from "@ant-design/icons-vue";
import jsQR from "jsqr";

const decodedResult = ref<string>("");
const isDecoding = ref<boolean>(false);
const previewUrl = ref<string>("");
const hasResult = ref<boolean>(false);
const fileName = ref<string>("");

// 文件输入元素引用
const fileInput = ref<HTMLInputElement>();

// 触发文件选择
const triggerUpload = () => {
  fileInput.value?.click();
};

// 处理文件选择 — 读取后自动解析
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    message.warning("请上传图片文件");
    return;
  }

  fileName.value = file.name;
  decodedResult.value = "";
  hasResult.value = false;

  // 用 FileReader 读取图片
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result as string;
    previewUrl.value = dataUrl;
    // 自动解析
    decodeQRCode(dataUrl);
  };
  reader.onerror = () => {
    message.error("图片读取失败");
  };
  reader.readAsDataURL(file);

  // 清空 input 以便重复选择同一文件
  input.value = "";
};

// 移除文件
const removeFile = () => {
  previewUrl.value = "";
  decodedResult.value = "";
  hasResult.value = false;
  fileName.value = "";
};

// 解码二维码（传入 dataUrl，避免重新创建 ObjectURL）
const decodeQRCode = async (dataUrl: string) => {
  isDecoding.value = true;
  try {
    const imageData = await readImageFromDataUrl(dataUrl);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
      decodedResult.value = code.data;
      hasResult.value = true;
    } else {
      decodedResult.value = "未识别到二维码，请确认图片中包含清晰的二维码";
      hasResult.value = true;
    }
  } catch {
    decodedResult.value = "图片解析失败，请确认图片格式正确";
    hasResult.value = true;
  } finally {
    isDecoding.value = false;
  }
};

// 从 dataUrl 读取图片像素数据
const readImageFromDataUrl = (dataUrl: string): Promise<{ data: Uint8ClampedArray; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("无法创建画布"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve({
        data: imageData.data,
        width: canvas.width,
        height: canvas.height,
      });
    };
    img.onerror = () => reject(new Error("图片加载失败"));
    img.src = dataUrl;
  });
};

// 复制结果
const copyResult = async () => {
  if (!decodedResult.value || decodedResult.value.startsWith("未识别")) return;
  try {
    await navigator.clipboard.writeText(decodedResult.value);
    message.success("已复制到剪贴板");
  } catch {
    message.error("复制失败");
  }
};
</script>

<template>
  <div class="qr-parser">
    <!-- 上传区域 -->
    <div>
      <div class="qr-parser__upload-area">
        <div v-if="!previewUrl" class="qr-parser__dropzone" @click="triggerUpload">
          <UploadOutlined class="qr-parser__dropzone-icon" />
          <p class="qr-parser__dropzone-text">点击上传二维码图片</p>
          <p class="qr-parser__dropzone-hint">支持 PNG / JPG / WEBP 等图片格式</p>
        </div>

        <div v-else class="qr-parser__preview">
          <img :src="previewUrl" alt="二维码预览" class="qr-parser__preview-img" />
          <div class="qr-parser__preview-info">
            <span class="qr-parser__filename">{{ fileName }}</span>
            <a-button size="small" type="link" @click="removeFile">移除</a-button>
          </div>
        </div>
      </div>

      <!-- 解析状态 -->
      <div v-if="isDecoding" class="qr-parser__status">
        <a-spin />
        <span>正在解析二维码...</span>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="qr-parser__file-input"
        @change="handleFileChange"
      />
    </div>

    <!-- 结果展示 -->
    <div v-if="hasResult && !isDecoding" class="result-card">
      <div class="card-section__header">
        <span class="card-section__title">解析结果</span>
        <a-button
          v-if="!decodedResult.startsWith('未识别')"
          type="link"
          size="small"
          @click="copyResult"
        >
          <template #icon>
            <CopyOutlined />
          </template>
          复制
        </a-button>
      </div>
      <p v-if="decodedResult.startsWith('未识别')" class="qr-parser__result-text qr-parser__result-text--warn">
        {{ decodedResult }}
      </p>
      <p v-else class="qr-parser__result-text">{{ decodedResult }}</p>
    </div>
  </div>
</template>

<style scoped>
.qr-parser {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* 区块标题 */
.card-section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

/* 结果卡片 */
.result-card {
  background: var(--color-bg-component);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  border: 1px solid var(--color-border-light);
}

/* 文件输入隐藏 */
.qr-parser__file-input {
  display: none;
}

/* 上传占位 */
.qr-parser__dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xxl) var(--spacing-lg);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  background: var(--color-bg);
  transition: all var(--transition-fast);
}

.qr-parser__dropzone:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
}

.qr-parser__dropzone-icon {
  font-size: 48px;
  color: var(--color-primary);
  opacity: 0.6;
}

.qr-parser__dropzone-text {
  margin: 0;
  font-size: var(--font-size-h5);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.qr-parser__dropzone-hint {
  margin: 0;
  font-size: var(--font-size-body-sm);
  color: var(--color-text-tertiary);
}

/* 预览区 */
.qr-parser__preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  padding: var(--spacing-lg);
}

.qr-parser__preview-img {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.qr-parser__preview-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  justify-content: center;
  width: 100%;
}

.qr-parser__filename {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 解析状态 */
.qr-parser__status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  padding: var(--spacing-md) 0;
}

/* 结果文字 */
.qr-parser__result-text {
  margin: 0;
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  line-height: var(--line-height-body);
  word-break: break-all;
  white-space: pre-wrap;
}

.qr-parser__result-text--warn {
  color: var(--color-text-tertiary);
}
</style>
