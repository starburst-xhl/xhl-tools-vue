# 文件上传型工具开发模式

适用于需要上传文件/图片然后处理的工具（如二维码解析器、图片格式转换等）。

## 核心模式

### 1. 文件上传区

**使用原生 `<input type="file">` + 自定义样式**，不使用 `a-upload` 组件。

原因：
- `a-upload` 的 `UploadFile` 类型与 `File` 对象之间有兼容性问题
- 原生 `<input>` 更简单可靠，便于获取原始 `File` 对象

```vue
<template>
  <div v-if="!previewUrl" class="dropzone" @click="triggerUpload">
    <UploadOutlined class="dropzone__icon" />
    <p class="dropzone__text">点击上传文件</p>
    <p class="dropzone__hint">支持 PNG / JPG / WEBP 格式</p>
  </div>

  <div v-else class="preview">
    <img :src="previewUrl" alt="预览" class="preview__img" />
    <div class="preview__info">
      <span class="preview__name">{{ fileName }}</span>
      <a-button size="small" type="link" @click="removeFile">移除</a-button>
    </div>
  </div>

  <!-- 隐藏的文件输入 -->
  <input
    ref="fileInput"
    type="file"
    accept="image/*"
    class="hidden-input"
    @change="handleFileChange"
  />
</template>
```

### 2. 文件读取方式

**使用 `FileReader.readAsDataURL`** 替代 `URL.createObjectURL`。

原因：
- Data URL 是字符串，不会被意外回收，更稳定
- 预览和数据处理共用同一个 data URL
- Data URL 可直接用于 Canvas 绘制和 jsQR 等库解码

```typescript
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  fileName = file.name;
  selectedFile = file;

  const reader = new FileReader();
  reader.onload = (event) => {
    previewUrl = event.target?.result as string;
    // 上传后自动处理，不需要用户再点击按钮
    processData(previewUrl);
  };
  reader.readAsDataURL(file);
};
```

### 3. 自动处理模式

**文件上传后自动处理**，不需要额外的"处理"按钮。

这是文件处理型工具与输入处理型工具的核心区别：
- 输入处理型：用户输入 → 点击按钮 → 处理
- 文件处理型：用户上传 → 自动处理 → 显示结果

```typescript
// FileReader.onload 中直接调用处理函数
reader.onload = (event) => {
  previewUrl.value = event.target?.result as string;
  processData(previewUrl.value);  // ← 自动处理
};
```

### 4. 图片 Canvas 处理

对于需要读取图片像素数据的工具（二维码解析等），需要 Canvas 中间步骤：

```typescript
const processData = (dataUrl: string) => {
  isProcessing.value = true;
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // 使用 imageData 进行处理
    // 例如 jsQR(imageData.data, imageData.width, imageData.height)
  };
  img.src = dataUrl;
};
```

### 5. 拖拽上传增强（可选）

```typescript
const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
  const file = e.dataTransfer?.files[0];
  if (file) processFile(file);
};
```

```vue
<div
  class="dropzone"
  @click="triggerUpload"
  @dragover="handleDragOver"
  @dragleave="handleDragLeave"
  @drop="handleDrop"
>
  ...
</div>
```

## 样式模板

```css
/* 根元素 — width:100%，不加卡片 */
.tool-root {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* 隐藏文件输入 */
.hidden-input {
  display: none;
}

/* 上传区虚线框 */
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xxl) var(--spacing-lg);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  background: var(--color-bg);
  transition: all var(--transition-fast);
}

.dropzone:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
}

.dropzone__icon {
  font-size: 48px;
  color: var(--color-primary);
  opacity: 0.6;
}

.dropzone__text {
  margin: 0;
  font-size: var(--font-size-h5);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.dropzone__hint {
  margin: 0;
  font-size: var(--font-size-body-sm);
  color: var(--color-text-tertiary);
}

/* 预览区 */
.preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  padding: var(--spacing-lg);
}

.preview__img {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.preview__info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  justify-content: center;
}

.preview__name {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 结果卡片 — 使用 content-card 统一规范 */
.content-card {
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
}
```

## 完整示例参考

项目中已有的文件处理型工具：
- `QrCodeParserTool.vue` — 图片上传 + 自动二维码解析
- `RpgmvpToPng.vue` — 文件上传 + 格式转换