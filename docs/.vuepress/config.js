import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { hopeTheme } from "vuepress-theme-hope";
const navbar = [
  '/',
  '体能/',
  '代码/',
]

const theme = hopeTheme({
  // hotReload: true,
  encrypt: {
    config: {
      '/归档/': '7051'
    }
  },
  navbar,
  plugins: {
    search: {
      getExtraFields: (page) => {
        const content = page.content.slice(0, 1e5)
        const lines = content.split('\n').filter(line => line.trim().length > 0);
        // console.log('7051', content.slice(0, 10))
        return lines
      }
    },
    icon: {
      assets: 'iconify'
    },
  },
  markdown: {
    imgLazyload: true,
    imgSize: true
  }
})

export default defineUserConfig({
  bundler: viteBundler(),
  theme,
  title: 'sxh-blog',
  lang: 'zh-CN'
})