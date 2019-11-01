const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')
const FacebookStrategy = require('passport-facebook').Strategy


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
}))
// fb登入
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  profileFields: ['email', 'displayName']
},
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ where: { email: profile._json.email } }).then((user) => {
      if (!user) {
        let randomPassword = Math.random().toString(36).slice(-8)
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(randomPassword, salt, (err, hash) => {
            const newUser = new User({
              name: profile._json.name,
              email: profile._json.email,
              password: hash
            })
            newUser.save().then((user) => {
              return done(null, user)
            }).catch(err => console.log(err))
          })
        })
      }
      else {
        return done(null, user)
      }
    })
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findByPk(id).then(user => {
    done(null, user)
  })
})


module.exports = passport

