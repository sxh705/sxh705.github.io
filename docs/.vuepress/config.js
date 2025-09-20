import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { hopeTheme } from "vuepress-theme-hope";

const navbar = [
  '/',
  '代码/',
  '体能/',
]

// 定义一个函数，用来从 Markdown 内容中提取超链接的文本
const extractLinkText = (content) => {
  // 正则表达式，匹配 [链接文本](链接地址)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const linkTexts = [];
  let match;

  // 循环匹配所有超链接
  while ((match = linkRegex.exec(content)) !== null) {
    // match[1] 是中括号里的链接文本
    linkTexts.push(match[1]);
  }
  return linkTexts;
};

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
        return extractLinkText(page.content);
      },
    },
    icon: {
      assets: 'iconify'
    }
  }
})

export default defineUserConfig({
  bundler: viteBundler(),
  theme,
  title: 'sxh-blog',
  lang: 'zh-CN'

})