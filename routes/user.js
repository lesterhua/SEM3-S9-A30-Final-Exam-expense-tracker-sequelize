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
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }).then(user => {
    res.redirect('/')
  })
})

// logout
router.get('/logout', (req, res) => {
  res.send('logout')
})

module.exports = router