const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (
    ['SequelizeValidationError', 'ValidationError', 'SyntaxError'].includes(
      error.name
    )
  ) {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'TypeError') {
    return response.status(500).json({ error: error.message })
  }
  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler,
}
