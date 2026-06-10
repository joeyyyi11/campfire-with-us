export function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function isSameUser(a, b) {
  return (
    a.nickname === b.nickname &&
    a.animal === b.animal &&
    a.answers.q1 === b.answers.q1 &&
    a.answers.q2 === b.answers.q2 &&
    a.answers.q3 === b.answers.q3
  )
}

export function splitUsers(allUsers) {
  const sorted = [...allUsers].sort(
    (a, b) => new Date(b.createTime || 0) - new Date(a.createTime || 0)
  )
  const bottomUsers = shuffle(sorted).slice(0, 6)
  const topUsers = sorted.filter(
    (u) => !bottomUsers.some((b) => isSameUser(u, b))
  )
  return { bottomUsers, topUsers }
}

import { assetUrl } from './assetUrl.js'

export function normalizeAnimalPath(animal) {
  if (!animal) return assetUrl('fire/fox.png')
  if (animal.startsWith('http')) return animal
  if (animal.includes('campfire-with-us/') || animal.startsWith(import.meta.env.BASE_URL)) {
    return animal
  }
  const path = animal.replace(/^\//, '')
  return assetUrl(path)
}
