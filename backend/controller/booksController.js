const BookList = require('../models/bookScheme')
const fs = require('fs')
const path = require('path')

// fetch all books
const getAllBooks = async (req, res) => {
  const result = await BookList.find({})

  res
    .status(StatusCodes.OK)
    .json({ success: true, totalHits: result.length, data: result })
}

// add new book
const postBook = async (req, res) => {
  // ---------------------------MULTER---CREATING----NEW----BOOK-------------------

  const image = req.files && req.files['image'] ? req.files['image'][0].path : ''
  const bookFile = req.files && req.files['bookFile'] ? req.files['bookFile'][0].path : ''
  const { title, description, language, author, category } = req.body
  const quantity = req.body.quantity !== undefined ? Number(req.body.quantity) : 1
  const available = quantity > 0

  let featured
  if (req.body.featured === 'true' || req.body.featured === true) {
    featured = true
  } else {
    featured = false
  }

  const result = await BookList.create({
    title,
    description,
    language,
    author,
    category,
    featured,
    available,
    quantity,
    bookFile,
    image,
  })

  res.status(StatusCodes.CREATED).json({ success: true, data: result })
}

// fetch single book by ID
const getSingleBook = async (req, res) => {
  const { id: bookID } = req.params
  const result = await BookList.findById({ _id: bookID })

  if (!result) {
    return res.status(400).json({
      status: 'fail',
      message: `book with id ${bookID} doesn't exists`,
    })
  }

  // Increment view count (fire-and-forget, don't await)
  BookList.findByIdAndUpdate(bookID, { $inc: { viewCount: 1 } }).catch(() => {})

  res.status(StatusCodes.OK).json({ success: true, data: result })
}

// update single book detail
const patchBook = async (req, res) => {
  const { id: bookID } = req.params

  if (req.body.quantity !== undefined) {
    req.body.quantity = Number(req.body.quantity)
    req.body.available = req.body.quantity > 0
  }

  const result = await BookList.findByIdAndUpdate({ _id: bookID }, req.body, {
    // Instant Update or else 1step delay output hunxa + rechecking the validation for updated Values
    new: true,
    runValidators: true,
  })

  if (!result) {
    return res.status(400).json({
      status: 'fail',
      message: `book with id ${bookID} doesn't exists`,
    })
  }

  res.status(StatusCodes.OK).json({ success: true, data: result })
}

// delete single book by id
const deleteBook = async (req, res) => {
  const { id: bookID } = req.params

  // Find the book to get the image filename
  const book = await BookList.findById(bookID)
  if (!book) {
    return res.status(400).json({
      success: false,
      message: `Book with id ${bookID} doesn't exist`,
    })
  }

  const imageFilename = book.image
  const bookFileFilename = book.bookFile

  // Delete the book from the database
  const result = await BookList.findByIdAndDelete({ _id: bookID })
  if (!result) {
    return res.status(400).json({
      status: 'fail',
      message: `book with id ${bookID} doesn't exists`,
    })
  }

  // Delete the image file from the uploads folder
  if (imageFilename) {
    const imagePath = path.join(__dirname, '..', imageFilename)
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Error deleting image file: ${err}`)
      }
    })
  }

  // Delete the PDF file from the uploads folder
  if (bookFileFilename) {
    const bookFilePath = path.join(__dirname, '..', bookFileFilename)
    fs.unlink(bookFilePath, (err) => {
      if (err) {
        console.error(`Error deleting book PDF file: ${err}`)
      }
    })
  }

  res.status(StatusCodes.OK).json({ status: 'success', data: null })
}

module.exports = {
  getAllBooks,
  postBook,
  getSingleBook,
  patchBook,
  deleteBook,
}
