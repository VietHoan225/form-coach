import ThemeToggle from './ThemeToggle'
import './LandingView.css'

interface Props {
  onStart: () => void
  onLoginClick?: () => void
  isLoggedIn?: boolean
}

export default function LandingView({ onStart, onLoginClick, isLoggedIn = false }: Props) {
  const scrollToSteps = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="landing-view">
      <header className="landing-header">
        <a className="landing-brand" href="#landing" aria-label="Form Coach">
          <span className="landing-brand-badge" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 18h16M7 14l5-5 5 5" />
            </svg>
          </span>
          <span>Form Coach</span>
        </a>
        <div className="landing-nav-actions">
          <ThemeToggle />
          {isLoggedIn ? (
            <a className="landing-login-btn" href="#dashboard">
              Dashboard
            </a>
          ) : (
            <button
              type="button"
              className="landing-login-btn"
              onClick={onLoginClick || onStart}
            >
              Đăng nhập
            </button>
          )}
        </div>
      </header>

      <main>
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
            <button type="button" className="landing-cta-primary" onClick={onStart}>
              {isLoggedIn ? 'Vào tập ngay' : 'Bắt đầu ngay'}
            </button>
            <a className="landing-cta-secondary" href="#how-it-works" onClick={scrollToSteps}>
              Xem cách hoạt động ↓
            </a>
          </div>
          <div className="landing-trust-bar">
            <span className="landing-trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              Video không rời máy
            </span>
            <span className="landing-trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Chạy trực tiếp trên web
            </span>
            <span className="landing-trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Hoàn toàn miễn phí
            </span>
          </div>
        </section>

        {/* Khối Cách hoạt động */}
        <section id="how-it-works" className="landing-section" aria-labelledby="steps-title">
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
            <button type="button" className="landing-banner-btn" onClick={onStart}>
              {isLoggedIn ? 'Vào tập ngay' : 'Bắt đầu ngay'}
            </button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p className="landing-disclaimer">
          Form Coach là công cụ AI hỗ trợ rèn luyện kỹ thuật, không thay thế huấn luyện viên thể hình chuyên nghiệp hay tư vấn y tế.
        </p>
        <div className="landing-footer-links">
          <span>Form Coach © 2026</span>
          <a href="https://github.com/Nha-Cong-Dong/form-coach" target="_blank" rel="noopener noreferrer">
            Mã nguồn trên GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}

