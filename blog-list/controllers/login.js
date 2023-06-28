const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const router = require('express').Router()

const { SECRET } = require('../utils/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({
    where: {
      username: username,
    },
    attributes: ['id', 'username', 'passwordHash'], // Include passwordHash in the query
  })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  if (user.disabled) {
    return response.status(401).json({ error: 'user disabled' })
  }

  const session = await Session.create({ userId: user.id })
  const userForToken = {
    username: user.username,
    id: user.id,
    sessionId: session.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router
