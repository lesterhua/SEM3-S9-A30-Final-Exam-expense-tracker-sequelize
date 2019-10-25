const express = require('express')
const router = express.Router()
const { authenticated } = require('../config/auth')
const db = require('../models')
const User = db.User
const Record = db.Record

router.get('/', authenticated, (req, res) => {
  let totalAmount = 0
  // console.log('reqUserId', req.user.id)
  User.findByPk(req.user.id).then((user) => {
    if (!user) throw new Error('user not found')

    return Record.findAll({ where: { UserId: req.user.id } }).then((records) => {
      records.forEach((record) => {
        record.dateTime = `${record.date.getFullYear()}/${(record.date.getMonth() + 1)}/${record.date.getDate()}`
        totalAmount += record.amount
      })
      return res.render('index', { records, totalAmount })
    })
  })
    .catch((error) => { res.status(422).json(error) })
})

module.exports = router