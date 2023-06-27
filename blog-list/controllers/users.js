const router = require('express').Router()

const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.findOne()
  const blog = await Blog.create({ ...req.body, userId: user.id })
  res.json(blog)
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findByPk(req.params.username)
  await user.update({ username: req.body.username })
})

module.exports = router
