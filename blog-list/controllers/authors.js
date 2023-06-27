const router = require('express').Router()
const { Blog, User } = require('../models')

const { Op, fn, col, literal } = require('sequelize')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      'author',
      [fn('COUNT', col('author')), 'articles'],
      [fn('SUM', col('likes')), 'likes'],
    ],
    include: {
      model: User,
      attributes: [],
    },
    group: ['author'],
    order: [['likes', 'DESC']],
  })
  res.json(blogs)
})

module.exports = router
