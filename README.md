# XHL Tools

> 开源免费的在线工具集合，基于 Vue 3 + TypeScript + vite-ssg 构建的静态站点生成（SSG）项目。

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](LICENSE)
[![Node: 22](https://img.shields.io/badge/Node-22-green.svg)](https://nodejs.org/)
[![Vue: 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)

在线访问：[tools.xhcy.cc](https://tools.xhcy.cc)

---

## 功能特性

XHL Tools 提供多类实用的在线工具，所有操作均在浏览器本地完成，无需上传数据至服务器：

### 编解码工具

| 工具 | 说明 |
|------|------|
| **Base64 编解码** | 文本的 Base64 编码与解码转换 |
| **二维码生成** | 快速生成二维码，支持自定义内容和样式 |
| **AES 加解密** | AES 加密与解密，保护数据安全 |
| **JSON 格式化** | JSON 数据的美化格式化与压缩 |

### 数字工具

| 工具 | 说明 |
|------|------|
| **秒表** | 精准计时，支持开始、暂停、重置等操作 |
| **密码生成器** | 生成安全随机密码，可自定义长度和字符类型 |
| **骰子** | 仿真骰子工具，支持仿真模式和自定义面数 |

### 媒体工具

| 工具 | 说明 |
|------|------|
| **RPGMVP 转 PNG** | 将 RPG Maker 加密图片格式转换为 PNG |
| **颜色拾取器** | 颜色选取，支持 HEX / RGB / HSL 多格式转换 |

### Mock 工具

| 工具 | 说明 |
|------|------|
| **Mock 数据生成** | 生成测试数据，支持姓名、身份证、邮箱、手机等预置字段及自定义字段 |

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/) |
| 构建 | [Vite](https://vite.dev/) + [vite-ssg](https://github.com/nicknisi/vite-ssg) |
| UI | [Ant Design Vue](https://antdv.com/) |
| 状态管理 | [Pinia](https://pinia.vuejs.org/) |
| 路由 | [Vue Router](https://router.vuejs.org/)（`createWebHistory`） |
| 工具库 | [crypto-js](https://www.npmjs.com/package/crypto-js)、[fuse.js](https://www.npmjs.com/package/fuse.js)、[jszip](https://www.npmjs.com/package/jszip) |
| 测试 | [Vitest](https://vitest.dev/) + [@vue/test-utils](https://test-utils.vuejs.org/) |
| 部署 | [GitHub Pages](https://pages.github.com/)（自定义域名 `tools.xhcy.cc`） |

---

## 目录结构

```
vue-test/
├── public/                  # 静态资源（favicon.ico、robots.txt）
├── scripts/                 # 构建脚本（sitemap 生成）
├── src/
│   ├── main.ts              # SSG 入口，使用 ViteSSG()
│   ├── App.vue              # 根布局组件
│   ├── router/
│   │   └── index.ts         # 路由定义（导出 routes 数组）
│   ├── views/
│   │   ├── HomePage.vue     # 首页
│   │   └── Tools/           # 工具页面
│   │       ├── ToolHome.vue
│   │       ├── CodecTool/   # 编解码工具
│   │       ├── NumberTool/  # 数字工具
│   │       ├── MediaTool/   # 媒体工具
│   │       ├── MockTool/    # Mock 工具
│   │       ├── StringTool/  # 字符串工具（预留）
│   │       └── ChatTool/    # 聊天工具（预留）
│   ├── components/
│   │   ├── HeadBar.vue      # 顶部导航栏
│   │   └── SideMenuPage.vue # 侧边菜单页面布局
│   ├── stores/              # Pinia 状态管理
│   ├── utils/
│   │   ├── menu_utils.ts    # 菜单生成
│   │   ├── string_utils.ts  # 字符串处理
│   │   ├── seo_utils.ts     # SEO 元标签与 sitemap 数据
│   │   └── Tools/           # 工具专属逻辑
│   ├── constants/
│   │   └── tool-routes.json # 工具路由配置（SEO & sitemap）
│   └── assets/
│       └── main.css         # 全局样式与设计令牌
├── vite.config.ts           # Vite 配置（SSR noExternal 等）
├── package.json
├── LICENSE                  # GPL-3.0-or-later
├── CODEBUDDY.md             # AI 开发指南
└── DESIGN_SYSTEM.md         # 设计系统文档
```

---

## 快速开始

### 环境要求

- **Node.js**：22.x
- **npm**：随 Node 22 安装

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动开发服务器并自动打开浏览器，支持热重载。

---

## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（热重载 + 自动打开浏览器） |
| `npm run build` | 类型检查 + SSG 构建 |
| `npm run build-only` | 仅 SSG 构建（跳过类型检查） |
| `npm run preview` | 本地预览生产构建 |
| `npm run type-check` | TypeScript 类型检查 |
| `npm run test:unit` | 运行单元测试（Vitest） |
| `npm run lint` | ESLint 检查并自动修复 |
| `npm run deploy` | 部署 `dist/` 到 GitHub Pages |

---

## 配置说明

### Vite 配置 (`vite.config.ts`)

项目使用自定义域名 `tools.xhcy.cc`，`base` 路径设置为 `/`：

```typescript
export default defineConfig({
  base: '/',              // 自定义域名，无需子路径
  ssr: {
    noExternal: [         // SSR 不可外部化的包
      'ant-design-vue',
      '@ant-design/icons-vue',
      '@ant-design/icons-svg',
      'crypto-js',
    ],
  },
  ssgOptions: {
    formatting: 'minify', // SSG 输出压缩
  },
})
```

### SSG 构建

项目使用 **vite-ssg** 生成静态 HTML 页面：

- 构建产物位于 `dist/` 目录
- 包含 `.nojekyll` 文件以禁用 Jekyll 处理
- 自动生成 `sitemap.xml`（由 `scripts/generate-sitemap.js` 驱动）
- 所有路由在构建时预渲染为静态 HTML

> **提示**：构建时出现 "Build process still running after 15s. Force exit" 警告是正常现象，不影响构建结果（退出代码为 0）。

---

## 开发规范

### 添加新工具

新增工具需同步更新 **两个位置**：

**1. 路由定义** (`src/router/index.ts`)：

```typescript
{
  path: 'your-tool',
  name: 'YourTool',
  component: () => import('@/views/Tools/YourCategory/YourTool.vue'),
  meta: {
    title: 'Your Tool Title',
    icon: 'IconName',
    description: 'Tool description for SEO'
  }
}
```

**2. 工具路由配置** (`src/constants/tool-routes.json`)：

```json
{
  "path": "/tools/category/your-tool",
  "title": "Your Tool Title",
  "description": "Tool description",
  "icon": "IconName",
  "category": "category-name",
  "priority": "0.7",
  "changefreq": "monthly"
}
```

- `priority` 影响 SEO 排名权重（1.0 为最高）
- `changefreq` 告知搜索引擎更新频率

### SSR / SSG 注意事项

1. **避免在组件 setup 中使用浏览器 API**：`window`、`document` 等在 SSG 构建（Node.js 环境）中不可用，应将相关逻辑移至 `onMounted` 生命周期
2. **使用 composables**：使用 `useRouter()` 和 `useRoute()`，不要直接导入 router 实例
3. **使用 `createWebHistory`**：SSG 不支持 `createWebHashHistory()`
4. **组件兼容双环境**：确保组件在服务端和客户端均能正常渲染

### 第三方包 SSR 问题

若某第三方包在 SSG 构建时报错，将其添加到 `vite.config.ts` 的 `ssr.noExternal` 数组中：

```typescript
ssr: {
  noExternal: ['ant-design-vue', 'your-new-package'],
}
```

常见问题包：UI 库、使用 `window`/`document` 的包。

### 设计规范

项目遵循完整的[设计系统文档](DESIGN_SYSTEM.md)，核心要点：

- 主色：`#ff9b17`（温暖橙色）
- 扁平化设计：工具页面不使用阴影，用边框区分层次
- 使用设计令牌（CSS Variables）保持视觉一致性
- 响应式断点：768px / 1024px / 1280px / 1440px

---

## 部署

项目配置为 GitHub Pages 部署：

- **自定义域名**：`tools.xhcy.cc`
- **Base 路径**：`/`
- **构建输出**：`dist/` 目录（含 `.nojekyll` 文件）
- **部署命令**：`npm run deploy`（推送至 `gh-pages` 分支）

---

## 贡献指南

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 确保使用 Node 22
4. 提交更改：`git commit -m 'Add some feature'`
5. 推送分支：`git push origin feature/your-feature`
6. 提交 Pull Request

### 代码质量要求

- 提交前运行 `npm run type-check` 和 `npm run lint`
- 遵循设计系统规范（参见 [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)）
- 新工具需同时更新路由定义和 `tool-routes.json`
- 确保 SSG 构建成功：`npm run build`

---

## 第三方引用声明

本项目中的部分工具参考了以下开源项目：

| 工具 | 来源项目 | 许可证 | 说明 |
|------|---------|--------|------|
| RPGMVP 转 PNG | [rpgmvp2png](https://github.com/DrRyanHuang/rpgmvp2png) | GPLv3 | 参考解密算法思路，代码重构为 Vue 3 组件 |

> 注：以上引用在页面中也会标注来源信息。

## 许可证

本项目基于 [GNU Affero General Public License v3.0](LICENSE) 开源。

---

## 相关文档

| 文档 | 说明 |
|------|------|
| [CLAUDE.md](CLAUDE.md) | AI 开发助手指引 |
| [CODEBUDDY.md](CODEBUDDY.md) | Codebuddy AI 开发助手指引(内容相同) |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | 设计系统完整规范 |