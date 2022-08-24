export class BadRequestError {
  statusCode = 400

  constructor(msg) {
    this.reason = msg
  }

  errMsg() {
    return [{ message: this.reason }]
  }
}

export class dbError {
  statusCode = 500

  constructor(msg) {
    this.reason = msg
  }

  errMsg() {
    return [{ message: this.reason }]
  }
}
