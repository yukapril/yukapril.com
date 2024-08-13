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
  const {data} = await octokit.request(`GET /users/${owner}/gists`, {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  // console.log('获取 gistList', JSON.stringify(data))
  return data
}

const getGist = async gistId => {
  const {data} = await octokit.request(`GET /gists/${gistId}`, {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  // console.log('获取 gist', JSON.stringify(data))
  return data
}

const delGist = async gistId => {
  const {status} = await octokit.request(`DELETE /gists/${gistId}`, {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  return status === 204
}

const uploadContent = async (filename, content, branch) => {
  const year = filename.match(/^\d{4}/)[0]
  const path = `source/_posts/${year}/${filename}`
  const {data} = await octokit.request(`PUT /repos/${owner}/${repo}/contents/${path}`, {
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
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  // console.log('上传文件', JSON.stringify(data))
  return data
}

const main = async () => {
  const gists = await getGistList()
  gists.forEach(gist => {
    Object.keys(gist.files).forEach(async key => {
      const gistFile = gist.files[key]
      if (/^\d{4}-\d{2}-\d{2}/.test(gistFile.filename)) {
        console.log(`[FIND] find available gist, gistId=${gist.id}, filename=${gistFile.filename}`)
        const gistInfo = await getGist(gist.id)
        for (const gistFileKey of Object.keys(gistInfo.files)) {
          const gistFileInfo = gistInfo.files[gistFileKey]
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
    })
  })
}

main()
