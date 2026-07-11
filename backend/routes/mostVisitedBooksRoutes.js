const express = require('express')
const mostVisitedBooksRouter = express.Router()

const { getMostVisitedBooks } = require('../controller/mostVisitedBooksController')

mostVisitedBooksRouter.route('/').get(getMostVisitedBooks)

module.exports = mostVisitedBooksRouter
