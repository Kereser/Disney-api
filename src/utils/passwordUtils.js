const crypto = require('crypto')
const utils = require('util')

const scryptAsync = utils.promisify(crypto.scrypt)

async function toHash(password) {
  const salt = crypto.randomBytes(8).toString('hex')
  const buf = await scryptAsync(password, salt, 64)

  return `${buf.toString('hex')}.${salt}`
}

async function compare(storedPassword, suppliedPassword) {
  const [hashedPassword, salt] = storedPassword.split('.')
  const buf = await scryptAsync(suppliedPassword, salt, 64)

  return buf.toString('hex') === hashedPassword
}

module.exports = { toHash, compare }
