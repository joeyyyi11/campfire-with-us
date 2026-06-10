import { assetUrl } from '../utils/assetUrl.js'

export const VIKA_TOKEN = 'uskCXrXOQATxrJcZPAJ7PjV'
export const DATASHEET_ID = 'dstZ3jSLdA6d9FA8WX'
export const STORAGE_KEY = 'together-current-user'

export const ANIMAL_OPTIONS = [
  { src: assetUrl('fire/fox.png'), path: 'fire/fox.png', alt: '狐狸' },
  { src: assetUrl('fire/horse.png'), path: 'fire/horse.png', alt: '马' },
  { src: assetUrl('fire/bear.png'), path: 'fire/bear.png', alt: '熊' },
  { src: assetUrl('fire/rabbit.png'), path: 'fire/rabbit.png', alt: '兔子' },
  { src: assetUrl('fire/cat.png'), path: 'fire/cat.png', alt: '猫' },
  { src: assetUrl('fire/sheep.png'), path: 'fire/sheep.png', alt: '羊' },
]

export const PRELOAD_IMAGES = [
  assetUrl('fire/fox.png'),
  assetUrl('fire/horse.png'),
  assetUrl('fire/bear.png'),
  assetUrl('fire/rabbit.png'),
  assetUrl('fire/cat.png'),
  assetUrl('fire/sheep.png'),
  assetUrl('fire/firegiif.gif'),
  assetUrl('fire/bg.png'),
]

export function createEmptyUser() {
  return {
    nickname: '',
    animal: '',
    loc: '',
    answers: { q1: '', q2: '', q3: '' },
  }
}
