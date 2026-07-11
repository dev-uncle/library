const BookList = require('../models/bookScheme')

// fetch books based on DATE (Latest/Recently ADDED books Fetching)
const getAllRecentBooks = async (req, res) => {
  const limit = parseInt(req.query.limit) || 12
  const result = await BookList.find().sort({ createdAdded: -1 }).limit(limit)

  res
    .status(200)
    .json({ success: true, totalHits: result.length, data: result })
}

module.exports = { getAllRecentBooks }
