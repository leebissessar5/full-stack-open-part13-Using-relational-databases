require('dotenv').config()

const { Sequelize, QueryTypes } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}
const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}
const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
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

module.exports = { connectToDatabase, sequelize, rollbackMigration }
