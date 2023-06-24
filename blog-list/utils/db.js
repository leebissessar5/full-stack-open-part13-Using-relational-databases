require('dotenv').config()

const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

const connectToDatabase = async () => {
  try {
    const blogs = await sequelize.query('SELECT * FROM blogs', {
      type: QueryTypes.SELECT,
    })
    blogs.map((blog) =>
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    )
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    return process.exit(1)
  }
}

module.exports = { connectToDatabase, sequelize }
