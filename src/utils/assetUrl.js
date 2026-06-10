/** GitHub Pages 子路径部署时，给 public 资源加上正确前缀 */
export function assetUrl(path) {
  const base = import.meta.env.BASE_URL
  const clean = path.replace(/^\//, '')
  return `${base}${clean}`
}
