const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

// database
const db = require('../models')
const Record = db.Record
const User = db.User

// login
router.get('/login', (req, res) => {
  let errors = []
  errors.push({ message: req.flash('error')[0] })
  if (errors[0].message === undefined) {
    res.render('login')
  } else {
    res.render('login', { errors })
  }
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
    badRequestMessage: "Email 和 Password 都為必填欄位!"
  })(req, res, next)
})

// register
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  // console.log(req.body)
  let errors = []
  if (!name || !email || !password || !password2) {
    errors.push({ message: '所有欄位都是必填!' })
  }
  if (password != password2) {
    errors.push({ message: '密碼輸入錯誤!' })
  }
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {
    User.findOne({ where: { email: email } }).then(user => {
      if (user) {
        console.log("User already is exist!")
        errors.push({ message: '這個Email己經註冊過了!' })
        res.render('register', {
          errors,
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
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash

            newUser.save()
              .then(user => {
                res.redirect('/')
              })
              .catch(err => { console.log(err) })
          })
        )
      }
    })
  }
})

// logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你己經成功登出')
  res.redirect('/')
  // console.log(req.session)
})

module.exports = router