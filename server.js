require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

// connects with database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection

//console logs outputs on error or established connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

//middleware for the server to accept JSON
app.use(express.json())


//Routes for endpoints
const usersRouter = require('./routes/users')
app.use('/users/', usersRouter)

//starts server
app.listen(3000, () => console.log('Server has started'))