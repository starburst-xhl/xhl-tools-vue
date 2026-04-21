<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from "vue";
import {message} from "ant-design-vue";
import {badString} from "@/utils/string_utils.ts";
import {CopyOutlined, RedoOutlined} from "@ant-design/icons-vue";

const clipboard = computed(() => {
  return navigator.clipboard;
});

// 预设的特殊字符集(完整集合)
const PRESET_SYMBOLS = '!@#$%^&*()_+{}:"<>?|[];\',./';

const form = reactive({
  passwordLength: 12,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
});

// 用户选择的特殊字符集(初始包含所有预设字符)
const selectedSymbols = ref<string[]>(PRESET_SYMBOLS.split(''));

const password = ref('');

// 切换特殊字符选择
const toggleSymbol = (symbol: string) => {
  const index = selectedSymbols.value.indexOf(symbol);
  if (index > -1) {
    selectedSymbols.value.splice(index, 1);
  } else {
    // 不允许添加非预设字符
    if (PRESET_SYMBOLS.includes(symbol)) {
      selectedSymbols.value.push(symbol);
    }
  }
};

// 全选特殊字符
const selectAllSymbols = () => {
  selectedSymbols.value = PRESET_SYMBOLS.split('');
};

// 清空特殊字符选择
const clearAllSymbols = () => {
  selectedSymbols.value = [];
};

const copyPassword = async () => {
  try {
    await clipboard.value.writeText(password.value);
    message.success('密码已复制到剪贴板');
  } catch (error) {
    message.error('复制失败');
  }
};

const generatePassword = () => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = selectedSymbols.value.join('');
  let characters = '';
  let gen_password = '';
  if (form.includeUppercase) characters += uppercase;
  if (form.includeLowercase) characters += lowercase;
  if (form.includeNumbers) characters += numbers;
  if (form.includeSymbols && symbols) characters += symbols;
  if (badString(characters)) {
    message.error('请至少选择一种字符类型');
    return;
  }
  if (form.includeSymbols && !symbols) {
    message.error('请至少选择一个特殊字符');
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
    if (form.includeSymbols && symbols) {
      // 使用动态构建的正则表达式来匹配选中的特殊字符
      const escapedSymbols = symbols.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const symbolRegex = new RegExp(`[${escapedSymbols}]`);
      if (!symbolRegex.test(gen_password)) continue;
    }
    break;
  }
  password.value = gen_password;
}

watch(form, () => {
  generatePassword();
});

watch(selectedSymbols, () => {
  if (form.includeSymbols) {
    generatePassword();
  }
}, { deep: true });

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
      <a-form-item v-if="form.includeSymbols" label="特殊字符集">
        <div class="symbol-selector">
          <div class="symbol-selector__header">
            <span class="symbol-selector__hint">点击字符以选择/取消</span>
            <div class="symbol-selector__actions">
              <a-button size="small" @click="selectAllSymbols">全选</a-button>
              <a-button size="small" @click="clearAllSymbols">清空</a-button>
            </div>
          </div>
          <div class="symbol-selector__chars">
            <a-tag
              v-for="symbol in PRESET_SYMBOLS.split('')"
              :key="symbol"
              :class="['symbol-tag', selectedSymbols.includes(symbol) ? 'symbol-tag--selected' : 'symbol-tag--unselected']"
              @click="toggleSymbol(symbol)"
            >
              {{ symbol }}
            </a-tag>
          </div>
          <div class="symbol-selector__count">
            已选择 {{ selectedSymbols.length }} / {{ PRESET_SYMBOLS.length }} 个字符
          </div>
        </div>
      </a-form-item>
      <a-form-item-rest>
        <div class="password-generator__password-container">{{ password }}</div>
      </a-form-item-rest>
      <a-form-item-rest>
        <div class="password-generator__button-container">
          <a-button @click="generatePassword">
            <template #icon>
              <RedoOutlined/>
            </template>
            重新生成
          </a-button>
          <a-button type="primary" @click="copyPassword">
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

.symbol-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 600px;
}

.symbol-selector__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.symbol-selector__hint {
  font-size: 12px;
  color: #999;
}

.symbol-selector__actions {
  display: flex;
  gap: 8px;
}

.symbol-selector__chars {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background-color: var(--color-bg-tool-display);
  border-radius: 8px;
}

.symbol-tag {
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  font-weight: 500;
  min-width: 28px;
  text-align: center;
  margin: 0;
  transition: none;
}

.symbol-tag--selected {
  border: 2px solid #ff9b17;
  background-color: #fff7e6;
  color: #ff9b17;
}

.symbol-tag--unselected {
  border: 1px solid #d9d9d9;
  background-color: transparent;
  color: #999;
}

.symbol-selector__count {
  font-size: 12px;
  color: #999;
}
</style>
