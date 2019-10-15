const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('../models')
const User = db.User


passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ where: { email: email } }).then(user => {
    if (!user) {
      console.log('這個email尚未註冊!')
      return done(null, false, { message: '這個email尚未註冊!' })

    }
    if (user.password != password) {
      console.log('密碼不正確')
      return done(null, false, { message: '密碼不正確' })
    }
    return done(null, user)
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
