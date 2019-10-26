const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')


passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ where: { email: email } }).then(user => {
    if (!user) {
      console.log('這個email尚未註冊!')
      return done(null, false, { message: '這個email尚未註冊!' })
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err
      if (isMatch) {
        return done(null, user)
      } else {
        console.log('密碼不正確')
        return done(null, false, { message: '密碼不正確' })
      }
    })
  })
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id).then(user => {
      done(null, user)
    })
  })
}))

module.exports = passport
