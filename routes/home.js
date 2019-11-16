const express = require('express')
const router = express.Router()
const { authenticated } = require('../config/auth')
const db = require('../models')
const User = db.User
const Record = db.Record
const months = require('../data/date.json').results
const categorys = require('../data/category.json').results
const sequelize = require('sequelize')
const Op = sequelize.Op

router.get('/', authenticated, (req, res) => {
  let totalAmount = 0
  const month = req.query.months || ''
  const category = req.query.categorys || ''
  // console.log('reqUserId', req.user.id)
  let filtermonth = (month === '') ? {} : { date: { [Op.and]: [sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), parseInt(month))] } }
  let filtercategory = (category === '') ? {} : { category: category }

  User.findByPk(req.user.id).then((user) => {
    if (!user) throw new Error('user not found')
    return Record.findAll({
      where: {
        UserId: req.user.id,
        ...filtercategory,
        ...filtermonth
      }
    }).then((records) => {
      records.forEach((record) => {
        record.dateTime = `${record.date.getFullYear()}/${(record.date.getMonth() + 1)}/${record.date.getDate()}`
        totalAmount += record.amount
      })
      return res.render('index', { records, totalAmount, months, month, categorys, category })
    })
  })
    .catch((error) => { res.status(422).json(error) })
})

module.exports = router