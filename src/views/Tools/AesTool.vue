<template>
  <div class="aes-tool__container">
    <a-textarea placeholder="未加密内容" v-model:value="decryptedContent" :rows="4"/>
    <a-input type="text" placeholder="密钥" v-model:value="key"/>
    <a-textarea placeholder="加密内容" v-model:value="encryptedContent" :rows="4"/>
    <a-radio-group v-model:value="keyLength">
      <a-radio-button value="128">Aes128</a-radio-button>
      <a-radio-button value="192">Aes192</a-radio-button>
      <a-radio-button value="256">Aes256</a-radio-button>
    </a-radio-group>
    <div class="aes-tool__button-container">
      <a-button @click="encrypt" type="primary">
        <template #icon>
          <DownOutlined/>
        </template>
        加密
      </a-button>
      <a-button @click="decrypt" type="primary">
        <template #icon>
          <UpOutlined/>
        </template>
        解密
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {AES, mode, pad, enc} from 'crypto-js';
import {UpOutlined, DownOutlined} from '@ant-design/icons-vue';

const encryptedContent = ref('');
const decryptedContent = ref('');
const key = ref('');
const keyLength = ref('128');

const encrypt = () => {
  encryptedContent.value = AES.encrypt(decryptedContent.value, enc.Utf8.parse(key.value), {
    mode: mode.ECB,
    padding: pad.Pkcs7,
  }).toString();
};

const decrypt = () => {
  decryptedContent.value = AES.decrypt(encryptedContent.value, enc.Utf8.parse(key.value), {
    mode: mode.ECB,
    padding: pad.Pkcs7,
  }).toString(enc.Utf8);
};
</script>

<style scoped>
.aes-tool__container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.aes-tool__button-container {
  display: flex;
  gap: 16px;
}
</style>
