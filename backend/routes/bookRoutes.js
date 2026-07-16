const express = require('express')
const booksRouter = express.Router()

const path = require('path')
const fs = require('fs')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

const {
  getAllBooks,
  postBook,
  getSingleBook,
  patchBook,
  deleteBook,
} = require('../controller/booksController')

// Middlewares
const verifyToken = require('../middleware/verifyToken')
const adminAuthorization = require('../middleware/adminAuth')
const updateBookImage = require('../controller/bookImageUpdateController')
const updateBookFile = require('../controller/bookFileUpdateController')

booksRouter
  .route('/')
  .get(getAllBooks)
  .post(
    verifyToken,
    adminAuthorization,
    upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'bookFile', maxCount: 1 },
    ]),
    postBook
  )

booksRouter
  .route('/:id')
  .get(getSingleBook)
  .patch(verifyToken, adminAuthorization, patchBook)
  .delete(verifyToken, adminAuthorization, deleteBook)

// Updating book Image
// Old Image File location replaced with new image file location and old image file is deleted from 'uploads' folder
booksRouter
  .route('/updateImage/:id')
  .patch(
    verifyToken,
    adminAuthorization,
    upload.single('image'),
    updateBookImage
  )

// Updating book File (PDF)
booksRouter
  .route('/updateBookFile/:id')
  .patch(
    verifyToken,
    adminAuthorization,
    upload.single('bookFile'),
    updateBookFile
  )

module.exports = booksRouter
