const express = require('express')
const router = express.Router()
const db = require('../models')
const User = db.User
const Record = db.Record

const { authenticated } = require('../config/auth')

// create page
router.get('/new', authenticated, (req, res) => {
  res.render('new')
})

// create action
router.post('/new', authenticated, (req, res) => {
  console.log(req.body)
  // const newUser = new Record({
  //   name: req.body.name,
  //   category: req.body.category,
  //   date: req.body.date,
  //   amount: req.body.amount,
  //   UserId: req.user.id
  // })
  // newUser.save()
  //   .then((record) => {
  //     res.redirect('/')
  //   })
  //   .catch((error) => {
  //     res.status(422).json(error)
  //   })
  Record.create({
    name: req.body.name,
    category: req.body.category,
    date: req.body.date,
    amount: req.body.amount,
    UserId: req.user.id
  })
    .then((record) => {
      return res.redirect('/')
    })
    .catch((error) => {
      return res.status(422).json(error)
    })
})

// edit page
router.get('/:id/edit', authenticated, (req, res) => {
  // console.log(req.user.id)
  // console.log(req.params)
  User.findByPk(req.user.id).then((user) => {
    if (!user) throw new Error('user not found')

    return Record.findOne({ where: { id: req.params.id, UserId: req.user.id } })
      .then((record) => {
        const dateTime = `${record.date.getFullYear()}-${(record.date.getMonth() + 1).toString().padStart(2, '0')}-${record.date.getDate().toString().padStart(2, '0')}`
        console.log(dateTime)
        res.render('edit', { record, dateTime })
      })
  })
    .catch((error) => {
      res.status(422).json(error)
    })
})

// edit action
router.put('/:id/edit', authenticated, (req, res) => {
  Record.findOne({ where: { id: req.params.id, UserId: req.user.id } }).then((record) => {
    console.log(req.body)
    record.name = req.body.name,
      record.category = req.body.category,
      record.date = req.body.date,
      record.amount = req.body.amount
    return record.save()
  })
    .then((record) => {
      return res.redirect('/')
    })
    .then((error) => {
      return res.status(422).json(error)
    })
})

// delete
router.delete('/:id/delete', authenticated, (req, res) => {
  Record.findOne({ where: { id: req.params.id, UserId: req.user.id } }).then((record) => {
    record.destroy({ where: { id: req.params.id, UserId: req.user.id } }).then((record) => {
      return res.redirect('/')
    })
  })
    .catch((error) => {
      return res.status(422).json(error)
    })
})

module.exports = router