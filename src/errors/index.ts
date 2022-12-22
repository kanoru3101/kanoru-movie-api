export enum HTTP_STATUS_CODE {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export default class ApiError extends Error {
  status: number
  message: string
  constructor(message: string, status?: HTTP_STATUS_CODE) {
    super(message)
    this.status = status || 400
    this.message = message
  }
}
