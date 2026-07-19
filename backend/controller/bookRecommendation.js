const { analyzeUserPreferences } = require('./bookRecommendationAlgorithm')
const UserLastBookModel = require('../models/userLastBook')
const BooksModel = require('../models/bookScheme')

const getRecommendedBooks = async (req, res) => {
  const userId = req.userId

  const userLastBook = await UserLastBookModel.findOne({ userId })
  
  if (!userLastBook || !userLastBook.lastBorrowedBookId) {
    // Cold start: user has not borrowed any books yet, return first 4 available books
    const defaultBooks = await BooksModel.find({ available: true }).limit(4)
    return res.status(200).json({ totalHits: defaultBooks.length, data: defaultBooks })
  }

  const { lastBorrowedBookId } = userLastBook

  const result = await analyzeUserPreferences(userId, lastBorrowedBookId)

  res.status(200).json({ totalHits: result.length, data: result })
}

module.exports = { getRecommendedBooks }
