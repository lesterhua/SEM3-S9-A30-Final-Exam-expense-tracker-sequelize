const express = require('express')
const router = express.Router()

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
  res.send('register')
})

// logout
router.get('/logout', (req, res) => {
  res.send('logout')
})

module.exports = router