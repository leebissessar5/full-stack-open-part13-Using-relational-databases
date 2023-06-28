const router = require('express').Router()
const { Blog, ReadingList } = require('../models')

const blogExtractor = async (req, res, next) => {
  req.blog = await Blog.findOne({
    where: {
      id: req.body.blogId,
    },
  })
  next()
}

router.post('/', blogExtractor, async (req, res, next) => {
  try {
    const readingList = await ReadingList.create({
      userId: req.user.id,
      blogId: req.blog.id,
    })
    res.json(readingList)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res) => {
  const readingList = await ReadingList.findByPk(req.params.id)
  await readingList.update({ read: req.body.read })
  res.json(readingList)
})

module.exports = router
