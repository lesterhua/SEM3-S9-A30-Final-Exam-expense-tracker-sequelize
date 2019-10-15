const express = require('express')
const app = express()

const exphbs = require('express-handlebars')
const bodyParse = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')

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
  next()
})

app.get('/', (req, res) => {
  res.send("hello world!!")
})

app.use('/users', require('./routes/user'))

app.listen(port, () => {
  console.log(`the server is running on: http://localhost:${port}`)
})