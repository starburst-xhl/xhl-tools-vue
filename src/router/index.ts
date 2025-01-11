import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
              meta: {title: '工具首页'}
            },
            {
              path: 'codec-tool',
              meta: {title: '编解码工具'},
              children: [
                {
                  path: 'base64-tool',
                  name: 'Base64Tool',
                  component: () => import('@/views/Tools/CodecTool/Base64Tool.vue'),
                  meta: {title: 'Base64编解码'}
                },
                {
                  path: 'qr-code',
                  name: 'QRCode',
                  component: () => import('@/views/Tools/CodecTool/QRCode.vue'),
                  meta: {title: '二维码生成'}
                }
              ],
            },
            {
              path: 'aes-tool',
              name: 'AESTool',
              component: () => import('@/views/Tools/AesTool.vue'),
              meta: {title: 'AES加解密'}
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
                  meta: {title: '秒表'}
                },
                {
                  path: 'password-generator',
                  name: 'PasswordGenerator',
                  component: () => import('@/views/Tools/NumberTool/PasswordGenerator.vue'),
                  meta: {title: '密码生成器'}
                },
              ]
            },
            {
              path: 'chat-tool',
              name: 'ChatTool',
              meta: {title: '聊天工具'},
              children: [],
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
                  meta: {title: 'RPGMVP转PNG'}
                }
              ],
            },
          ]
        }
      ]
    }
  ],
})

export default router
