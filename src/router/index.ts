// =========================================================
// ⚠️ 此文件由 scripts/generate-routes.ts 自动生成
// ⚠️ 请勿手动修改！修改 src/constants/tool-routes.json 后自动同步
// =========================================================

export const routes = [
  {
    path: '/', redirect: '/home',
    children: [
      { path: '/home', name: 'Home', component: () => import('@/views/HomePage.vue'), meta: { title: '首页', description: 'XHL Tools 收录多种常用在线工具，支持编解码、加密解密、数字处理、媒体转换等功能。所有工具在浏览器本地运行，数据不会上传到服务器，安全可靠。点击「立即开始」进入工具页面，选择所需工具即可使用。', seoDescription: 'XHL Tools是开源免费的在线工具箱，提供Base64编解码、二维码生成、AES加密、JSON格式化、密码生成器、Mock数据等开发工具。无需注册，打开即可使用' } },
      {
        path: '/tools', name: 'Tools', redirect: '/tools/tool-home', component: () => import('@/components/SideMenuPage.vue'), meta: { title: '工具' },
        children: [
          { path: 'tool-home', name: 'ToolHome', component: () => import('@/views/Tools/ToolHome.vue'), meta: { title: '工具首页', icon: 'AppstoreOutlined', description: '在此浏览 XHL Tools 所有工具，按分类快速定位。支持搜索功能，输入关键词即可找到相关工具，点击即可跳转使用。', seoDescription: 'XHL Tools在线工具箱首页，收录编解码、加密、数字、媒体、Mock工具等分类。无需注册，打开即可使用，帮助快速找到所需工具' } },
          {
            path: 'codec-tool', name: 'CodecTool', meta: { title: '编解码工具' },
            children: [
              { path: 'base64-tool', name: 'Base64Tool', component: () => import('@/views/Tools/CodecTool/Base64Tool.vue'), meta: { title: 'Base64 编解码', icon: 'CodeOutlined', description: '输入待处理的文本内容，点击「编码」按钮将文本转换为 Base64 格式，或点击「解码」将 Base64 内容还原为原始文本。编码结果自动复制到剪贴板。', seoDescription: '在线Base64编码和解码工具，支持文本的Base64格式转换，编码解码双向操作，简单易用无需注册。适用于数据编码、URL参数处理等场景' } },
              { path: 'qr-code', name: 'QrCode', component: () => import('@/views/Tools/CodecTool/QRCode.vue'), meta: { title: '二维码生成器', icon: 'QrcodeOutlined', description: '在文本框中输入任意内容（文本、网址、邮箱、电话等），选择纠错级别后点击「下载」按钮即可生成并保存二维码图片。纠错级别越高，二维码可被遮挡的面积越大。', seoDescription: '免费在线二维码生成器，输入文本、网址等内容即可生成高清二维码。提供多种纠错级别选择，一键下载为PNG格式' } },
              { path: 'aes-tool', name: 'AesTool', component: () => import('@/views/Tools/CodecTool/AesTool.vue'), meta: { title: 'AES 加解密', icon: 'LockOutlined', description: '输入待加密或解密的文本内容，设置密钥（支持 128/192/256 位密钥长度），点击「加密」或「解密」按钮完成操作。注意：加密和解密需使用相同的密钥。', seoDescription: '在线AES加密和解密工具，支持AES-128/192/256多种密钥长度，采用ECB加密模式。保护敏感数据安全，简单易用，无需注册即可使用' } },
              { path: 'json-formatter', name: 'JsonFormatter', component: () => import('@/views/Tools/CodecTool/JsonFormatter.vue'), meta: { title: 'JSON 格式化', icon: 'CodeOutlined', description: '粘贴或输入 JSON 字符串，点击「格式化」按钮美化结构（增加缩进和换行，便于阅读），或点击「压缩」减少体积。支持语法错误检测，格式错误时会有提示。处理完成后点击「复制」获取结果。', seoDescription: '在线JSON格式化、压缩和校验工具，美化JSON结构或压缩减少体积，支持语法错误检测。适用于API调试和数据美化' } },
              { path: 'qr-code-parser', name: 'QrCodeParser', component: () => import('@/views/Tools/CodecTool/QrCodeParserTool.vue'), meta: { title: '二维码解析器', icon: 'ScanOutlined', description: '上传包含二维码的图片，点击「解析二维码」按钮即可识别图片中的二维码内容。支持 PNG / JPG / WEBP 等常见图片格式，解析结果支持一键复制。所有处理在浏览器本地完成，图片不会上传到服务器。', seoDescription: '免费在线二维码解析识别工具，上传二维码图片即可解码识别内容。支持PNG、JPG、WEBP等格式，本地解析不上传服务器，隐私安全' } },
              { path: 'url-code-tool', name: 'UrlCodeTool', component: () => import('@/views/Tools/CodecTool/UrlCodeTool.vue'), meta: { title: 'URL 编解码', icon: 'LinkOutlined', description: '输入待处理的文本内容，点击「编码」将特殊字符转换为 URL 安全格式（%xx），或点击「解码」将 %xx 格式还原为原始字符。编码结果自动复制到剪贴板。', seoDescription: '免费在线URL编码和解码工具，将特殊字符转换为URL安全格式，支持中文等Unicode字符编码解码。适用于API请求参数处理、URL参数传递等场景' } },
              { path: 'encoding-fixer', name: 'EncodingFixer', component: () => import('@/views/Tools/CodecTool/EncodingFixer.vue'), meta: { title: '编码乱码修复器', icon: 'WarningOutlined', description: '粘贴或输入显示为乱码的文本，点击「自动检测修复」自动识别编码问题并修复，支持中文 GBK/Big5、日文 Shift_JIS、韩文 EUC-KR 等常见编码乱码。自动修复不准确时可在手动修复中指定编码组合。', seoDescription: '编码乱码修复器，自动检测并修复中文GBK/Big5、日文Shift_JIS、韩文EUC-KR等编码问题。支持Latin-1互转，自动评分推荐最佳方案，本地处理不上传服务器' } },
              { path: 'opml-viewer', name: 'OpmlViewer', component: () => import('@/views/Tools/CodecTool/OpmlViewer.vue'), meta: { title: 'OPML 可视化', icon: 'ApartmentOutlined', description: '粘贴 OPML 内容或上传 .opml 文件，点击「解析渲染」按钮即可将大纲结构可视化为可折叠的树形视图。支持 RSS 订阅列表和思维导图大纲的解析展示。', seoDescription: 'OPML在线可视化工具，将RSS订阅列表和大纲文件解析为可交互的树形结构，支持粘贴和文件上传，本地解析不上传服务器' } },
            ]
          },
          {
            path: 'number-tool', name: 'NumberTool', meta: { title: '数字工具' },
            children: [
              { path: 'stopwatch-tool', name: 'StopwatchTool', component: () => import('@/views/Tools/NumberTool/StopwatchTool.vue'), meta: { title: '秒表计时器', icon: 'ClockCircleOutlined', description: '点击「启动」开始计时，「停止」暂停计时，「重置」清零。计时过程中可点击「掐表」记录分段时间，所有记录会显示在列表中。计时精度达毫秒级别。', seoDescription: '免费在线秒表计时器，毫秒精度，支持开始、暂停、重置、分段计时。适用于运动计时、考试计时、演讲计时等场景' } },
              { path: 'password-generator', name: 'PasswordGenerator', component: () => import('@/views/Tools/NumberTool/PasswordGenerator.vue'), meta: { title: '密码生成器', icon: 'KeyOutlined', description: '设置密码长度（1-60位），勾选是否包含大写字母、小写字母、数字、特殊字符，点击「重新生成」获取新密码，点击「复制密码」将结果复制到剪贴板。', seoDescription: '在线随机密码生成器，支持自定义长度和字符类型，生成1-60位安全密码。包含大小写字母、数字、特殊字符可选，一键复制简单快捷' } },
              { path: 'dice-tool', name: 'DiceTool', component: () => import('@/views/Tools/NumberTool/DiceTool.vue'), meta: { title: '骰子模拟器', icon: 'TableOutlined', description: '点击「掷骰子」按钮模拟投掷 1-6 面骰子，仿真模式下显示骰子动画效果，数字模式下直接显示结果。投掷记录会自动保存，方便查看历史。', seoDescription: '免费在线骰子模拟器，支持1-6面骰子仿真投掷，界面精美动画流畅，提供投掷记录功能。适用于桌游、游戏等需要随机数的场景' } },
            ]
          },
          {
            path: 'media-tool', name: 'MediaTool', meta: { title: '媒体工具' },
            children: [
              { path: 'rpgmvp-to-png', name: 'RpgmvpToPng', component: () => import('@/views/Tools/MediaTool/RpgmvpToPng.vue'), meta: { title: 'RPGMVP 转 PNG', icon: 'FileImageOutlined', description: '上传 .rpgmvp 格式的 RPG Maker MV 图片文件，点击「转换并下载」将图片转换为 PNG 格式。支持单文件转换和批量打包下载。', seoDescription: '在线RPG Maker图片格式转换工具，将MVP格式图片转换为PNG通用格式。支持单文件和批量转换，转换速度快，保留原始质量', source: { name: 'rpgmvp2png', url: 'https://github.com/DrRyanHuang/rpgmvp2png' } } },
              { path: 'color-picker', name: 'ColorPicker', component: () => import('@/views/Tools/MediaTool/ColorPickerTool.vue'), meta: { title: '颜色拾取器', icon: 'BgColorsOutlined', description: '使用颜色选择器选取颜色或输入颜色值，支持 HEX、RGB、RGBA、HSL 多种格式互转。点击任意格式卡片即可复制该格式的颜色代码。也可从预设颜色或历史记录中快速选择。', seoDescription: '在线颜色拾取和转换工具，支持HEX、RGB、RGBA、HSL等格式相互转换，一键复制颜色代码。适用于前端开发和UI设计' } },
            ]
          },
          {
            path: 'mock-tool', name: 'MockTool', meta: { title: 'Mock工具' },
            children: [
              { path: 'mock-data-generator', name: 'MockDataGenerator', component: () => import('@/views/Tools/MockTool/MockDataGenerator.vue'), meta: { title: 'Mock 数据生成器', icon: 'DatabaseOutlined', description: '点击「添加字段」选择字段类型（姓名、身份证、邮箱、手机号、数字、字符串、单多选、布尔值），设置生成数量后自动生成 JSON 格式的测试数据，点击「复制」获取结果。', seoDescription: '在线Mock测试数据生成工具，支持生成姓名、身份证、邮箱等预置字段及自定义字段。输出JSON格式，一键复制，提高开发联调效率' } },
            ]
          },
        ]
      },
    ]
  }
]
