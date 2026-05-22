<template>
  <div class="qr-code__container">
    <a-form layout="vertical" style="width: 100%">
      <a-form-item label="二维码内容">
        <a-textarea v-model:value="text" placeholder="请输入文本" :maxlength="100" show-count :rows="4"/>
      </a-form-item>
      <a-form-item label="纠错级别">
        <a-segmented v-model:value="level" :options="segmentedData"/>
      </a-form-item>
    </a-form>
    <a-qrcode :value="text" ref="qrcodeCanvasRef" :error-level="level" :size="192"/>
    <a-button type="primary" @click="downloadChange">下载</a-button>
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue';

const text = ref('');
const qrcodeCanvasRef = ref();

const segmentedData = ['L', 'M', 'Q', 'H'];
const level = ref(segmentedData[0]);

const downloadChange = async () => {
  if (!qrcodeCanvasRef.value) return;
  const url = qrcodeCanvasRef.value.toDataURL();
  if (!url) return;
  const a = document.createElement('a');
  a.download = 'QRCode.png';
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
</script>

<style scoped>
.qr-code__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
</style>
