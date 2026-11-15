import { useCallback, useLayoutEffect, useRef } from 'react'

/** Một nền chọn dùng chung; trượt liên tục tới link có aria-current, kể cả khi bấm nhanh. */
export default function NavIndicator({ activeTab }: { activeTab: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const animationRef = useRef<Animation | null>(null)
  const targetRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null)

  const move = useCallback((animate: boolean) => {
    const indicator = ref.current
    const nav = indicator?.parentElement
    if (!indicator || !nav) return
    const active = nav.querySelector<HTMLAnchorElement>('a[aria-current="page"]')
    if (!active || active.getClientRects().length === 0) {
      animationRef.current?.cancel()
      indicator.hidden = true
      targetRef.current = null
      return
    }

    const next = { x: active.offsetLeft, y: active.offsetTop, width: active.offsetWidth, height: active.offsetHeight }
    const last = targetRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // ResizeObserver cũng có thể báo lại dù đích không đổi; đừng ngắt chuyển động đang chạy.
    if (!animate && !reduced && last && next.x === last.x && next.y === last.y && next.width === last.width && next.height === last.height) return

    // Đọc vị trí đang vẽ TRƯỚC khi hủy chuyển động cũ để bấm nhanh không nhảy về đích cũ.
    const previous = indicator.hidden ? null : indicator.getBoundingClientRect()
    animationRef.current?.cancel()
    indicator.hidden = false
    targetRef.current = next
    indicator.style.width = `${next.width}px`
    indicator.style.height = `${next.height}px`
    const target = `translate(${next.x}px, ${next.y}px)`
    indicator.style.transform = target

    if (!animate || !previous || reduced) return
    const bounds = nav.getBoundingClientRect()
    const style = getComputedStyle(indicator)
    // Bản build có thể chuẩn hóa 320ms thành .32s; Web Animations API luôn nhận mili giây.
    const duration = style.getPropertyValue('--motion-slow').trim()
    // FLIP: đổi kích thước nền tuyệt đối rồi animate transform; không animate layout của tab.
    animationRef.current = indicator.animate(
      [
        { transform: `translate(${previous.left - bounds.left - nav.clientLeft}px, ${previous.top - bounds.top - nav.clientTop}px) scale(${previous.width / active.offsetWidth}, ${previous.height / active.offsetHeight})` },
        { transform: target },
      ],
      {
        duration: parseFloat(duration) * (duration.endsWith('ms') ? 1 : 1000),
        easing: style.getPropertyValue('--motion-ease').trim(),
      },
    )
  }, [])

  useLayoutEffect(() => move(true), [activeTab, move])

  useLayoutEffect(() => {
    const nav = ref.current?.parentElement
    if (!nav) return
    let disposed = false
    const resize = () => move(false)
    const observer = new ResizeObserver(resize)
    observer.observe(nav)
    nav.querySelectorAll('a').forEach((link) => observer.observe(link))
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    motion.addEventListener('change', resize)
    document.fonts.ready.then(() => { if (!disposed) resize() })
    return () => {
      disposed = true
      observer.disconnect()
      motion.removeEventListener('change', resize)
      animationRef.current?.cancel()
    }
  }, [move])

  return <span ref={ref} className="nav-indicator" aria-hidden="true" hidden />
}
