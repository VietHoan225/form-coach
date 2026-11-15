import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

/** Chặn lỗi render ở cây component bên dưới, thay màn trắng bằng cách phục hồi rõ ràng. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(): void {
    document.title = 'Có lỗi xảy ra · Form Coach'
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children

    return (
      <main>
        <section className="app-error card" role="alert" aria-labelledby="app-error-title">
          <h1 id="app-error-title">Có lỗi xảy ra</h1>
          <p className="hint">Không thể hiển thị trang. Vui lòng tải lại để thử lại.</p>
          <p className="hint">Tải lại sẽ mất hiệp chưa gửi đang giữ trong trang này.</p>
          <button type="button" className="secondary-button" onClick={() => window.location.reload()}>
            Tải lại trang
          </button>
        </section>
      </main>
    )
  }
}
