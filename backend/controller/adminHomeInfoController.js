// This Controller fetches all the necessary information that are shown at ADMIN Home PAGE

const UserModel = require('../models/signUpModel')
const BookModel = require('../models/bookScheme')
const BookTransaction = require('../models/bookTransaction')
const PopularBookSchema = require('../models/PopularBooks')

const adminHomePageInfo = async (req, res) => {
  //1 Fetching all Book Infos i.e. Total Books, Total Books Categories, (can also add Total Authors,Language in Future)
  const getBookDetails = await BookModel.find({})
  const totalBooks = getBookDetails.length

  // Total CATEOGIRES :Create an empty object to store unique categories as keys
  const uniqueCategories = {}
  const uniqueAuthors = {}
  // Loop through the array and add categories to the uniqueCategories object
  getBookDetails.forEach((item) => {
    const category = item.category
    uniqueCategories[category] = true // Using an object as a set to ensure uniqueness
    const author = item.author
    uniqueAuthors[author] = true
  })
  // Get the total number of unique categories
  const totalCategories = Object.keys(uniqueCategories).length
  const totalAuthors = Object.keys(uniqueAuthors).length

  //2 Fetching all Transaction Infos i.e. Total Books Requests(PENDING), Total Issued Books(RETURNED = FALSE && IssueSTATUS = ACCEPTED )
  const getBookTransactionDetails = await BookTransaction.find({})

  let totalBookRequests = 0
  getBookTransactionDetails.forEach((item) => {
    if (item.issueStatus === 'PENDING') {
      totalBookRequests++
    }
  })

  let totalIssuedBooks = 0
  getBookTransactionDetails.forEach((item) => {
    if (item.isReturned == false && item.issueStatus == 'ACCEPTED') {
      totalIssuedBooks++
    }
  })

  //3 Fetching all User Infos i.e. total Registered users (userType = normal_user and Verified User)
  const getUserDetails = await UserModel.find({
    userType: 'normal_user',
  })
  const totalRegisteredUsers = getUserDetails.length

  // Ensure all books have a searchCount and viewCount initialized to prevent missing fields issues
  await BookModel.updateMany(
    { searchCount: { $exists: false } },
    { $set: { searchCount: 0 } }
  ).catch((err) => console.log(err))

  await BookModel.updateMany(
    { viewCount: { $exists: false } },
    { $set: { viewCount: 0 } }
  ).catch((err) => console.log(err))

  //4 Fetching Recommendation stats: Most Viewed, Most Requested, Most Searched
  const mostViewed = await BookModel.find({})
    .sort({ viewCount: -1 })
    .limit(5)

  const mostSearched = await BookModel.find({})
    .sort({ searchCount: -1 })
    .limit(5)

  const popularBooksData = await PopularBookSchema.find({})
    .sort({ issueQuantity: -1 })
    .limit(5)

  const popularBookIds = popularBooksData.map((pb) => pb.bookId)
  const popularBooksDetails = await BookModel.find({ _id: { $in: popularBookIds } })

  const mostRequested = popularBooksData.map((pb) => {
    const details = popularBooksDetails.find((b) => b._id.toString() === pb.bookId)
    return {
      _id: pb.bookId,
      title: pb.bookTitle,
      issueQuantity: pb.issueQuantity,
      image: details ? details.image : '',
      category: details ? details.category : '',
      author: details ? details.author : '',
    }
  })

  //5 Fetching inventory status: Low quantity books
  const lowQuantityBooks = await BookModel.find({ quantity: { $lte: 5 } })
    .sort({ quantity: 1 })
    .limit(5)

  res.status(200).json({
    success: true,
    data: {
      totalBooks,
      totalCategories,
      totalAuthors,
      totalBookRequests,
      totalIssuedBooks,
      totalRegisteredUsers,
      mostViewed,
      mostRequested,
      mostSearched,
      lowQuantityBooks,
    },
  })
}

module.exports = adminHomePageInfo
