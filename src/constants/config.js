export const VIKA_TOKEN = 'uskCXrXOQATxrJcZPAJ7PjV'
export const DATASHEET_ID = 'dstZ3jSLdA6d9FA8WX'
export const STORAGE_KEY = 'together-current-user'

export const ANIMAL_OPTIONS = [
  { src: '/fire/fox.png', alt: '狐狸' },
  { src: '/fire/horse.png', alt: '马' },
  { src: '/fire/bear.png', alt: '熊' },
  { src: '/fire/rabbit.png', alt: '兔子' },
  { src: '/fire/cat.png', alt: '猫' },
  { src: '/fire/sheep.png', alt: '羊' },
]

export const PRELOAD_IMAGES = [
  '/fire/fox.png',
  '/fire/horse.png',
  '/fire/bear.png',
  '/fire/rabbit.png',
  '/fire/cat.png',
  '/fire/sheep.png',
  '/fire/firegiif.gif',
  '/fire/bg.png',
]

export function createEmptyUser() {
  return {
    nickname: '',
    animal: '',
    loc: '',
    answers: { q1: '', q2: '', q3: '' },
  }
}
