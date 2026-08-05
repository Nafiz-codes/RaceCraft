export interface ApiMeta {
  api_version: "v1"
  timestamp: string
}

export interface ApiSuccessResponse<TData> {
  success: true
  data: TData
  meta: ApiMeta
}

export interface ApiFailureResponse {
  success: false
  error: {
    code: string
    message: string
  }
}
