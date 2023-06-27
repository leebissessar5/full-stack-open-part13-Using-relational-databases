const router = require('express').Router()
const { Blog, User } = require('../models')

router.post('/', async (req, res) => {
  const user = await User.findByPk(req.user.id)
  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
  })
  res.json(blog)
})

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
  })
  res.json(blogs)
})

router.delete('/:id', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = req.user
  const blogToDelete = await Blog.findByPk(req.params.id)
  if (blogToDelete.userId.toString() === user.id.toString()) {
    await blogToDelete.destroy()
    res.status(204).send()
  } else {
    return res.status(401).json({ error: 'Unauthorized operation' })
  }
})

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  await blog.update({ likes: req.body.likes })
  res.status(200).json({ likes: req.body.likes })
})

module.exports = router
