// =========================================================
// ⚠️ 此文件由 scripts/generate-routes.ts 自动生成
// ⚠️ 请勿手动修改！修改 src/constants/tool-routes.json 后自动同步
// =========================================================

export const routes = [
  {
    path: '/', redirect: '/home',
    children: [
      { path: '/home', name: 'Home', component: () => import('@/views/HomePage.vue'), meta: { title: '首页', description: 'XHL Tools是开源免费的在线工具集合网站，提供Base64编解码、二维码生成、AES加密、JSON格式化、密码生成器、秒表、骰子、Mock数据生成、颜色拾取器等多种开发者和日常工具，无需注册即可使用' } },
      {
        path: '/tools', name: 'Tools', redirect: '/tools/tool-home', component: () => import('@/components/SideMenuPage.vue'), meta: { title: '工具' },
        children: [
          { path: 'tool-home', name: 'ToolHome', component: () => import('@/views/Tools/ToolHome.vue'), meta: { title: '工具首页', icon: 'AppstoreOutlined', description: '浏览和搜索XHL Tools提供的所有在线工具，包括编解码工具、加密工具、数字工具、媒体工具等，快速找到您需要的工具' } },
          {
            path: 'codec-tool', name: 'CodecTool', meta: { title: '编解码工具' },
            children: [
              { path: 'base64-tool', name: 'Base64Tool', component: () => import('@/views/Tools/CodecTool/Base64Tool.vue'), meta: { title: 'Base64编解码', icon: 'CodeOutlined', description: '在线Base64编码和解码工具，支持文本的Base64格式转换，加密解密双向操作，简单易用完全免费' } },
              { path: 'qr-code', name: 'QrCode', component: () => import('@/views/Tools/CodecTool/QRCode.vue'), meta: { title: '二维码生成器', icon: 'QrcodeOutlined', description: '免费在线二维码生成器，支持自定义内容和样式设置，输入文本、网址等内容即可快速生成高清二维码图片' } },
              { path: 'aes-tool', name: 'AesTool', component: () => import('@/views/Tools/CodecTool/AesTool.vue'), meta: { title: 'AES加解密工具', icon: 'LockOutlined', description: '在线AES加密和解密工具，支持多种密钥长度和加密模式，保护您的敏感数据安全，简单易用无需安装' } },
              { path: 'json-formatter', name: 'JsonFormatter', component: () => import('@/views/Tools/CodecTool/JsonFormatter.vue'), meta: { title: 'JSON格式化工具', icon: 'CodeOutlined', description: '在线JSON格式化、压缩和校验工具，美化JSON结构便于阅读，或压缩JSON减少体积，支持JSON语法错误检测' } },
            ]
          },
          {
            path: 'number-tool', name: 'NumberTool', meta: { title: '数字工具' },
            children: [
              { path: 'stopwatch-tool', name: 'StopwatchTool', component: () => import('@/views/Tools/NumberTool/StopwatchTool.vue'), meta: { title: '在线秒表计时器', icon: 'ClockCircleOutlined', description: '免费在线秒表计时器，精准计时支持毫秒精度，提供开始、暂停、重置、分段计时等功能，适用于运动计时、考试计时等场景' } },
              { path: 'password-generator', name: 'PasswordGenerator', component: () => import('@/views/Tools/NumberTool/PasswordGenerator.vue'), meta: { title: '密码生成器', icon: 'KeyOutlined', description: '在线随机密码生成器，支持自定义密码长度和字符类型（大小写字母、数字、特殊符号），生成安全可靠的随机密码保护您的账户' } },
              { path: 'dice-tool', name: 'DiceTool', component: () => import('@/views/Tools/NumberTool/DiceTool.vue'), meta: { title: '在线骰子模拟器', icon: 'TableOutlined', description: '免费在线骰子模拟器工具，支持1-6面骰子仿真投掷，自定义骰子数量和面数，适用于桌游、游戏等需要随机数的场景' } },
            ]
          },
          {
            path: 'media-tool', name: 'MediaTool', meta: { title: '媒体工具' },
            children: [
              { path: 'rpgmvp-to-png', name: 'RpgmvpToPng', component: () => import('@/views/Tools/MediaTool/RpgmvpToPng.vue'), meta: { title: 'RPGMVP转PNG工具', icon: 'FileImageOutlined', description: '在线RPG Maker图片格式转换工具，将加密的MVP格式图片批量转换为通用的PNG格式，方便图片查看和编辑' } },
              { path: 'color-picker', name: 'ColorPicker', component: () => import('@/views/Tools/MediaTool/ColorPickerTool.vue'), meta: { title: '颜色拾取器', icon: 'BgColorsOutlined', description: '在线颜色拾取和转换工具，支持HEX、RGB、RGBA、HSL、HSLA等多种颜色格式相互转换，一键复制颜色代码' } },
            ]
          },
          {
            path: 'mock-tool', name: 'MockTool', meta: { title: 'Mock工具' },
            children: [
              { path: 'mock-data-generator', name: 'MockDataGenerator', component: () => import('@/views/Tools/MockTool/MockDataGenerator.vue'), meta: { title: 'Mock数据生成器', icon: 'DatabaseOutlined', description: '在线Mock测试数据生成工具，支持生成姓名、身份证、邮箱、手机号等预置字段，以及数字、字符串、单多选、布尔值等自定义字段，适用于前端开发测试' } },
            ]
          },
        ]
      },
    ]
  }
]
