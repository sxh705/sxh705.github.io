import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import {hopeTheme} from "vuepress-theme-hope";

const navbar = [
  '/',
  '代码/',
  '体能/',
]

const theme = hopeTheme({
  hotReload: true,
  encrypt: {
    config: {
      '/归档/': '7051'
    }
  },
  navbar,
  plugins: {
    search: true,
    icon: {
      assets: 'iconify'
    }
  }
})

export default defineUserConfig({
  bundler: viteBundler(),
  theme,
  title: 'sxh-blog'
})