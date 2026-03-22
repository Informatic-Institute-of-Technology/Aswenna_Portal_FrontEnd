export interface ApiResponse<T = unknown> {
  data: T   
  message?: string
  success: boolean
  status?: number
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}
