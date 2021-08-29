require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const route = require('./routes')

const app = express()

app.use(cookieParser())

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
}))

app.use(express.json())

app.use('/api', route)

mongoose.connect('mongodb://localhost/auth', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    app.listen(process.env.SERVER_PORT, () => {
        console.log(`server is run on port ${process.env.SERVER_PORT}`)
    })
}).catch(err => {
    console.log(err)
})
