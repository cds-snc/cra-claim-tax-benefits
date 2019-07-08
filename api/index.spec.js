const API = require('./index')

test('returns expected user with correct login.code', () => {
  const user = API.getUser('ABCD1234')
  expect(user).not.toBe(null)
  expect(user.personal.firstName).toBe('Gabrielle')
  expect(user.personal.lastName).toBe('Roy')
})

test('returns null with a nonexistent login.code', () => {
  const user = API.getUser('H3LLY34H')
  expect(user).toBe(null)
})
