const express = require('express')
const router = express.Router()
const passport = require('passport')

// fb登入網址
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

// fb授權許可redirect 的網址
router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: 'users/login'
  }),
);
module.exports = router