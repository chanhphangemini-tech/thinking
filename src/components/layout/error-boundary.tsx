'use client'

import { Component, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Đã xảy ra lỗi</h1>
              <p className="text-white/60 text-sm">
                Ứng dụng đã gặp sự cố không mong muốn. Vui lòng thử lại.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-left">
                <p className="text-xs text-red-400 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                className="bg-cyan-500 hover:bg-cyan-400 text-black"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Về trang chủ
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Tải lại trang
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Async Error Boundary for async operations
export function AsyncErrorBoundary({
  children,
  error,
  onRetry,
}: {
  children: ReactNode
  error: Error | null
  onRetry?: () => void
}) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Không thể tải dữ liệu</h3>
        <p className="text-white/60 text-sm mb-4">{error.message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử lại
          </Button>
        )}
      </div>
    )
  }

  return <>{children}</>
}
