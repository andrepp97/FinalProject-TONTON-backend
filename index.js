const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bearerToken = require('express-bearer-token')
const app = express()
const port = process.env.PORT || 2000

const secret = 'sutrisno'

app.use(bodyParser.json())
app.use(cors())
app.use(bearerToken())
app.use(express.static('public'))


const {
    userRouter,
    movieRouter,
    castRouter,
    watchlistRouter,
    adminRouter
} = require('./routers')

app.get('/', (req,res) => {
    res.status(200).send('OKE BOSS')
})

app.use('/user', userRouter)
app.use('/movie', movieRouter)
app.use('/cast', castRouter)
app.use('/watchlist', watchlistRouter)
app.use('/admin', adminRouter)


app.listen(port, () => console.log('API aktif di port ' + port))