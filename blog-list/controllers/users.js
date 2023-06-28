const router = require('express').Router()
const bcrypt = require('bcryptjs')
const { Blog, User, ReadingList } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
      },
      {
        model: ReadingList,
      },
    ],
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const body = req.body

  if (!body.password || body.password.length < 3) {
    return res.status(400).json({
      error: 'invalid or missing password',
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)
  const user = await User.create({
    name: body.name,
    username: body.username,
    passwordHash,
  })
  // Exclude passwordHash from the response
  const userWithoutPasswordHash = { ...user.get(), passwordHash: undefined }

  res.json(userWithoutPasswordHash)
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  })
  await user.update({ username: req.body.username })
  res.json(user)
})

module.exports = router
