import { assetUrl } from './assetUrl.js'

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

export function splitUsers(allUsers, localUser = null) {
  const sorted = [...allUsers].sort(
    (a, b) => new Date(b.createTime || 0) - new Date(a.createTime || 0)
  )

  let bottomUsers
  if (localUser?.nickname) {
    const match = sorted.find((u) => isSameUser(u, localUser))
    if (match) {
      const others = shuffle(sorted.filter((u) => !isSameUser(u, match))).slice(0, 4)
      bottomUsers = [match, ...others]
    } else {
      bottomUsers = shuffle(sorted).slice(0, 5)
    }
  } else {
    bottomUsers = shuffle(sorted).slice(0, 5)
  }

  const topUsers = sorted.filter(
    (u) => !bottomUsers.some((b) => isSameUser(u, b))
  )
  return { bottomUsers, topUsers }
}

/** 本地用户居中，其余随机分左右 */
export function orderBottomUsers(bottomUsers, localUser = null) {
  if (!bottomUsers.length) return { ordered: [], centerIndex: 0 }

  if (!localUser?.nickname) {
    const ordered = shuffle([...bottomUsers])
    return { ordered, centerIndex: Math.floor((ordered.length - 1) / 2) }
  }

  const match = bottomUsers.find((u) => isSameUser(u, localUser))
  if (!match) {
    const ordered = shuffle([...bottomUsers])
    return { ordered, centerIndex: Math.floor((ordered.length - 1) / 2) }
  }

  const others = shuffle(bottomUsers.filter((u) => !isSameUser(u, match)))
  const leftCount = Math.floor(others.length / 2)
  const left = others.slice(0, leftCount)
  const right = others.slice(leftCount)
  const ordered = [...left, match, ...right]

  return { ordered, centerIndex: left.length }
}

export function normalizeAnimalPath(animal) {
  if (!animal) return assetUrl('fire/fox.png')
  if (animal.startsWith('http')) return animal
  if (animal.includes('campfire-with-us/') || animal.startsWith(import.meta.env.BASE_URL)) {
    return animal
  }
  const path = animal.replace(/^\//, '')
  return assetUrl(path)
}
