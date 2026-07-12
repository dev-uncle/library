const BookModel = require('../models/bookScheme')
const fs = require('fs')
const path = require('path')

const updateBookFile = async (req, res) => {
  const { id: bookID } = req.params // book ID
  if (!req.file) {
    return res.status(400).json({
      status: 'fail',
      message: 'No file uploaded',
    })
  }
  const new_bookFileLocation = req.file.path

  const getBookDetails = await BookModel.findById(bookID)

  if (!getBookDetails) {
    return res.status(400).json({
      status: 'fail',
      message: `book with id ${bookID} doesn't exists`,
    })
  }
  const old_bookFileLocation = getBookDetails.bookFile

  await BookModel.findByIdAndUpdate(
    { _id: bookID },
    { bookFile: new_bookFileLocation },
    {
      new: true,
      runValidators: true,
    }
  )

  // Delete the old file from the uploads folder if it exists
  if (old_bookFileLocation) {
    const filePath = path.join(__dirname, '..', old_bookFileLocation)
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting old book file: ${err}`)
      }
    })
  }

  res.status(StatusCodes.OK).json({ success: true, data: getBookDetails })
}

module.exports = updateBookFile
