const {themes} = require('prism-react-renderer')
const lightTheme = themes.github
const darkTheme = themes.dracula
const math = require('remark-math')
const katex = require('rehype-katex')
const navbar = require('./docusaurus.config.navbars')

const HOST = 'https://www.yukapril.com'

const config = {
  title: '知识森林',
  tagline: '知识森林',
  favicon: 'img/favicon.ico',
  url: HOST,
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          path: 'docs',
          sidebarPath: require.resolve('./docusaurus.config.sidebars.js'),
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        blog: {
          routeBasePath: '/blog',
          path: 'blog',
          showReadingTime: true,
          remarkPlugins: [math],
          rehypePlugins: [katex],
          blogSidebarCount: 20,
          blogSidebarTitle: '最新文章',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        },
        gtag: {
          trackingID: 'G-6HJVVRZJEF',
          anonymizeIP: true
        }
      }
    ]
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css',
      type: 'text/css'
    }
  ],
  themeConfig: {
    navbar,
    footer: {
      style: 'dark',
      links: [
        {
          title: 'More',
          items: [
            {
              label: 'sitemap',
              href: HOST + '/sitemap.xml'
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} yukaPriL. Built with Docusaurus.`
    },
    prism: {
      theme: lightTheme,
      darkTheme: darkTheme,
      additionalLanguages: ['bash', 'diff', 'json'],
    },
    algolia: {
      appId: '6D2LJ97N5B',
      apiKey: 'f195fac5ce7bd9505a648c8c4218322c',  // 只读 API Key（不是管理员 Key）
      indexName: 'Blog And Docs',
      contextualSearch: false, // 是否开启上下文搜索
      searchParameters: {}, // 可选：传递给 Algolia API 的搜索参数
      insights: true, // 是否启用 Algolia Insights（可选）
    },
  },
  markdown: {
    mermaid: true,
  },
  themes: [
    '@docusaurus/theme-mermaid'
  ]
}

module.exports = config
