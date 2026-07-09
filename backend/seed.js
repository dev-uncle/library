const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const BooksList = require('./models/bookScheme')
const PopularBook = require('./models/PopularBooks')
const UserDetails = require('./models/signUpModel')
const UserEmailVerification = require('./models/userOtpVerificationModel')

const booksData = require('../mongoDatabase/bookslists.json')
const popularBooksData = require('../mongoDatabase/popularbooks.json')
const userDetailsData = require('../mongoDatabase/userdetails.json')
const userEmailVerificationsData = require('../mongoDatabase/useremailverifications.json')

const UPLOADS_DIR = path.join(__dirname, 'uploads')

// Build a lookup map: filename (no ext) → actual filename (with ext)
// e.g. { "abc123": "abc123.jpg" }
const buildUploadsMap = () => {
  const files = fs.readdirSync(UPLOADS_DIR)
  const map = {}
  files.forEach((file) => {
    const nameWithoutExt = path.parse(file).name
    map[nameWithoutExt] = file
  })
  return map
}

// Fix Windows backslashes and append correct extension from actual uploads folder
const fixImagePath = (imagePath, uploadsMap) => {
  if (!imagePath) return imagePath
  const normalized = imagePath.replace(/\\/g, '/')
  const filename = path.posix.basename(normalized)
  const nameWithoutExt = path.parse(filename).name
  // Use actual filename from disk (preserves correct extension)
  if (uploadsMap[nameWithoutExt]) {
    return `uploads/${uploadsMap[nameWithoutExt]}`
  }
  return `uploads/${filename}`
}

// Converts MongoDB Extended JSON ($oid, $date) to plain JS objects
const normalizeData = (data, uploadsMap = null) => {
  return data.map((doc) => {
    const normalized = { ...doc }

    // Convert $oid → ObjectId
    if (normalized._id && normalized._id.$oid) {
      normalized._id = new mongoose.Types.ObjectId(normalized._id.$oid)
    }

    // Convert $date → Date
    for (const key in normalized) {
      if (normalized[key] && typeof normalized[key] === 'object' && normalized[key].$date) {
        normalized[key] = new Date(normalized[key].$date)
      }
    }

    // Fix image path if uploadsMap is provided
    if (uploadsMap && normalized.image) {
      normalized.image = fixImagePath(normalized.image, uploadsMap)
    }

    return normalized
  })
}

const seedDatabase = async () => {
  try {
    console.log('\n🔗 Connecting to Database...')
    await mongoose.connect(process.env.CONNECTION_URL)
    console.log('✅ Connected to Database Successfully\n')

    // Build map of actual upload filenames for image path fixing
    const uploadsMap = buildUploadsMap()
    console.log(`🗂  Found ${Object.keys(uploadsMap).length} files in uploads/\n`)

    // ── Books ───────────────────────────────────────────────
    console.log('📚 Seeding BooksList...')
    await BooksList.deleteMany({})
    const books = normalizeData(booksData, uploadsMap)
    await BooksList.insertMany(books, { ordered: false })
    console.log(`   ✔ Inserted ${books.length} books\n`)

    // ── Popular Books ───────────────────────────────────────
    console.log('⭐ Seeding PopularBooks...')
    await PopularBook.deleteMany({})
    const popularBooks = normalizeData(popularBooksData)
    await PopularBook.insertMany(popularBooks, { ordered: false })
    console.log(`   ✔ Inserted ${popularBooks.length} popular books\n`)

    // ── User Details ────────────────────────────────────────
    console.log('👤 Seeding UserDetails...')
    await UserDetails.deleteMany({})
    const users = normalizeData(userDetailsData)
    await UserDetails.insertMany(users, { ordered: false })
    console.log(`   ✔ Inserted ${users.length} users\n`)

    // ── Email Verifications ─────────────────────────────────
    console.log('📧 Seeding UserEmailVerifications...')
    await UserEmailVerification.deleteMany({})
    const emailVerifications = normalizeData(userEmailVerificationsData)
    await UserEmailVerification.insertMany(emailVerifications, { ordered: false })
    console.log(`   ✔ Inserted ${emailVerifications.length} email verifications\n`)

    console.log('🎉 Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    process.exit(1)
  }
}

seedDatabase()
