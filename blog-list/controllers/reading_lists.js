const router = require('express').Router()
const { Blog, User, ReadingList } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    const readingList = await ReadingList.create({
      userId: req.user.id,
      blogId: req.blog.id,
      read: true,
    })
    res.json(readingList)
  } catch (error) {
    next(error)
  }
})

module.exports = router
