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
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
