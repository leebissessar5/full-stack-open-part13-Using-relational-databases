const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (_req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body)
  return res.json(blog)
})

router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  await blog.destroy()
  res.status(204).send()
})

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  await blog.update({ likes: req.body.likes })
  res.status(200).json({ likes: req.body.likes })
})

module.exports = router
