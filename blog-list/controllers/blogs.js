const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (_req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)

    if (blog) {
      await blog.destroy()
      res.status(204).send()
    } else {
      res.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    await blog.update({ likes: req.body.likes })
    res.status(200).json({ likes: req.body.likes })
  } catch (error) {
    return res.status(500).json({ error })
  }
})

module.exports = router
