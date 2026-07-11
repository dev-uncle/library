const BookList = require('../models/bookScheme')

const getMostVisitedBooks = async (req, res) => {
  const limit = parseInt(req.query.limit) || 12
  const result = await BookList.find().sort({ viewCount: -1 }).limit(limit)

  res
    .status(200)
    .json({ success: true, totalHits: result.length, data: result })
}

module.exports = { getMostVisitedBooks }
