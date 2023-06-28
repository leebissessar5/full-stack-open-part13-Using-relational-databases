const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')
const User = require('../models/user')
const Session = require('../models/session')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (
    [
      'SequelizeUniqueConstraintError',
      'SequelizeEagerLoadingError',
      'SequelizeDatabaseError',
      'SequelizeValidationError',
      'ValidationError',
      'SyntaxError',
      'Error',
      'ReferenceError',
    ].includes(error.name)
  ) {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'TypeError') {
    return response.status(500).json({ error: error.message })
  }
  next(error)
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const decodedToken = jwt.verify(authorization.substring(7), SECRET)
      if (decodedToken.id) {
        const session = await Session.findByPk(decodedToken.sessionId)
        if (!session) {
          return res.status(401).json({ error: 'token invalid' })
        }
        req.user = decodedToken
      }
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const userExtractor = async (req, res, next) => {
  if (req.user && req.user.id) {
    const userId = req.user.id
    req.user = await User.findByPk(userId)
  }
  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
