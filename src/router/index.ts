export const routes = [
  {
    path: '/',
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/HomePage.vue'),
        meta: {title: '首页'}
      },
      {
        path: '/tools',
        name: 'tools',
        redirect: '/tools/tool-home',
        component: () => import('@/components/SideMenuPage.vue'),
        meta: {title: '工具'},
        children: [
          {
            path: 'tool-home',
            name: 'ToolHome',
            component: () => import('@/views/Tools/ToolHome.vue'),
            meta: {
              title: '工具首页',
              icon: 'AppstoreOutlined',
              description: '浏览和搜索所有可用工具，快速找到您需要的工具'
            }
          },
          {
            path: 'codec-tool',
            meta: {title: '编解码工具'},
            children: [
              {
                path: 'base64-tool',
                name: 'Base64Tool',
                component: () => import('@/views/Tools/CodecTool/Base64Tool.vue'),
                meta: {
                  title: 'Base64编解码',
                  icon: 'CodeOutlined',
                  description: 'Base64编码和解码工具，支持文本的Base64格式转换'
                }
              },
              {
                path: 'qr-code',
                name: 'QRCode',
                component: () => import('@/views/Tools/CodecTool/QRCode.vue'),
                meta: {
                  title: '二维码生成',
                  icon: 'QrcodeOutlined',
                  description: '快速生成二维码，支持自定义内容和样式'
                }
              },
              {
                path: 'aes-tool',
                name: 'AESTool',
                component: () => import('@/views/Tools/CodecTool/AesTool.vue'),
                meta: {
                  title: 'AES加解密',
                  icon: 'LockOutlined',
                  description: 'AES加密和解密工具，保护您的数据安全'
                }
              },
              {
                path: 'json-formatter',
                name: 'JsonFormatter',
                component: () => import('@/views/Tools/CodecTool/JsonFormatter.vue'),
                meta: {
                  title: 'JSON格式化',
                  icon: 'CodeOutlined',
                  description: 'JSON格式化和压缩工具，美化或压缩JSON数据'
                }
              }
            ],
          },
          {
            path: 'number-tool',
            name: 'NumberTool',
            meta: {title: '数字工具'},
            children: [
              {
                path: 'stopwatch-tool',
                name: 'StopwatchTool',
                component: () => import('@/views/Tools/NumberTool/StopwatchTool.vue'),
                meta: {
                  title: '秒表',
                  icon: 'ClockCircleOutlined',
                  description: '精准计时工具，支持开始、暂停、重置等操作'
                }
              },
              {
                path: 'password-generator',
                name: 'PasswordGenerator',
                component: () => import('@/views/Tools/NumberTool/PasswordGenerator.vue'),
                meta: {
                  title: '密码生成器',
                  icon: 'KeyOutlined',
                  description: '生成安全的随机密码，支持自定义长度和字符类型'
                }
              },
            ]
          },
          {
            path: 'media-tool',
            name: 'MediaTool',
            meta: {title: '媒体工具'},
            children: [
              {
                path: 'rpgmvp-to-png',
                name: 'RPGMVPToPNG',
                component: () => import('@/views/Tools/MediaTool/RpgmvpToPng.vue'),
                meta: {
                  title: 'RPGMVP转PNG',
                  icon: 'FileImageOutlined',
                  description: '将RPG Maker加密图片格式转换为PNG格式',
                  source: {
                    name: 'rpgmvp2png',
                    url: 'https://github.com/DrRyanHuang/rpgmvp2png'
                  }
                }
              },
              {
                path: 'color-picker',
                name: 'ColorPicker',
                component: () => import('@/views/Tools/MediaTool/ColorPickerTool.vue'),
                meta: {
                  title: '颜色拾取器',
                  icon: 'BgColorsOutlined',
                  description: '颜色拾取器，支持HEX、RGB、HSL多种格式转换和复制'
                }
              }
            ],
          },
        ]
      }
    ]
  }
]
