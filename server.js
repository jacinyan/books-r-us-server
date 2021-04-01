const express = require('express')
const morgan = require('morgan')
const path = require('path')
const connectDB = require('./db')
const cors = require('cors')

const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const { readdirSync } = require('fs')

const app = express()

require('dotenv').config({ path: '.env' })
require('colors')

connectDB()


app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
// dynamic routing
readdirSync(path.join(__dirname, 'routes')).forEach(
    fileName => app.use('/api', require(`./routes/${fileName}`))
)
app.use(notFound)
// catch-all
app.use(errorHandler)


const PORT = process.env.PORT || 3000

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
    }
})