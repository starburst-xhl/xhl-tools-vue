<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { message } from "ant-design-vue";
import { CopyOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";

/**
 * 字段类型
 */
type FieldType = 'name' | 'idCard' | 'email' | 'phone' | 'number' | 'string' | 'select' | 'multiselect' | 'boolean';

interface Field {
  id: string;
  name: string;
  type: FieldType;
  enabled: boolean;
  // number specific
  min?: number;
  max?: number;
  // string specific
  length?: number;
  // select/multiselect specific
  options?: string[];
}

// 字段列表
const fields = reactive<Field[]>([]);

// 生成记录数
const generateCount = ref(10);

// 生成的JSON数据
const generatedJson = ref('');

// 生成唯一ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// 处理添加字段
const handleAddField = (key: string | number) => {
  addField(key as FieldType);
};

// 菜单点击处理（避免模板中内联类型注解）
const onMenuClick = (e: { key: string | number }) => {
  handleAddField(e.key);
};

/**
 * 生成随机中文姓名
 */
const generateChineseName = (): string => {
  const surnames = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗', '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕', '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎', '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜', '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆', '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史', '顾', '侯', '邵', '孟', '龙', '万', '段', '漕', '钱', '汤', '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'];
  // 单字名池
  const givenNameSingle = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '霞', '平', '刚', '芬', '玲', '豪', '辉', '斌', '宇', '鹏', '飞', '龙', '华', '波', '涛', '勇', '祥', '超', '秀', '英', '兰', '玉', '珍', '莉', '萍', '红', '梅', '雪', '娟', '婷', '艳', '秀英'];
  // 双字名池
  const givenNameDouble = ['建国', '建华', '志强', '志明', '俊杰', '浩然', '子轩', '梓涵', '宇轩', '雨萱', '欣怡', '思远', '致远', '欣悦', '梓萱', '语桐', '浩宇', '秀兰', '秀英', '桂英'];

  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  // 30%概率单名
  const isSingle = Math.random() > 0.7;
  const name = isSingle
    ? givenNameSingle[Math.floor(Math.random() * givenNameSingle.length)]
    : givenNameDouble[Math.floor(Math.random() * givenNameDouble.length)];
  return surname + name;
};

/**
 * 生成随机身份证号码
 */
const generateChineseId = (): string => {
  // 地区代码（部分示例）
  const areas = [
    '110000', '120000', '310000', '320000', '330000', '440000', '510000', '610000'
  ];
  const area = areas[Math.floor(Math.random() * areas.length)];

  // 出生日期
  const year = 1950 + Math.floor(Math.random() * 50);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  const birthdate = `${year}${month}${day}`;

  // 顺序码（3位数字，奇数男性，偶数女性）
  const seq = String(Math.floor(Math.random() * 10)) +
               String(Math.floor(Math.random() * 10)) +
               String(Math.floor(Math.random() * 10));

  // 校验码（通过算法计算，这里简化处理）
  const id17 = area + birthdate + seq;
  const checkCodes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X'];
  const sum = id17.split('').reduce((acc, digit, idx) => {
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    return acc + (parseInt(digit) * weights[idx]);
  }, 0);
  const checkCode = checkCodes[sum % 11];

  return id17 + checkCode;
};

/**
 * 生成随机邮箱
 */
const generateEmail = (): string => {
  const domains = ['qq.com', '163.com', '126.com', 'gmail.com', 'outlook.com', 'hotmail.com', 'sina.com', 'foxmail.com'];
  const prefixes = ['test', 'user', 'demo', 'admin', 'mail', 'info', 'support', 'service'];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)] +
                 Math.floor(Math.random() * 10000);
  const domain = domains[Math.floor(Math.random() * domains.length)];

  return `${prefix}@${domain}`;
};

/**
 * 生成随机手机号码（中国大陆手机号）
 */
const generatePhone = (): string => {
  // 手机号前缀
  const prefixes = [
    '130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
    '150', '151', '152', '153', '155', '156', '157', '158', '159',
    '170', '171', '172', '173', '175', '176', '177', '178',
    '180', '181', '182', '183', '184', '185', '186', '187', '188', '189'
  ];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  let phone = prefix;

  for (let i = 0; i < 8; i++) {
    phone += Math.floor(Math.random() * 10);
  }

  return phone;
};

// 获取字段类型的标签
const getFieldTypeLabel = (type: FieldType): string => {
  const labels: Record<FieldType, string> = {
    name: '姓名',
    idCard: '身份证',
    email: '邮箱',
    phone: '手机',
    number: '数字',
    string: '字符串',
    select: '单选',
    multiselect: '多选',
    boolean: '布尔值',
  };
  return labels[type];
};

// 获取字段类型的默认名称
const getFieldDefaultName = (type: FieldType): string => {
  const names: Record<FieldType, string> = {
    name: 'name',
    idCard: 'idCard',
    email: 'email',
    phone: 'phone',
    number: 'number',
    string: 'string',
    select: 'select',
    multiselect: 'multiselect',
    boolean: 'boolean',
  };
  return names[type];
};

// 添加字段
const addField = (type: FieldType) => {
  const field: Field = {
    id: generateId(),
    name: getFieldDefaultName(type),
    type,
    enabled: true,
  };

  // 根据类型设置默认值
  switch (type) {
    case 'number':
      field.min = 0;
      field.max = 100;
      break;
    case 'string':
      field.length = 10;
      break;
    case 'select':
    case 'multiselect':
      field.options = ['选项1', '选项2', '选项3'];
      break;
    case 'boolean':
      // 布尔值不需要额外配置
      break;
    case 'name':
    case 'idCard':
    case 'email':
    case 'phone':
      // 预置类型不需要额外配置
      break;
  }

  fields.push(field);
};

// 删除字段
const removeField = (id: string) => {
  const index = fields.findIndex(f => f.id === id);
  if (index > -1) {
    fields.splice(index, 1);
  }
};

// 生成单个随机值
const generateRandomValue = (field: Field): any => {
  switch (field.type) {
    case 'name':
      return generateChineseName();
    case 'idCard':
      return generateChineseId();
    case 'email':
      return generateEmail();
    case 'phone':
      return generatePhone();
    case 'number':
      const min = field.min ?? 0;
      const max = field.max ?? 100;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    case 'string':
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const len = field.length ?? 10;
      let result = '';
      for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    case 'select':
      const options = field.options ?? ['选项1', '选项2'];
      return options[Math.floor(Math.random() * options.length)];
    case 'multiselect':
      const multiOptions = field.options ?? ['选项1', '选项2', '选项3'];
      const count = Math.floor(Math.random() * multiOptions.length) + 1;
      const shuffled = [...multiOptions].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    case 'boolean':
      return Math.random() > 0.5;
  }
};

// 生成JSON数据
const generateJson = () => {
  const dataList: Record<string, any>[] = [];

  for (let i = 0; i < generateCount.value; i++) {
    const item: Record<string, any> = {};

    for (const field of fields) {
      if (!field.enabled) continue;
      item[field.name] = generateRandomValue(field);
    }

    dataList.push(item);
  }

  // 格式化输出
  if (dataList.length === 1) {
    generatedJson.value = JSON.stringify(dataList[0], null, 2);
  } else {
    generatedJson.value = JSON.stringify(dataList, null, 2);
  }
};

// 复制JSON
const copyJson = async () => {
  try {
    await navigator.clipboard.writeText(generatedJson.value);
    message.success('已复制到剪贴板');
  } catch (error) {
    message.error('复制失败');
  }
};

// 初始化默认字段
onMounted(() => {
  if (fields.length === 0) {
    addField('name');
    addField('email');
    addField('phone');
  }
  generateJson();
});

// 当字段或数量变化时自动重新生成
watch([fields, generateCount], () => {
  generateJson();
}, { deep: true });
</script>

<template>
  <div class="mock-generator">
    <!-- 生成数量 -->
    <div class="mock-generator__section">
      <div class="mock-generator__section-title">生成数量</div>
      <a-input-number
        v-model:value="generateCount"
        :min="1"
        :max="100"
        style="width: 120px"
      />
    </div>

    <!-- 字段配置 -->
    <div class="mock-generator__section">
      <div class="mock-generator__section-header">
        <div class="mock-generator__section-title">字段配置</div>
        <a-dropdown>
          <a-button type="primary" size="small">
            <template #icon><PlusOutlined /></template>
            添加字段
          </a-button>
          <template #overlay>
            <a-menu @click="onMenuClick">
              <a-menu-item key="name">姓名</a-menu-item>
              <a-menu-item key="idCard">身份证</a-menu-item>
              <a-menu-item key="email">邮箱</a-menu-item>
              <a-menu-item key="phone">手机</a-menu-item>
              <a-menu-divider />
              <a-menu-item key="number">数字</a-menu-item>
              <a-menu-item key="string">字符串</a-menu-item>
              <a-menu-item key="select">单选</a-menu-item>
              <a-menu-item key="multiselect">多选</a-menu-item>
              <a-menu-item key="boolean">布尔值</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>

      <!-- 字段列表 -->
      <div v-if="fields.length > 0" class="mock-generator__fields">
        <div
          v-for="field in fields"
          :key="field.id"
          class="mock-generator__field"
        >
          <div class="mock-generator__field-header">
            <a-checkbox v-model:checked="field.enabled" />
            <a-input
              v-model:value="field.name"
              placeholder="字段名"
              style="flex: 1; margin-left: 8px"
              size="small"
            />
            <a-tag color="orange" style="margin-left: 8px">{{ getFieldTypeLabel(field.type) }}</a-tag>
            <a-button
              type="text"
              danger
              size="small"
              @click="removeField(field.id)"
              style="margin-left: 8px"
            >
              <template #icon><DeleteOutlined /></template>
            </a-button>
          </div>

          <!-- 数字类型配置 -->
          <div v-if="field.type === 'number'" class="mock-generator__field-config">
            <a-input-number
              v-model:value="field.min"
              :min="0"
              size="small"
              style="width: 100px"
              placeholder="最小值"
            />
            <span style="margin: 0 8px">至</span>
            <a-input-number
              v-model:value="field.max"
              :min="0"
              size="small"
              style="width: 100px"
              placeholder="最大值"
            />
          </div>

          <!-- 字符串类型配置 -->
          <div v-if="field.type === 'string'" class="mock-generator__field-config">
            <span style="margin-right: 8px">长度:</span>
            <a-input-number
              v-model:value="field.length"
              :min="1"
              :max="100"
              size="small"
              style="width: 80px"
            />
          </div>

          <!-- 单选/多选类型配置 -->
          <div v-if="field.type === 'select' || field.type === 'multiselect'" class="mock-generator__field-config">
            <a-select
              v-model:value="field.options"
              mode="tags"
              size="small"
              style="width: 100%"
              placeholder="输入选项后按回车添加"
              :max-tag-count="3"
            />
          </div>
        </div>
      </div>
      <div v-else class="mock-generator__empty-hint">
        暂无字段，点击上方按钮添加
      </div>
    </div>

    <!-- 结果展示 -->
    <div class="mock-generator__section">
      <div class="mock-generator__section-header">
        <div class="mock-generator__section-title">生成结果</div>
        <a-space>
          <a-button size="small" @click="generateJson">
            重新生成
          </a-button>
          <a-button type="primary" size="small" @click="copyJson">
            <template #icon><CopyOutlined /></template>
            复制
          </a-button>
        </a-space>
      </div>
      <div class="mock-generator__result">
        <pre>{{ generatedJson }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mock-generator {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.mock-generator__section {
  background: var(--color-bg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.mock-generator__section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.mock-generator__section-title {
  font-size: var(--font-size-body);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.mock-generator__section-header .mock-generator__section-title {
  margin-bottom: 0;
}

.mock-generator__fields {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.mock-generator__field {
  background: var(--color-bg-component);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
}

.mock-generator__field-header {
  display: flex;
  align-items: center;
}

.mock-generator__field-config {
  display: flex;
  align-items: center;
  margin-top: var(--spacing-sm);
  padding-left: 28px;
}

.mock-generator__empty-hint {
  text-align: center;
  color: var(--color-text-tertiary);
  padding: var(--spacing-lg);
  font-size: var(--font-size-body-sm);
}

.mock-generator__result {
  background: var(--color-bg-tool-display);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mock-generator__result::-webkit-scrollbar {
  display: none;
}

.mock-generator__result pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Courier New', monospace;
  font-size: var(--font-size-body-sm);
  color: var(--color-text-primary);
  line-height: 1.6;
}
</style>