<script setup lang="ts">
import JSZip from "jszip";
import type {UploadFile, UploadProps} from "ant-design-vue";
import {ref} from "vue";
import {UploadOutlined} from "@ant-design/icons-vue";

const fileList = ref<UploadFile[]>([]);
const pack = ref(false);
const beforeUpload: UploadProps['beforeUpload'] = file => {
  fileList.value = [...(fileList.value || []), file];
  return false;
};

// 转换 RPG Maker MV 文件的函数
function decryptRPGMVPFile(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      // 检查 e.target 和 e.target.result 是否存在且不是 null/undefined
      if (e.target && e.target.result) {
        try {
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const pngHeader = new Uint8Array([
            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00,
            0x0d, 0x49, 0x48, 0x44, 0x52,
          ]);
          const pngData = new Uint8Array(pngHeader.length + data.length - 32);

          // 确保 data.length 至少为 32，以避免数组越界
          if (data.length < 32) {
            throw new Error('数据长度不足');
          }

          pngData.set(pngHeader);
          pngData.set(data.slice(32), pngHeader.length);
          resolve(pngData);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('无法读取文件内容'));
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

// 处理文件选择事件的函数
async function handleFileTransform() {
  const files = fileList.value.map((file) => file.originFileObj).filter((file) => file !== undefined) as File[];
  const packFiles = pack.value;

  if (packFiles) {
    // 将所有图片打包在一起下载
    const zipWriter = new JSZip();
    const decryptPromises = [];

    for (const file of files) {
      if (file.name.endsWith(".rpgmvp")) {
        decryptPromises.push(
          decryptRPGMVPFile(file).then((pngData) => {
            zipWriter.file(file.name.replace(".rpgmvp", ".png"), pngData);
          })
        );
      }
    }

    await Promise.all(decryptPromises);

    const content = await zipWriter.generateAsync({type: "blob"});
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = "converted_files.zip";
    link.click();
    URL.revokeObjectURL(url);
  } else {
    // 单独下载每个图片
    for (const file of files) {
      if (file.name.endsWith(".rpgmvp")) {
        const pngData = await decryptRPGMVPFile(file);
        const blob = new Blob([pngData], {type: "image/png"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name.replace(".rpgmvp", ".png");
        link.click();
        URL.revokeObjectURL(url);
      }
    }
  }
  fileList.value = [];
}
</script>

<template>
  <div class="rpgmvp-to-png__container">
    <div class="rpgmvp-to-png__upload">
      <a-upload
        v-model:file-list="fileList"
        :before-upload="beforeUpload"
        accept=".rpgmvp"
        multiple
      >
        <a-button>
          <UploadOutlined/>
          点击上传.rpgmvp文件
        </a-button>
      </a-upload>
    </div>
    <a-checkbox v-model:checked="pack">打包下载</a-checkbox>
    <a-button type="primary" @click="handleFileTransform">转换并下载</a-button>
    <!--    <div class="github-link">-->
    <!--      <p>请访问项目的 GitHub 仓库以获取更多信息和源代码:</p>-->
    <!--      <a href="https://github.com/DrRyanHuang/rpgmvp2png" target="_blank"-->
    <!--      >https://github.com/DrRyanHuang/rpgmvp2png</a-->
    <!--      >-->
    <!--    </div>-->
    <!--    <div class="footer">&copy; 2024 RPG Maker MV 文件转换工具</div>-->
  </div>
</template>

<style scoped>
.rpgmvp-to-png__container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: start;
  width: 400px;
}

.rpgmvp-to-png__upload {
  border: 1px dashed #d9d9d9;
  padding: 16px;
}
</style>
