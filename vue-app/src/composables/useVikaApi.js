import { VIKA_TOKEN, DATASHEET_ID } from '../constants/config.js'

const API_BASE = `https://api.vika.cn/fusion/v1/datasheets/${DATASHEET_ID}/records`

export function saveToSheet(user) {
  console.log('准备保存数据:', user)

  return fetch(API_BASE, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + VIKA_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            nickname: user.nickname,
            animal: user.animal,
            loc: user.loc,
            q1: user.answers.q1,
            q2: user.answers.q2,
            q3: user.answers.q3,
          },
        },
      ],
    }),
  })
    .then((response) => {
      console.log('响应状态:', response.status)
      return response.json()
    })
    .then((data) => {
      console.log('保存成功:', data)
      if (data.success) {
        console.log('数据已成功保存到维格表')
      } else {
        console.error('保存失败，响应数据:', data)
      }
    })
    .catch((err) => {
      console.error('保存出错:', err)
    })
}

export function loadFromSheet() {
  return fetch(API_BASE, {
    headers: { Authorization: 'Bearer ' + VIKA_TOKEN },
  })
    .then((res) => res.json())
    .then((json) => {
      if (!json.success) return []

      const users = json.data.records.map((item) => ({
        nickname: item.fields.nickname || '',
        animal: item.fields.animal || 'fire/fox.png',
        loc: item.fields.loc || '',
        answers: {
          q1: item.fields.q1 || '',
          q2: item.fields.q2 || '',
          q3: item.fields.q3 || '',
        },
        createTime: item.fields.time || '',
      }))

      console.log('加载成功，用户数量:', users.length)
      return users
    })
    .catch((err) => {
      console.log('加载失败', err)
      return []
    })
}

export function saveSuggestionToSheet(suggest) {
  return fetch(API_BASE, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + VIKA_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            suggest,
          },
        },
      ],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('建议保存返回:', data)
    })
    .catch((err) => {
      console.error('建议保存出错:', err)
    })
}
