require('dotenv').config()

const { Pool } = require('pg')

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`


// TODO: bring back isProduction check and swap in needed azure creds here. Right now it's the same thing either way, but just have it set up to look for production
const pool = new Pool({
  connectionString: connectionString,
  ssl: isProduction,
})

module.exports = { pool }