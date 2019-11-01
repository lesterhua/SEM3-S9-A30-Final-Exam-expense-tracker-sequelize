const express = require('express')
const app = express()
// 判別開發環境
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const exphbs = require('express-handlebars')
const bodyParse = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')

require('./handlebars-helpers')


const port = 2800

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParse.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
  secret: 'sfefewg',
  resave: 'false',
  saveUninitialized: 'false',
}))
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.auth = req.isAuthenticated()
  // console.log("isAuthenticated", res.locals.isAuthenticated)
  next()
})



app.use('/', require('./routes/home'))
app.use('/users', require('./routes/user'))
app.use('/records', require('./routes/record'))
app.use('/auth', require('./routes/auth'))

app.listen(port, () => {
  console.log(`the server is running on: http://localhost:${port}`)
})