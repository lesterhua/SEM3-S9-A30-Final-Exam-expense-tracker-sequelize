const express = require('express')
const app = express()

const exphbs = require('express-handlebars')
const bodyParse = require('body-parser')
const methodOverride = require('method-override')

const port = 2800

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParse.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.send("hello world!!")
})

app.listen(port, () => {
  console.log(`the server is running on: http://localhost:${port}`)
})