class BadRequestError {
  statusCode = 400

  constructor(reason) {
    this.reason = reason
  }

  errMsg() {
    return [{ message: this.reason }]
  }
}

class DbError {
  statusCode = 500

  constructor(msg) {
    this.reason = msg
  }

  errMsg() {
    return [{ message: this.reason }]
  }
}

class NotFoundError {
  statusCode = 404
  reason = ' not found'

  constructor(Model) {
    this.reason = Model + this.reason
  }

  errMsg() {
    return [{ message: this.reason }]
  }
}

module.exports = {
  BadRequestError,
  DbError,
  NotFoundError,
}
