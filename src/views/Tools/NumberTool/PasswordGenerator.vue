<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {message} from "ant-design-vue";
import {copyToClipboard} from "@/utils/clipboard_utils";
import {CopyOutlined, RedoOutlined} from "@ant-design/icons-vue";

// 预设的特殊字符集(完整集合)
const PRESET_SYMBOLS = '!@#$%^&*()_+{}:"<>?|[];\',./';

type TypeKey = 'uppercase' | 'lowercase' | 'numbers' | 'symbols';

const form = reactive({
  passwordLength: 12,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  // 各字符类型在生成时的权重（相对值）
  weights: {
    uppercase: 1,
    lowercase: 1,
    numbers: 1,
    symbols: 1,
  } as Record<TypeKey, number>,
});

const TYPE_OPTIONS: {
  key: TypeKey;
  label: string;
  enabledKey: 'includeUppercase' | 'includeLowercase' | 'includeNumbers' | 'includeSymbols';
}[] = [
  {key: 'uppercase', label: '大写字母', enabledKey: 'includeUppercase'},
  {key: 'lowercase', label: '小写字母', enabledKey: 'includeLowercase'},
  {key: 'numbers', label: '数字', enabledKey: 'includeNumbers'},
  {key: 'symbols', label: '特殊字符', enabledKey: 'includeSymbols'},
];

// 数字输入框的本地值：仅在失焦后写回 form 并重新生成密码
const lengthInput = ref<number | null>(form.passwordLength);
const weightInputs = reactive<Record<TypeKey, number | null>>({
  uppercase: 1,
  lowercase: 1,
  numbers: 1,
  symbols: 1,
});

const commitLength = () => {
  const value = Math.floor(Number(lengthInput.value));
  if (!Number.isFinite(value) || value < 1) {
    lengthInput.value = form.passwordLength;
    return;
  }
  form.passwordLength = value;
};

const commitWeight = (key: TypeKey) => {
  const value = Math.floor(Number(weightInputs[key]));
  if (!Number.isFinite(value) || value < 1) {
    weightInputs[key] = form.weights[key];
    return;
  }
  form.weights[key] = value;
};

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
  await copyToClipboard(password.value, '密码已复制到剪贴板', '复制失败');
};

const generatePassword = () => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = selectedSymbols.value.join('');
  if (form.includeSymbols && !symbols) {
    message.error('请至少选择一个特殊字符');
    return;
  }
  // 按字符类型分组：生成时按权重选中一种类型，再从该类型中随机取字符，
  // 避免字符多的类型（如特殊字符）占比过高
  const weightedCharsets: { charset: string; weight: number }[] = [];
  let gen_password = '';
  if (form.includeUppercase) weightedCharsets.push({charset: uppercase, weight: form.weights.uppercase});
  if (form.includeLowercase) weightedCharsets.push({charset: lowercase, weight: form.weights.lowercase});
  if (form.includeNumbers) weightedCharsets.push({charset: numbers, weight: form.weights.numbers});
  if (form.includeSymbols && symbols) weightedCharsets.push({charset: symbols, weight: form.weights.symbols});
  if (weightedCharsets.length === 0) {
    message.error('请至少选择一种字符类型');
    return;
  }
  // 密码长度为输入框被清空时可能为 null，需先校验
  const length = Math.floor(Number(form.passwordLength));
  if (!Number.isFinite(length) || length <= 0) {
    message.error('请输入有效的密码长度');
    return;
  }
  // 所需字符类型数量，长度不足时条件永远无法满足，会死循环
  if (length < weightedCharsets.length) {
    message.error(`密码长度至少为 ${weightedCharsets.length} 位才能包含所选的字符类型`);
    return;
  }
  const totalWeight = weightedCharsets.reduce((sum, item) => sum + item.weight, 0);
  const pickCharset = () => {
    let random = Math.random() * totalWeight;
    for (const item of weightedCharsets) {
      if (random < item.weight) return item.charset;
      random -= item.weight;
    }
    return weightedCharsets[weightedCharsets.length - 1].charset;
  };
  while (true) {
    gen_password = '';
    for (let i = 0; i < length; i++) {
      const charset = pickCharset();
      gen_password += charset.charAt(Math.floor(Math.random() * charset.length));
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
        <a-input-number
          v-model:value="lengthInput"
          :min="1"
          :max="60"
          @blur="commitLength"
          @press-enter="commitLength"
        />
      </a-form-item>
      <a-form-item v-for="option in TYPE_OPTIONS" :key="option.key" :label="`包含${option.label}`">
        <div class="type-control">
          <a-switch v-model:checked="form[option.enabledKey]"/>
          <span class="type-control__label">权重</span>
          <a-input-number
            v-model:value="weightInputs[option.key]"
            :min="1"
            :max="100"
            :disabled="!form[option.enabledKey]"
            size="small"
            class="type-control__weight"
            @blur="commitWeight(option.key)"
            @press-enter="commitWeight(option.key)"
          />
        </div>
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
  border-radius: var(--radius-md);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
  font-family: 'Courier New', monospace;
}

.password-generator__button-container {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.type-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-control__label {
  font-size: var(--font-size-caption-sm);
  color: var(--color-text-tertiary);
}

.type-control__weight {
  width: 72px;
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
  font-size: var(--font-size-caption-sm);
  color: var(--color-text-tertiary);
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
  border: 2px solid var(--color-primary);
  background-color: var(--color-primary-bg);
  color: var(--color-primary);
}

.symbol-tag--unselected {
  border: 1px solid var(--color-border);
  background-color: transparent;
  color: var(--color-text-tertiary);
}

.symbol-selector__count {
  font-size: 12px;
  color: #999;
}
</style>
