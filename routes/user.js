const express = require('express')
const router = express.Router()

// database
const db = require('../models')
const Record = db.Record
const User = db.User

// login
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {
  res.send('login')
})

// register
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  // console.log(req.body)
  User.findOne({ where: { email: email } }).then(user => {
    if (user) {
      console.log("User already is exist!")
      res.render('register', {
        name,
        email,
        password,
        password2
      })
    } else {
      const newUser = new User({
        name,
        email,
        password
      })
      newUser.save()
        .then(user => {
          res.redirect('/')
        })
        .catch(err => { console.log(err) })
    }
  })
})

// logout
router.get('/logout', (req, res) => {
  res.send('logout')
})

module.exports = router