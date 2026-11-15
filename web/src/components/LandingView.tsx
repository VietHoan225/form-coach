import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import ThemeToggle from './ThemeToggle'
import './LandingView.css'

interface Props {
  onStart: () => void
  onLoginClick?: () => void
  isLoggedIn?: boolean
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

/** Mô phỏng một rep chống đẩy chuẩn kỹ thuật với góc khuỷu và toạ độ khớp nhảy theo thời gian thực */
function PushupAnimationFigure() {
  const [frame, setFrame] = useState({
    phase: 1, // 0 = đỉnh (162°), 1 = đáy (88°)
    angle: 88,
    repNum: 8,
    status: 'Đáy rep · 88° (Đạt chuẩn)',
  })

  useEffect(() => {
    // Nếu người dùng chọn giảm chuyển động trong hệ thống, giữ ở đáy rep tĩnh
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const CYCLE_MS = 3400
    const start = performance.now()
    let rafId: number

    const tick = (now: number) => {
      const elapsed = (now - start) % CYCLE_MS
      const t = elapsed / CYCLE_MS
      const cycleIndex = Math.floor((now - start) / CYCLE_MS)
      const currentRep = 8 + (cycleIndex % 3)

      let p = 0
      let statusText = 'Đỉnh rep · Khung thẳng'

      if (t < 0.12) {
        // Giữ ở đỉnh
        p = 0
        statusText = 'Đỉnh rep · Khung thẳng'
      } else if (t < 0.5) {
        // Hạ người có kiểm soát xuống đáy
        const progress = (t - 0.12) / 0.38
        p = easeInOut(progress)
        statusText = 'Đang hạ người...'
      } else if (t < 0.62) {
        // Giữ ở đáy rep
        p = 1
        statusText = 'Đáy rep · 88° (Đạt chuẩn)'
      } else if (t < 0.94) {
        // Đẩy người lên đỉnh
        const progress = (t - 0.62) / 0.32
        p = 1 - easeInOut(progress)
        statusText = 'Đang đẩy lên...'
      } else {
        // Về đỉnh hoàn thành
        p = 0
        statusText = `+1 Rep (${currentRep}) Hoàn thành!`
      }

      const calculatedAngle = Math.round(162 - (162 - 88) * p)

      setFrame({
        phase: p,
        angle: calculatedAngle,
        repNum: currentRep,
        status: statusText,
      })

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Toạ độ các điểm khớp tính theo phase (0: đỉnh -> 1: đáy)
  const p = frame.phase
  const headX = 48 + 2 * p
  const headY = 90 + 34 * p

  const shoulderX = 75
  const shoulderY = 102 + 34 * p

  const elbowX = 88 + 12 * p
  const elbowY = 131 + 5 * p

  const wristX = 100
  const wristY = 160

  const hipX = 165
  const hipY = 124 + 20 * p

  const kneeX = 222
  const kneeY = 142 + 10 * p

  const toeX = 280
  const toeY = 160

  // Cung đo góc khuỷu
  const arcRadius = 14
  const vWrist = { x: wristX - elbowX, y: wristY - elbowY }
  const lenWrist = Math.hypot(vWrist.x, vWrist.y) || 1
  const vShoulder = { x: shoulderX - elbowX, y: shoulderY - elbowY }
  const lenShoulder = Math.hypot(vShoulder.x, vShoulder.y) || 1

  const pWrist = {
    x: elbowX + (vWrist.x / lenWrist) * arcRadius,
    y: elbowY + (vWrist.y / lenWrist) * arcRadius,
  }
  const pShoulder = {
    x: elbowX + (vShoulder.x / lenShoulder) * arcRadius,
    y: elbowY + (vShoulder.y / lenShoulder) * arcRadius,
  }

  return (
    <div className="landing-demo-stage">
      <div className="landing-demo-header">
        <span className="landing-demo-status">
          <span className="landing-demo-dot" aria-hidden="true"></span>
          AI LIVE TRACKING (30 FPS)
        </span>
        <span className="landing-demo-badge">Rep 0{frame.repNum} · {frame.status}</span>
      </div>

      <div className="landing-demo-canvas-wrap">
        <svg viewBox="16 76 290 102" className="landing-demo-figure" role="img" aria-label={`Mô phỏng 1 rep chống đẩy, góc khuỷu ${frame.angle} độ`}>
          {/* Đường mặt sàn */}
          <line x1="20" y1="161" x2="300" y2="161" strokeWidth="2" strokeDasharray="4 6" opacity="0.3" style={{ stroke: 'var(--color-skeleton-joint)' }} />

          {/* Đầu */}
          <circle cx={headX} cy={headY} r="11" fill="none" strokeWidth="3.5" style={{ stroke: 'var(--color-skeleton-bone)' }} />

          {/* Thân người: Gáy -> Vai -> Hông -> Gối -> Mũi chân */}
          <polyline
            points={`${headX + 9},${headY + 6} ${shoulderX},${shoulderY} ${hipX},${hipY} ${kneeX},${kneeY} ${toeX},${toeY}`}
            fill="none"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ stroke: 'var(--color-skeleton-bone)' }}
          />

          {/* Cánh tay: Vai -> Khuỷu -> Cổ tay */}
          <polyline
            points={`${shoulderX},${shoulderY} ${elbowX},${elbowY} ${wristX},${wristY}`}
            fill="none"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ stroke: 'var(--color-skeleton-bone)' }}
          />

          {/* Cung đo góc khuỷu */}
          <path
            d={`M ${pShoulder.x.toFixed(1)} ${pShoulder.y.toFixed(1)} A ${arcRadius} ${arcRadius} 0 0 0 ${pWrist.x.toFixed(1)} ${pWrist.y.toFixed(1)}`}
            fill="none"
            strokeWidth="2.5"
            style={{ stroke: frame.angle <= 90 ? 'var(--color-skeleton-bone)' : 'var(--color-chart-left)' }}
          />
          <text
            x={elbowX - 32}
            y={elbowY + (p > 0.5 ? 18 : 10)}
            style={{
              fill: frame.angle <= 90 ? 'var(--color-skeleton-bone)' : 'var(--color-skeleton-joint)',
              fontSize: 'var(--text-label)',
              fontWeight: 700,
            }}
          >
            {frame.angle}°
          </text>

          {/* Khớp xương toạ độ */}
          <g style={{ fill: 'var(--color-skeleton-joint)' }}>
            {[
              [shoulderX, shoulderY],
              [elbowX, elbowY],
              [wristX, wristY],
              [hipX, hipY],
              [kneeX, kneeY],
              [toeX, toeY],
            ].map(([cx, cy], idx) => (
              <circle key={idx} cx={cx} cy={cy} r="4.5" />
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}

export default function LandingView({ onStart, onLoginClick, isLoggedIn = false }: Props) {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  const scrollToSteps = (e: React.MouseEvent) => {
    e.preventDefault()
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = document.getElementById('how-it-works')
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      target.focus({ preventScroll: true })
    }
  }

  // Phím Escape đóng modal quyền riêng tư nếu đang mở & khoá cuộn trang nền
  useEffect(() => {
    if (!showPrivacyModal) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowPrivacyModal(false)
    }
    window.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [showPrivacyModal])

  return (
    <div className="landing-view">
      {/* Skip link hỗ trợ người dùng khiếm thị / điều hướng bằng bàn phím */}
      <a href="#main-content" className="skip-link">
        Chuyển đến nội dung chính
      </a>

      <header className="landing-header" role="banner">
        <a className="landing-brand" href="#landing" aria-label="Form Coach - Trang chủ giới thiệu">
          <span className="landing-brand-badge" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 18h16M7 14l5-5 5 5" />
            </svg>
          </span>
          <span>Form Coach</span>
        </a>
        <div className="landing-nav-actions" role="navigation" aria-label="Tài khoản và giao diện">
          <ThemeToggle />
          {isLoggedIn ? (
            <a className="landing-login-btn" href="#dashboard" aria-label="Vào Dashboard">
              Dashboard
            </a>
          ) : (
            <button
              type="button"
              className="landing-login-btn"
              onClick={onLoginClick || onStart}
              aria-label="Đăng nhập tài khoản"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        {/* Khối Hero */}
        <section className="landing-hero landing-container" aria-labelledby="hero-title">
          <div className="landing-hero-tag">AI phân tích kỹ thuật qua camera</div>
          <h1 id="hero-title" className="landing-hero-title">
            Tập chống đẩy đúng kỹ thuật, ngay tại nhà.
          </h1>
          <p className="landing-hero-desc">
            Phân tích từng rep qua camera điện thoại — phát hiện hông võng, xuống nông, góc khuỷu chưa khoá để bạn sửa ngay ở hiệp sau.
          </p>
          <div className="landing-hero-actions">
            <button
              type="button"
              className="landing-cta-primary"
              onClick={onStart}
              aria-label={isLoggedIn ? 'Bắt đầu vào bài tập ngay' : 'Bắt đầu sử dụng Form Coach ngay'}
            >
              {isLoggedIn ? 'Vào tập ngay' : 'Bắt đầu ngay'}
            </button>
            <a
              className="landing-cta-secondary"
              href="#how-it-works"
              onClick={scrollToSteps}
              aria-label="Cuộn xuống xem 3 bước hoạt động"
            >
              Xem cách hoạt động ↓
            </a>
          </div>

          <div className="landing-trust-bar" role="list" aria-label="Cam kết của Form Coach">
            <span className="landing-trust-item" role="listitem">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              Video không rời máy
            </span>
            <span className="landing-trust-item" role="listitem">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Chạy trực tiếp trên web
            </span>
            <span className="landing-trust-item" role="listitem">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Hoàn toàn miễn phí
            </span>
          </div>

          {/* Khối Visual Demo: Mô phỏng camera AI chạy 1 rep thực thụ & Nhận xét Coach */}
          <div className="landing-demo-card" aria-label="Mô phỏng phân tích kỹ thuật push-up">
            <PushupAnimationFigure />

            {/* Lời nhận xét mẫu từ AI Coach */}
            <div className="landing-demo-coach">
              <div className="landing-demo-coach-header">
                <span className="landing-demo-coach-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <span className="landing-demo-coach-title">Đánh giá từ AI Coach</span>
                <span className="landing-demo-coach-tag">Hiệp 10 rep</span>
              </div>
              <p className="landing-demo-coach-text">
                <strong>8 rep chuẩn form liên tiếp!</strong> Biên độ sâu, thân người giữ thẳng từ gót chân đến gáy. Ở rep thứ 9, hông bắt đầu võng nhẹ 15° do xuống sức — hiệp sau chú ý siết cơ bụng chặt trước khi hạ người để bảo vệ lưng dưới nhé.
              </p>
            </div>
          </div>
        </section>

        {/* Khối Cách hoạt động */}
        <section id="how-it-works" tabIndex={-1} className="landing-section" aria-labelledby="steps-title">
          <div className="landing-container">
            <div className="landing-section-header">
              <span className="landing-section-eyebrow">Cách hoạt động</span>
              <h2 id="steps-title" className="landing-section-title">
                3 bước cho một hiệp tập chuẩn form
              </h2>
              <p className="landing-section-subtitle">
                Không cần cảm biến gắn thêm, chỉ cần điện thoại của bạn.
              </p>
            </div>
            <div className="landing-steps-grid">
              <article className="landing-step-card">
                <span className="landing-step-num" aria-hidden="true">1</span>
                <h3 className="landing-step-title">Đặt điện thoại nằm ngang</h3>
                <p className="landing-step-desc">
                  Đặt máy sát sàn, quay từ bên hông để thấy toàn thân. Màn Chuẩn bị sẽ đếm ngược 5 giây để bạn sẵn sàng vào tư thế.
                </p>
              </article>
              <article className="landing-step-card">
                <span className="landing-step-num" aria-hidden="true">2</span>
                <h3 className="landing-step-title">Tập luyện & Đếm rep</h3>
                <p className="landing-step-desc">
                  Mô hình vẽ khung xương 33 khớp và đếm rep trực tiếp trên máy. Số rep nhảy tức thì lúc bạn đang tập.
                </p>
              </article>
              <article className="landing-step-card">
                <span className="landing-step-num" aria-hidden="true">3</span>
                <h3 className="landing-step-title">Xem kết quả & Sửa form</h3>
                <p className="landing-step-desc">
                  Biết rõ rep nào đúng, rep nào xuống chưa đủ sâu hay hông võng. Bấm xem lại người que và đọc lời nhận xét của Coach AI.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Khối Cam kết & Thiết kế */}
        <section className="landing-section" aria-labelledby="features-title">
          <div className="landing-container">
            <div className="landing-section-header">
              <span className="landing-section-eyebrow">Bảo mật & Trải nghiệm</span>
              <h2 id="features-title" className="landing-section-title">
                Thiết kế để tôn trọng bạn
              </h2>
              <p className="landing-section-subtitle">
                Rèn luyện thói quen với công cụ hỗ trợ trung thực, bảo mật tuyệt đối.
              </p>
            </div>
            <div className="landing-features-grid">
              <article className="landing-feature-card">
                <div className="landing-feature-icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </div>
                <h3 className="landing-feature-title">Video không rời điện thoại</h3>
                <p className="landing-feature-desc">
                  Toạ độ khớp được trích xuất trực tiếp trong trình duyệt bằng MediaPipe. Máy chủ chỉ nhận số đo toạ độ, không nhận hình ảnh hay video của bạn.
                </p>
              </article>
              <article className="landing-feature-card">
                <div className="landing-feature-icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="landing-feature-title">Chấm điểm có số đo rõ ràng</h3>
                <p className="landing-feature-desc">
                  Không dùng màu đỏ phán xét. App chỉ ra góc khuỷu ở đáy từng rep so với mục tiêu và cho phép xem lại từng rep để bạn tự đối chiếu.
                </p>
              </article>
              <article className="landing-feature-card">
                <div className="landing-feature-icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 20V10M12 20V4M6 20v-6" />
                  </svg>
                </div>
                <h3 className="landing-feature-title">Mục tiêu ngày & Chuỗi ngày tập</h3>
                <p className="landing-feature-desc">
                  Theo dõi số rep hôm nay, tỷ lệ rep chuẩn form và duy trì streak tập luyện đều đặn mỗi ngày.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Khối Banner kêu gọi */}
        <section className="landing-container" aria-labelledby="banner-title">
          <div className="landing-banner">
            <h2 id="banner-title" className="landing-banner-title">
              Sẵn sàng cho hiệp tập tiếp theo?
            </h2>
            <p className="landing-banner-desc">
              Chỉ cần mở camera trên trình duyệt điện thoại và bắt đầu tập ngay.
            </p>
            <button
              type="button"
              className="landing-banner-btn"
              onClick={onStart}
              aria-label={isLoggedIn ? 'Bắt đầu vào bài tập ngay' : 'Bắt đầu sử dụng Form Coach ngay'}
            >
              {isLoggedIn ? 'Vào tập ngay' : 'Bắt đầu ngay'}
            </button>
          </div>
        </section>
      </main>

      <footer className="landing-footer" role="contentinfo">
        <p className="landing-disclaimer">
          Form Coach là công cụ AI hỗ trợ rèn luyện kỹ thuật, không thay thế huấn luyện viên thể hình chuyên nghiệp hay tư vấn y tế.
        </p>
        <div className="landing-footer-links">
          <span>Form Coach © 2026</span>
          <button
            type="button"
            className="landing-footer-link-btn"
            onClick={() => setShowPrivacyModal(true)}
          >
            Quyền riêng tư & Điều khoản
          </button>
          <a href="https://github.com/Nha-Cong-Dong/form-coach" target="_blank" rel="noopener noreferrer">
            Mã nguồn trên GitHub
          </a>
        </div>
      </footer>

      {/* Modal Quyền riêng tư & Điều khoản (Portal ra ngoài document.body để luôn bám chuẩn viewport) */}
      {showPrivacyModal &&
        createPortal(
          <div
            className="landing-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-modal-title"
            onClick={() => setShowPrivacyModal(false)}
          >
            <div className="landing-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="landing-modal-header">
                <h2 id="privacy-modal-title" className="landing-modal-title">
                  Cam kết Quyền riêng tư & Điều khoản
                </h2>
                <button
                  type="button"
                  className="landing-modal-close"
                  onClick={() => setShowPrivacyModal(false)}
                  aria-label="Đóng hộp thoại"
                >
                  ✕
                </button>
              </div>
              <div className="landing-modal-body">
                <div className="landing-modal-item">
                  <span className="landing-modal-badge" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="11" width="16" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="landing-modal-item-title">Video không bao giờ rời khỏi máy của bạn</h3>
                    <p className="landing-modal-item-desc">
                      Trình duyệt sử dụng mô hình Google MediaPipe trích xuất toạ độ 33 khớp xương trực tiếp trong RAM của thiết bị. Không có bất kỳ video, hình ảnh hay khuôn mặt nào được ghi âm, ghi hình hay gửi lên máy chủ đám mây.
                    </p>
                  </div>
                </div>

                <div className="landing-modal-item">
                  <span className="landing-modal-badge" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="landing-modal-item-title">Dữ liệu lưu trữ tối thiểu & minh bạch</h3>
                    <p className="landing-modal-item-desc">
                      Khi lưu hiệp tập, máy chủ chỉ nhận các toạ độ khớp xương dạng số nén để tính góc khuỷu và lưu lịch sử rèn luyện cho riêng tài khoản của bạn. Bạn có toàn quyền xem lại hoặc xóa tài khoản kèm toàn bộ dữ liệu.
                    </p>
                  </div>
                </div>

                <div className="landing-modal-item">
                  <span className="landing-modal-badge" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="landing-modal-item-title">Miễn trừ y tế & an toàn thể thao</h3>
                    <p className="landing-modal-item-desc">
                      Form Coach là công cụ AI hỗ trợ theo dõi kỹ thuật, không thể thay thế huấn luyện viên thể hình trực tiếp hay tư vấn của bác sĩ y khoa. Hãy khởi động kỹ và dừng tập ngay nếu cảm thấy đau khớp hoặc choáng váng.
                    </p>
                  </div>
                </div>
              </div>
              <div className="landing-modal-footer">
                <button
                  type="button"
                  className="landing-modal-btn"
                  onClick={() => setShowPrivacyModal(false)}
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
