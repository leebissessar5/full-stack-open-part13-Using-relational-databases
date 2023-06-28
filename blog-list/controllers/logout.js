const router = require('express').Router()
const Session = require('../models/session')

router.delete('/', async (req, res) => {
  await Session.destroy({
    where: {
      id: req.user.sessionId,
    },
  })
  res.status(204).send()
})

module.exports = router
