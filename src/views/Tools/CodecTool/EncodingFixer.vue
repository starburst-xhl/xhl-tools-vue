<script setup lang="ts">
import { ref, reactive } from "vue"
import { message } from "ant-design-vue"
import {
  WarningOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  DownOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons-vue"
import { copyToClipboard } from "@/utils/clipboard_utils"
import ToolTips from "@/components/ToolTips.vue"
import {
  autoFixEncoding,
  convertEncoding,
  getSupportedEncodings,
  isTextGarbled,
  type FixCandidate,
  type FixPath,
} from "@/utils/encoding_utils"

// ===== 状态 =====
const inputText = ref<string>("")
const isAutoFixing = ref<boolean>(false)
const isManualFixing = ref<boolean>(false)

// 自动检测结果
const autoFixResults = ref<FixCandidate[]>([])
const bestResult = ref<string>("")
const garbledStatus = reactive({ garbled: false, reason: "" })

// 手动修复
const manualSourceEncoding = ref<string>("latin1")
const manualTargetEncoding = ref<string>("utf-8")
const manualResult = ref<string>("")

// 当前显示的配置
const showAutoMode = ref<boolean>(true)

// 当前展开查看的候选
const expandedCandidateIndex = ref<number | null>(null)

const supportedEncodings = getSupportedEncodings()

// ===== 自动检测修复 =====
const runAutoFix = async () => {
  if (!inputText.value.trim()) {
    message.warning("请输入待修复的文本")
    return
  }

  isAutoFixing.value = true
  autoFixResults.value = []
  bestResult.value = ""
  showAutoMode.value = true

  try {
    const candidates = autoFixEncoding(inputText.value)

    if (candidates.length === 0) {
      message.warning("未检测到可修复的编码问题，文本可能没有乱码或使用了不支持的编码")
      return
    }

    autoFixResults.value = candidates
    bestResult.value = candidates[0].result
    message.success(`推荐修复路径：${candidates[0].path.label}`)
  } catch {
    message.error("自动修复失败")
  } finally {
    isAutoFixing.value = false
  }
}

// ===== 手动修复 =====
const runManualFix = async () => {
  if (!inputText.value.trim()) {
    message.warning("请输入待修复的文本")
    return
  }

  isManualFixing.value = true
  showAutoMode.value = false

  try {
    const result = convertEncoding(
      inputText.value,
      manualSourceEncoding.value,
      manualTargetEncoding.value,
    )
    manualResult.value = result

    if (result === inputText.value) {
      message.warning("修复结果与原文相同，请检查编码选择是否正确")
    } else {
      message.success("手动修复完成")
    }
  } catch {
    message.error("修复失败，请检查编码选择")
  } finally {
    isManualFixing.value = false
  }
}

// ===== 检查乱码 =====
const checkGarbled = () => {
  if (!inputText.value.trim()) {
    garbledStatus.garbled = false
    garbledStatus.reason = ""
    return
  }
  const result = isTextGarbled(inputText.value)
  if (result.garbled) {
    garbledStatus.garbled = true
    garbledStatus.reason = result.reason
  } else {
    garbledStatus.garbled = false
    garbledStatus.reason = ""
  }
}

// ===== 复制 =====
const copyResult = async (text: string) => {
  await copyToClipboard(text, "已复制到剪贴板", "复制失败")
}

// ===== 重置 =====
const resetAll = () => {
  inputText.value = ""
  autoFixResults.value = []
  bestResult.value = ""
  manualResult.value = ""
  showAutoMode.value = true
  expandedCandidateIndex.value = null
  garbledStatus.garbled = false
  garbledStatus.reason = ""
}

// ===== 切换候选展开 =====
const toggleCandidate = (index: number) => {
  expandedCandidateIndex.value =
    expandedCandidateIndex.value === index ? null : index
}
</script>

<template>
  <div class="encoding-fixer">
    <div class="tool-content">
      <!-- 输入区域 -->
      <div>
        <label class="section-label">乱码文本</label>
        <a-textarea
          v-model:value="inputText"
          placeholder="请粘贴或输入显示为乱码的文本，然后点击「自动检测修复」..."
          :rows="6"
          @input="checkGarbled"
        />
        <!-- 乱码提示 -->
        <div v-if="garbledStatus.garbled" class="garbled-warning">
          <WarningOutlined class="garbled-warning__icon" />
          <span>{{ garbledStatus.reason }}</span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="button-container">
        <a-button
          type="primary"
          :loading="isAutoFixing"
          :disabled="!inputText.trim()"
          @click="runAutoFix"
        >
          <template #icon><SearchOutlined /></template>
          自动检测修复
        </a-button>
        <a-button
          :disabled="!inputText.trim()"
          @click="resetAll"
        >
          重置
        </a-button>
      </div>

      <!-- 自动检测结果 -->
      <div v-if="autoFixResults.length > 0 && showAutoMode">
        <!-- 最佳结果 -->
        <div class="content-card">
          <div class="card-header">
            <div class="section-title">
              <CheckCircleOutlined class="result-icon result-icon--success" />
              推荐修复结果
            </div>
            <a-button type="link" size="small" @click="copyResult(bestResult)">
              复制
            </a-button>
          </div>
          <div class="fix-path-badge">
            修复路径：<strong>{{ autoFixResults[0].path.label }}</strong>
          </div>
          <div class="result-text-block">{{ bestResult }}</div>
        </div>

        <!-- 全部候选列表 -->
        <div class="content-card">
          <div class="section-title">所有可能的修复路径</div>
          <div class="candidate-list">
            <div
              v-for="(candidate, index) in autoFixResults"
              :key="index"
              class="candidate-item"
              :class="{ 'candidate-item--active': index === 0 }"
            >
              <div
                class="candidate-item__header"
                @click="toggleCandidate(index)"
              >
                <div class="candidate-item__info">
                  <span class="candidate-item__label">
                    <template v-if="index === 0">
                      <CheckCircleOutlined class="candidate-item__check" />
                    </template>
                    {{ candidate.path.label }}
                  </span>
                  <span class="candidate-item__score">
                    评分: {{ Math.round(candidate.score) }}
                  </span>
                </div>
                <div class="candidate-item__actions">
                  <a-button
                    type="link"
                    size="small"
                    @click.stop="copyResult(candidate.result)"
                  >
                    复制
                  </a-button>
                  <DownOutlined
                    class="candidate-item__arrow"
                    :class="{ 'candidate-item__arrow--expanded': expandedCandidateIndex === index }"
                  />
                </div>
              </div>
              <div
                v-show="expandedCandidateIndex === index"
                class="candidate-item__body"
              >
                {{ candidate.result }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 手动修复区域 -->
      <div class="content-card">
        <div class="section-title">手动修复</div>
        <p class="manual-hint">
          如果自动检测没有找到正确的修复结果，可以选择编码组合手动尝试：
        </p>
        <div class="manual-controls">
          <div class="manual-select-group">
            <div class="manual-select-item">
              <label class="section-label">当前文本的编码</label>
              <a-select
                v-model:value="manualSourceEncoding"
                :options="supportedEncodings"
                style="width: 100%"
              />
            </div>
            <div class="manual-select-arrow">
              <ArrowRightOutlined />
            </div>
            <div class="manual-select-item">
              <label class="section-label">原始编码</label>
              <a-select
                v-model:value="manualTargetEncoding"
                :options="supportedEncodings"
                style="width: 100%"
              />
            </div>
          </div>
          <div class="manual-btn-wrapper">
            <a-button
              type="primary"
              :loading="isManualFixing"
              :disabled="!inputText.trim()"
              @click="runManualFix"
            >
              手动修复
            </a-button>
          </div>
        </div>

        <!-- 手动修复结果 -->
        <div v-if="manualResult && !showAutoMode" class="manual-result">
          <div class="card-header" style="margin-top: var(--spacing-lg)">
            <span class="section-title">
              修复结果（{{ manualSourceEncoding }} → {{ manualTargetEncoding }}）
            </span>
            <a-button type="link" size="small" @click="copyResult(manualResult)">
              复制
            </a-button>
          </div>
          <div class="result-text-block">{{ manualResult }}</div>
        </div>
      </div>

      <!-- 编码说明 -->
      <div class="content-card">
        <div class="section-title">常见乱码场景</div>
        <div class="scenario-list">
          <div class="scenario-item">
            <span class="scenario-item__encoding">Latin-1 &#8594; UTF-8</span>
            <span class="scenario-item__desc">文本显示为类似 "ä¸­æ" 的拉丁字母乱码</span>
          </div>
          <div class="scenario-item">
            <span class="scenario-item__encoding">GBK &#8594; UTF-8</span>
            <span class="scenario-item__desc">文本显示为 "涓枃鎴戞槸" 等错误的中文字符</span>
          </div>
          <div class="scenario-item">
            <span class="scenario-item__encoding">Shift_JIS &#8594; UTF-8</span>
            <span class="scenario-item__desc">日文显示为 "�ｿｽ" 等乱码或奇怪的汉字</span>
          </div>
          <div class="scenario-item">
            <span class="scenario-item__encoding">EUC-KR &#8594; UTF-8</span>
            <span class="scenario-item__desc">韩文显示为 "��ȣ" 等乱码</span>
          </div>
          <div class="scenario-item">
            <span class="scenario-item__encoding">UTF-8 &#8594; GBK</span>
            <span class="scenario-item__desc">本来正确的中文在 GBK 环境下显示异常</span>
          </div>
        </div>
      </div>

      <ToolTips :tips="[
        '支持中文GBK/Big5、日文Shift_JIS、韩文EUC-KR及Latin-1编码的互转修复',
        '自动检测会尝试所有编码组合并评分，推荐最高分结果',
        '如果自动修复不准确，可在手动修复中选择具体的编码组合',
        '所有处理在浏览器本地完成，文本不会上传到服务器',
      ]" />
    </div>
  </div>
</template>

<style scoped>
/* ===== 页面根容器 ===== */
.encoding-fixer {
  width: 100%;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* ===== 按钮容器 ===== */
.button-container {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

/* ===== 乱码警告 ===== */
.garbled-warning {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-body-sm);
  color: #d46b08;
  line-height: var(--line-height-body);
}

.garbled-warning__icon {
  flex-shrink: 0;
  margin-top: 2px;
  font-size: 14px;
  color: #faad14;
}

/* ===== 结果样式 ===== */
.result-icon {
  margin-right: var(--spacing-xs);
  font-size: 16px;
}

.result-icon--success {
  color: var(--color-primary);
}

.fix-path-badge {
  display: inline-block;
  margin-bottom: var(--spacing-md);
  padding: 2px 10px;
  font-size: var(--font-size-body-sm);
  color: var(--color-primary);
  background: #fff7e6;
  border-radius: var(--radius-sm);
}

.result-text-block {
  padding: var(--spacing-md);
  background: var(--color-bg-component);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  line-height: var(--line-height-body);
  white-space: pre-wrap;
  word-break: break-all;
}

/* ===== 候选列表 ===== */
.candidate-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.candidate-item {
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: var(--transition-fast);
}

.candidate-item--active {
  border-color: var(--color-primary);
  background: #fffbe6;
}

.candidate-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  user-select: none;
}

.candidate-item__header:hover {
  background: rgba(0, 0, 0, 0.02);
}

.candidate-item__info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.candidate-item__label {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.candidate-item__check {
  color: var(--color-primary);
  margin-right: 2px;
}

.candidate-item__score {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-tertiary);
}

.candidate-item__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.candidate-item__arrow {
  font-size: 12px;
  color: var(--color-text-tertiary);
  transition: transform 0.2s;
}

.candidate-item__arrow--expanded {
  transform: rotate(180deg);
}

.candidate-item__body {
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-md);
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-body);
  white-space: pre-wrap;
  word-break: break-all;
  border-top: 1px solid var(--color-border-light);
}

/* ===== 手动修复 ===== */
.manual-hint {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-body);
}

.manual-controls {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.manual-select-group {
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-md);
}

.manual-select-item {
  flex: 1;
}

.manual-select-arrow {
  flex-shrink: 0;
  padding-bottom: 12px;
  font-size: 20px;
  color: var(--color-primary);
}

.manual-btn-wrapper {
  display: flex;
  justify-content: center;
}

.manual-result {
  margin-top: var(--spacing-md);
}

/* ===== 场景列表 ===== */
.scenario-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.scenario-item {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-body-sm);
  line-height: var(--line-height-body);
}

.scenario-item__encoding {
  flex-shrink: 0;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  font-family: 'Courier New', monospace;
  font-size: var(--font-size-body-sm);
}

.scenario-item__desc {
  color: var(--color-text-secondary);
}

/* ===== 统一样式 ===== */
.section-label {
  display: block;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-sm);
}

.section-title {
  font-size: var(--font-size-h5);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-md);
}

.content-card {
  background: var(--color-bg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.card-header .section-title {
  margin-bottom: 0;
}

/* ===== 响应式 ===== */
@media (max-width: 767px) {
  .button-container {
    flex-direction: column;
  }
  .button-container .ant-btn {
    width: 100%;
  }
  .manual-select-group {
    flex-direction: column;
    align-items: stretch;
  }
  .manual-select-arrow {
    display: none;
  }
  .scenario-item {
    flex-direction: column;
    gap: 2px;
  }
}
</style>
