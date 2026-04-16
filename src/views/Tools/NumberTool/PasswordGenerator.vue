<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from "vue";
import {message} from "ant-design-vue";
import {badString} from "@/utils/string_utils.ts";
import {CopyOutlined, RedoOutlined} from "@ant-design/icons-vue";

const clipboard = computed(() => {
  return navigator.clipboard;
});

const form = reactive({
  passwordLength: 12,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
});

const password = ref('');

const generatePassword = () => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+{}:"<>?|[];\',./';
  let characters = '';
  let gen_password = '';
  if (form.includeUppercase) characters += uppercase;
  if (form.includeLowercase) characters += lowercase;
  if (form.includeNumbers) characters += numbers;
  if (form.includeSymbols) characters += symbols;
  if (badString(characters)) {
    message.error('请至少选择一种字符类型');
    return;
  }
  while (true) {
    gen_password = '';
    for (let i = 0; i < form.passwordLength; i++) {
      gen_password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    if (form.includeUppercase && !/[A-Z]/.test(gen_password)) continue;
    if (form.includeLowercase && !/[a-z]/.test(gen_password)) continue;
    if (form.includeNumbers && !/[0-9]/.test(gen_password)) continue;
    if (form.includeSymbols && !/[!@#$%^&*()_+{}:"<>?|\[\];',.\/]/.test(gen_password)) continue;
    break;
  }
  password.value = gen_password;
}

watch(form, () => {
  generatePassword();
});

onMounted(() => {
  generatePassword();
});
</script>

<template>
  <div>
    <a-form :model="form">
      <a-form-item label="密码长度">
        <a-input-number v-model:value="form.passwordLength" :min="1" :max="60"/>
      </a-form-item>
      <a-form-item label="包含大写字母">
        <a-switch v-model:checked="form.includeUppercase"/>
      </a-form-item>
      <a-form-item label="包含小写字母">
        <a-switch v-model:checked="form.includeLowercase"/>
      </a-form-item>
      <a-form-item label="包含数字">
        <a-switch v-model:checked="form.includeNumbers"/>
      </a-form-item>
      <a-form-item label="包含特殊字符">
        <a-switch v-model:checked="form.includeSymbols"/>
      </a-form-item>
      <a-form-item-rest>
        <div class="password-generator__password-container">{{ password }}</div>
      </a-form-item-rest>
      <a-form-item-rest>
        <div class="password-generator__button-container">
          <a-button shape="circle" @click="generatePassword">
            <template #icon>
              <RedoOutlined/>
            </template>
          </a-button>
          <a-button type="primary" shape="round" @click="() => {clipboard.writeText(password)}">
            <template #icon>
              <CopyOutlined/>
            </template>
            复制密码
          </a-button>
        </div>
      </a-form-item-rest>
    </a-form>
  </div>
</template>

<style scoped>
.password-generator__password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-bg-tool-display);
  height: 64px;
  margin-bottom: 24px;
  padding: 0 32px;
  border-radius: 8px;
  color: #ff9b17;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.password-generator__button-container {
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style>
