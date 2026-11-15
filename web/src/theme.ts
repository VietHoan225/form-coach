// Chế độ sáng/tối và đọc token màu cho canvas. Màu nằm ở theme.css (chép từ DESIGN.md);
// Đồng bộ data-theme, màu thanh trình duyệt và favicon; nhớ lựa chọn trong trình duyệt.
import favicon from '../public/favicon.svg?raw'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'formcoach-theme'
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

/** Lựa chọn người dùng đã bấm, hoặc null nếu chưa chọn (theo máy). */
export function storedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null // chế độ riêng tư hoặc bị chặn lưu trữ: theo máy
  }
}

/** Đặt data-theme trên <html>; null = bỏ thuộc tính, theo cài đặt của máy. */
export function applyTheme(theme: Theme | null): void {
  if (theme) document.documentElement.dataset.theme = theme
  else delete document.documentElement.dataset.theme
  // Metadata và ảnh SVG độc lập không kế thừa biến CSS: truyền giá trị token hiện tại vào.
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = cssVar('color-bg')
  const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (icon) {
    const style = `--color-accent:${cssVar('color-accent')};--color-on-accent:${cssVar('color-on-accent')}`
    icon.href = `data:image/svg+xml,${encodeURIComponent(favicon.replace('<svg ', `<svg style="${style}" `))}`
  }
}

/** Chế độ đang hiển thị (đã chọn tay, hoặc theo máy). */
export function currentTheme(): Theme {
  return storedTheme() ?? (darkQuery().matches ? 'dark' : 'light')
}

/** Chọn tay một chế độ, nhớ cho lần mở sau. */
export function setTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // không lưu được thì chỉ đổi cho lần mở này
  }
  applyTheme(theme)
}

/** Theo dõi khi máy đổi sáng/tối (chỉ có tác dụng khi chưa chọn tay). Trả hàm huỷ. */
export function onSystemThemeChange(callback: () => void): () => void {
  const q = darkQuery()
  q.addEventListener('change', callback)
  return () => q.removeEventListener('change', callback)
}

/** Giá trị một token CSS (vd 'color-stage'), cho canvas: canvas không hiểu `var(--...)`. */
export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()
}
