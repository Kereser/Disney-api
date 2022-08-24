class BadRequestError {
  statusCode = 400

  constructor(msg) {
    this.reason = msg
  }

  errMsg() {
    return [{ message: this.reason }]
  }
}

class dbError {
  statusCode = 500

  constructor(msg) {
    this.reason = msg
  }

  errMsg() {
    return [{ message: this.reason }]
  }
}

module.exports = {
  BadRequestError,
  dbError,
}
