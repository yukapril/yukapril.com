import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import './index.css'

export default function Home () {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={ `首页` }
      description="首页">
      <main className="home-page">
        <h2>构建自己的知识森林</h2>
      </main>
    </Layout>
  )
}
