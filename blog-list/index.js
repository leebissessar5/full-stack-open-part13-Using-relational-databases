require('dotenv').config()

const { Sequelize, Model, QueryTypes, DataTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

const express = require('express')
const app = express()

// Middleware to parse JSON data
app.use(express.json())

const main = async () => {
  try {
    const blogs = await sequelize.query('SELECT * FROM blogs', {
      type: QueryTypes.SELECT,
    })
    blogs.map((blog) =>
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    )
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog',
  }
)

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
