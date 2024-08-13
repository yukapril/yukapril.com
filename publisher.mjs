import {Octokit} from 'octokit'
import CryptoJS from 'crypto-js'
import CryptoBase64 from 'crypto-js/enc-base64.js'

const auth = process.env.GH_AUTH_SECRET
const owner = 'yukapril'
const repo = 'yukapril.com'

const octokit = new Octokit({auth})

const Base64 = str => {
  const wordArray = CryptoJS.enc.Utf8.parse(str)
  return CryptoBase64.stringify(wordArray)
}

const getGistList = async () => {
  const {data} = await octokit.request({
    url: `GET /users/${owner}/gists`,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  // console.log('获取 gistList', JSON.stringify(data))
  return data
}

const getGist = async (gistId) => {
  const {data} = await octokit.request({
    url: `GET /gists/${gistId}`,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  // console.log('获取 gist', JSON.stringify(data))
  return data
}

const delGist = async (gistId) => {
  const response = await octokit.request({
    url: `DELETE /gists/${gistId}`,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  return response.status === 204
}

const uploadContent = async (filename, content, branch) => {
  const year = filename.match(/^\d{4}/)[0]
  const path = `source/_posts/${year}/${filename}`
  const {data} = await octokit.request({
    url: `/repos/${owner}/${repo}/contents/${path}`,
    method: 'PUT',
    data: {
      message: `add files ${filename}`,
      committer: {
        name: 'actions-bot',
        email: 'i@yukapril.com',
      },
      author: {
        name: 'yukapril',
        email: 'i@yukapril.com',
      },
      content: Base64(content),
      branch,
    },
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  // console.log('上传文件', JSON.stringify(data))
  return data
}

const main = async () => {
  const gists = await getGistList()

  for (const gist of gists) {
    for (const [key, gistFile] of Object.entries(gist.files)) {
      if (/^\d{4}-\d{2}-\d{2}/.test(gistFile.filename)) {
        console.log(`[FIND] find available gist, gistId=${gist.id}, filename=${gistFile.filename}`)
        const gistInfo = await getGist(gist.id)

        for (const [gistFileKey, gistFileInfo] of Object.entries(gistInfo.files)) {
          console.log(`[QUERY] query content, gistId=${gist.id}, length=${gistFileInfo.content.length}`)
          const uploadResult = await uploadContent(gistFile.filename, gistFileInfo.content, 'master')
          if (uploadResult?.commit?.sha) {
            console.log(`[UPLOAD] upload success! gistId=${gist.id}`)
            const result = await delGist(gist.id)
            if (result) {
              console.log(`[DELETE] delete success! gistId=${gist.id}`)
            }
          }
        }
      }
    }
  }
}

main()
