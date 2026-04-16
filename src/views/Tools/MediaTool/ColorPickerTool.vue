<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { message } from "ant-design-vue";
import { ReloadOutlined } from "@ant-design/icons-vue";

// 当前颜色状态 - 默认橙色
const currentColor = ref<string>("#ff9b17");
const alpha = ref<number>(100);

// 颜色历史记录
const colorHistory = ref<string[]>([]);
const maxHistory = 10;

// 预设颜色
const presetColors = [
  "#ff4d4f", "#ff7a45", "#ffa940", "#ffc53d", "#ffec3d",
  "#bae637", "#73d13d", "#36cfc9", "#40a9ff", "#597ef7",
  "#9254de", "#f759ab", "#ff85c0", "#ff9b17", "#595959"
];

// 计算颜色亮度
const colorBrightness = computed(() => {
  const rgb = hexToRgb(currentColor.value);
  if (rgb) {
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  }
  return 255;
});

// 判断是否为浅色
const isLightColor = computed(() => colorBrightness.value > 128);

// 将HEX转换为RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// 将RGB转换为HEX
const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
};

// 将RGB转换为HSL
const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

// 生成RGBA字符串
const getRgbaString = () => {
  const rgb = hexToRgb(currentColor.value);
  if (rgb) {
    const a = alpha.value / 100;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
  }
  return "";
};

// 生成HSL字符串
const getHslString = () => {
  const rgb = hexToRgb(currentColor.value);
  if (rgb) {
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }
  return "";
};

// 添加到历史记录
const addToHistory = (color: string) => {
  const index = colorHistory.value.indexOf(color);
  if (index !== -1) {
    colorHistory.value.splice(index, 1);
  }
  colorHistory.value.unshift(color);
  if (colorHistory.value.length > maxHistory) {
    colorHistory.value.pop();
  }
};

// 监听颜色变化
watch(currentColor, (newColor) => {
  addToHistory(newColor);
}, { immediate: false });

// 应用预设颜色
const applyPresetColor = (color: string) => {
  currentColor.value = color;
  alpha.value = 100;
};

// 生成随机颜色
const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  currentColor.value = rgbToHex(r, g, b);
  alpha.value = 100;
};

// 复制到剪贴板
const copyToClipboard = async (text: string, format: string) => {
  try {
    await navigator.clipboard.writeText(text);
    message.success(`${format}已复制`);
  } catch (err) {
    message.error("复制失败");
  }
};

// 复制当前颜色
const copyColor = async (format: 'hex' | 'rgb' | 'rgba' | 'hsl') => {
  let text = "";
  const rgb = hexToRgb(currentColor.value);
  
  switch (format) {
    case "hex":
      text = currentColor.value;
      break;
    case "rgb":
      text = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "";
      break;
    case "rgba":
      text = getRgbaString();
      break;
    case "hsl":
      text = getHslString();
      break;
  }
  
  if (text) {
    await copyToClipboard(text, format.toUpperCase());
  }
};
</script>

<template>
  <div class="color-picker">
    <!-- 主预览区 -->
    <div class="color-picker__main">
      <div
        class="color-picker__preview"
        :style="{
          backgroundColor: alpha === 100 ? currentColor : getRgbaString(),
          color: isLightColor ? '#000' : '#fff'
        }"
      >
        <div class="color-picker__preview-content">
          <div class="color-picker__color-name">{{ currentColor }}</div>
        </div>
      </div>

      <!-- 随机颜色按钮 -->
      <div class="color-picker__actions">
        <a-button
          type="primary"
          ghost
          @click="generateRandomColor"
        >
          <template #icon>
            <ReloadOutlined />
          </template>
          随机颜色
        </a-button>
      </div>

      <!-- 颜色拾取器 -->
      <div class="color-picker__picker-wrapper">
        <input
          type="color"
          v-model="currentColor"
          class="color-picker__picker"
        />
        <div class="color-picker__picker-label">点击选择颜色</div>
      </div>

      <!-- 透明度控制 -->
      <div class="color-picker__alpha">
        <div class="color-picker__alpha-label">
          <span>透明度</span>
          <span class="color-picker__alpha-value">{{ alpha }}%</span>
        </div>
        <a-slider
          v-model:value="alpha"
          :min="0"
          :max="100"
          class="color-picker__alpha-slider"
        />
      </div>
    </div>

    <!-- 颜色格式卡片 -->
    <div class="color-picker__formats">
      <div class="color-picker__section-title">颜色格式</div>
      <div class="color-picker__format-grid">
        <!-- HEX -->
        <div class="color-picker__format-card" @click="copyColor('hex')">
          <div class="color-picker__format-label">HEX</div>
          <div class="color-picker__format-value">{{ currentColor }}</div>
          <div class="color-picker__format-hint">点击复制</div>
        </div>

        <!-- RGB -->
        <div class="color-picker__format-card" @click="copyColor('rgb')">
          <div class="color-picker__format-label">RGB</div>
          <div class="color-picker__format-value">
            {{ hexToRgb(currentColor) ? `rgb(${hexToRgb(currentColor)!.r}, ${hexToRgb(currentColor)!.g}, ${hexToRgb(currentColor)!.b})` : '' }}
          </div>
          <div class="color-picker__format-hint">点击复制</div>
        </div>

        <!-- RGBA -->
        <div class="color-picker__format-card" @click="copyColor('rgba')">
          <div class="color-picker__format-label">RGBA</div>
          <div class="color-picker__format-value">{{ getRgbaString() }}</div>
          <div class="color-picker__format-hint">点击复制</div>
        </div>

        <!-- HSL -->
        <div class="color-picker__format-card" @click="copyColor('hsl')">
          <div class="color-picker__format-label">HSL</div>
          <div class="color-picker__format-value">{{ getHslString() }}</div>
          <div class="color-picker__format-hint">点击复制</div>
        </div>
      </div>
    </div>

    <!-- 预设颜色 -->
    <div class="color-picker__presets">
      <div class="color-picker__section-title">预设颜色</div>
      <div class="color-picker__preset-grid">
        <div
          v-for="color in presetColors"
          :key="color"
          class="color-picker__preset-color"
          :class="{ 'color-picker__preset-color--active': color === currentColor }"
          :style="{ backgroundColor: color }"
          @click="applyPresetColor(color)"
          :title="color"
        ></div>
      </div>
    </div>

    <!-- 历史记录 -->
    <div v-if="colorHistory.length > 0" class="color-picker__history">
      <div class="color-picker__section-title">最近使用</div>
      <div class="color-picker__history-grid">
        <div
          v-for="color in colorHistory"
          :key="color"
          class="color-picker__history-color"
          :style="{ backgroundColor: color }"
          @click="applyPresetColor(color)"
          :title="color"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-picker {
  display: grid;
  gap: var(--spacing-lg);
  max-width: 800px;
}

/* 主预览区 */
.color-picker__main {
  display: grid;
  gap: var(--spacing-md-lg);
}

.color-picker__preview {
  height: 200px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-border);
  transition: border-color var(--transition-fast);
}

.color-picker__preview-content {
  text-align: center;
}

.color-picker__color-name {
  font-size: var(--font-size-display);
  font-weight: var(--font-weight-bold);
  font-family: 'Courier New', monospace;
  margin-bottom: var(--spacing-md);
}

.color-picker__actions {
  display: flex;
  justify-content: center;
}

/* 颜色拾取器 */
.color-picker__picker-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.color-picker__picker {
  width: 120px;
  height: 120px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  padding: 0;
  transition: border-color var(--transition-fast);
}

.color-picker__picker:hover {
  border-color: var(--color-primary);
}

.color-picker__picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker__picker::-webkit-color-swatch {
  border: none;
  border-radius: calc(var(--radius-lg) - 2px);
}

.color-picker__picker-label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-body);
}

/* 透明度控制 */
.color-picker__alpha {
  background: var(--color-bg);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.color-picker__alpha-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
}

.color-picker__alpha-value {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.color-picker__alpha-slider {
  margin: 0;
}

/* 格式卡片 */
.color-picker__formats {
  background: var(--color-bg-component);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
}

.color-picker__section-title {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-title);
}

.color-picker__format-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--spacing-md);
}

.color-picker__format-card {
  background: var(--color-bg);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.color-picker__format-card:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
}

.color-picker__format-card:active {
  background: var(--color-primary-light);
}

.color-picker__format-label {
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-xs);
  text-transform: uppercase;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.5px;
}

.color-picker__format-value {
  font-size: var(--font-size-body);
  font-family: 'Courier New', monospace;
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
  word-break: break-all;
}

.color-picker__format-hint {
  font-size: var(--font-size-caption-sm);
  color: var(--color-primary);
  margin-top: var(--spacing-xs);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.color-picker__format-card:hover .color-picker__format-hint {
  opacity: 1;
}

/* 预设颜色 */
.color-picker__presets {
  background: var(--color-bg-component);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
}

.color-picker__preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
  gap: var(--spacing-sm);
}

.color-picker__preset-color {
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 2px solid transparent;
}

.color-picker__preset-color:hover {
  border-color: var(--color-text-secondary);
}

.color-picker__preset-color--active {
  border-color: var(--color-text-title);
}

/* 历史记录 */
.color-picker__history {
  background: var(--color-bg-component);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
}

.color-picker__history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: var(--spacing-sm);
}

.color-picker__history-color {
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 2px solid transparent;
}

.color-picker__history-color:hover {
  border-color: var(--color-text-secondary);
}

/* 响应式 */
@media (max-width: 768px) {
  .color-picker__preview {
    height: 160px;
  }

  .color-picker__color-name {
    font-size: var(--font-size-h1);
  }

  .color-picker__picker {
    width: 100px;
    height: 100px;
  }

  .color-picker__format-grid {
    grid-template-columns: 1fr;
  }
}
</style>
