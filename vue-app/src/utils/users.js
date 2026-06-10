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

export function normalizeAnimalPath(animal) {
  if (!animal) return '/fire/fox.png'
  if (animal.startsWith('/')) return animal
  if (animal.startsWith('fire/')) return '/' + animal
  return animal
}
