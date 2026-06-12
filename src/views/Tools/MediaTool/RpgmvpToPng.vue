<script setup lang="ts">
import type {UploadFile, UploadProps} from "ant-design-vue";
import {ref} from "vue";
import {UploadOutlined} from "@ant-design/icons-vue";
import ToolTips from "@/components/ToolTips.vue";
import {decryptRPGMVPFile, downloadBlob, createZipFromFiles} from "@/utils/media_utils";

const fileList = ref<UploadFile[]>([]);
const pack = ref(false);
const isLoading = ref(false);

const beforeUpload: UploadProps['beforeUpload'] = file => {
  fileList.value = [...(fileList.value || []), file];
  return false;
};

// 处理文件选择事件的函数
async function handleFileTransform() {
  const files = fileList.value
    .map((f) => f.originFileObj)
    .filter((f): f is Exclude<UploadFile['originFileObj'], undefined> =>
      f !== undefined && f.name.endsWith(".rpgmvp"),
    );

  if (files.length === 0) return;

  isLoading.value = true;
  try {
    if (pack.value) {
      // 将所有图片打包在一起下载
      const decryptResults = await Promise.all(
        files.map(async (f) => ({
          name: f.name.replace(".rpgmvp", ".png"),
          data: await decryptRPGMVPFile(f as File),
        })),
      )
      const zipBlob = await createZipFromFiles(decryptResults)
      downloadBlob(zipBlob, "converted_files.zip")
    } else {
      // 单独下载每个图片
      for (const f of files) {
        const pngData = await decryptRPGMVPFile(f as File)
        const blob = new Blob([pngData], {type: "image/png"})
        downloadBlob(blob, f.name.replace(".rpgmvp", ".png"))
      }
    }
    fileList.value = [];
  } catch {
    // 转换过程中如有错误，静默处理
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="rpgmvp-to-png">
    <div class="tool-content">
      <div>
        <label class="section-label">上传 .rpgmvp 文件</label>
        <div class="rpgmvp-to-png__upload">
          <a-upload
            v-model:file-list="fileList"
            :before-upload="beforeUpload"
            accept=".rpgmvp"
            multiple
          >
            <a-button>
              <UploadOutlined/>
              选择文件
            </a-button>
          </a-upload>
        </div>
      </div>

      <div class="rpgmvp-to-png__options">
        <a-checkbox v-model:checked="pack">打包为 ZIP 下载</a-checkbox>
      </div>

      <div class="button-container">
        <a-button type="primary" :loading="isLoading" @click="handleFileTransform">
          转换并下载
        </a-button>
      </div>

      <ToolTips :tips="[
        '支持 RPG Maker MV 加密的 .rpgmvp 格式图片',
        '可选择单张下载或打包为 ZIP 批量下载',
        '所有转换在浏览器本地完成，数据不上传服务器',
      ]" />
    </div>
  </div>
</template>

<style scoped>
.rpgmvp-to-png {
  width: 100%;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* ===== 统一样式规范 ===== */

/* 区段标签 — 标记输入/输出区域 */
.section-label {
  display: block;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-sm);
}

/* 按钮容器 */
.button-container {
  display: flex;
  justify-content: flex-start;
  gap: var(--spacing-md);
}

/* ===== 工具特有样式 ===== */

/* 上传区域 — 虚线边框 */
.rpgmvp-to-png__upload {
  border: 1px dashed var(--color-border);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}

/* 选项区 */
.rpgmvp-to-png__options {
  padding: var(--spacing-sm) 0;
}
</style>
