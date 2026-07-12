const BookTransaction = require("../models/bookTransaction");
const BookSchema = require("../models/bookScheme");
const PopularBookSchema = require("../models/PopularBooks");
const UserSchema = require("../models/signUpModel");
const UserLastBookModel = require("../models/userLastBook");
const RequestActivityLog = require("../models/requestActivityLog");

// Creates a new User book request transaction
const postBooks = async (req, res) => {
  const userId = req.userId;
  const username = req.username;
  const userEmail = req.userEmail;
  const { bookId } = req.body;

  // Does user have any un returned Books ? if yes,then Block the FEATURE to REQUEST books
  let hasAnyUnreturnedBooks = false;
  const allUsersBooksTransaction = await BookTransaction.find({ userId });

  // If User has return due books , Block the feature of 'request book'
  allUsersBooksTransaction.forEach((items) => {
    if (items.extraCharge !== 0 && items.isReturned == false) {
      hasAnyUnreturnedBooks = true;
    }
  });

  if (hasAnyUnreturnedBooks == true) {
    return res.status(400).json({
      success: false,
      message: `Book Request Blocked! Return 'Due' books to Continue`,
    });
  }

  // User can request upto 5 Books
  const getUserData = await UserSchema.findById(userId);
  // Users total books requested
  const { totalRequestedBooks } = getUserData;

  if (totalRequestedBooks >= 5) {
    return res.status(400).json({
      success: false,
      message: `Books Limit Reached`,
    });
  }

  // Book title fetch
  const bookDetails = await BookSchema.findById(bookId);
  if (!bookDetails) {
    return res.status(400).json({
      success: false,
      message: "Book doesn't exist",
    });
  }
  if (!bookDetails.available || bookDetails.quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: "Book is out of stock / not available",
    });
  }
  const { title } = bookDetails;

  // Check if user has previously requested for same book with id
  const checkPrevRequest = await BookTransaction.find({ userId, bookId });

  if (checkPrevRequest.length > 0) {
    // SOME is used to check if any book transaction has isReturned value set to false
    const isBookAlreadyRequested = checkPrevRequest.some(
      (map_para) => !map_para.isReturned
    );
    //  if kunai book not returned xa vane , isBookAlreadyRequested "TRUE" hunxa

    if (isBookAlreadyRequested) {
      return res.status(400).json({
        success: false,
        message: "Book already Requested",
      });
    } else {
      await createBookTransaction();
    }
  } else {
    await createBookTransaction();
  }

  async function createBookTransaction() {
    const result = await BookTransaction.create({
      userId,
      bookId,
      userEmail,
      username,
      bookTitle: title,
    });

    // Create activity log
    await RequestActivityLog.create({
      userId,
      userEmail,
      username,
      bookId,
      bookTitle: title,
      transactionId: result._id,
      action: 'REQUESTED',
      performedBy: username,
      remark: '',
    });

    // Update users total requested books on 'UserDetails' collection
    const updatedTotalRequestedBooks = totalRequestedBooks + 1;
    await UserSchema.findByIdAndUpdate(userId, {
      totalRequestedBooks: updatedTotalRequestedBooks,
    });

    return res.status(200).json({ success: true, data: result });
  }
};

// ADMIN issue book to a USER using BookId and UserEmail
const postIssueBooks = async (req, res) => {
  const { bookId, userEmail } = req.body;

  // User can request upto 5 Books
  const getUserData = await UserSchema.findOne({ email: userEmail });

  if (!getUserData) {
    return res
      .status(400)
      .json({ success: false, message: `Email doesn't Exists` });
  }

  // Users total requseted books requested
  const { totalRequestedBooks, totalAcceptedBooks, _id, username } =
    getUserData;
  const userId = _id.toString(); //converting raw ID to string only

  if (totalRequestedBooks >= 5) {
    return res
      .status(400)
      .json({ success: false, message: `Books Limit Reached` });
  }

  // Book title fetch
  const bookDetails = await BookSchema.findById(bookId);
  if (!bookDetails) {
    return res
      .status(400)
      .json({ success: false, message: `Book doesn't Exists` });
  }
  if (!bookDetails.available || bookDetails.quantity <= 0) {
    return res
      .status(400)
      .json({ success: false, message: `Book is out of stock / not available` });
  }
  const { title } = bookDetails;

  // Check if user has previously requested for same book with id
  const checkPrevRequest = await BookTransaction.find({ userId, bookId });

  if (checkPrevRequest.length > 0) {
    // SOME is used to check if any book transaction has isReturned value set to false
    const isBookAlreadyRequested = checkPrevRequest.some(
      (map_para) => !map_para.isReturned
    );
    //  if kunai book not returned xa vane , isBookAlreadyRequested "TRUE" hunxa

    if (isBookAlreadyRequested) {
      return res
        .status(400)
        .json({ success: false, message: "Book already Requested" });
    } else {
      await createBookTransaction();
    }
  } else {
    await createBookTransaction();
  }

  async function createBookTransaction() {
    const result = await BookTransaction.create({
      userId,
      bookId,
      userEmail,
      username,
      bookTitle: title,
      issueStatus: "ACCEPTED",
      issueDate: new Date(),
      returnDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Add 10 days to the current date
    });

    // Create activity log
    await RequestActivityLog.create({
      userId,
      userEmail,
      username,
      bookId,
      bookTitle: title,
      transactionId: result._id,
      action: 'ISSUED',
      performedBy: req.username || 'Admin',
      remark: '',
    });

    // Update book quantity
    bookDetails.quantity = Math.max(0, bookDetails.quantity - 1);
    bookDetails.available = bookDetails.quantity > 0;
    await bookDetails.save();

    // Update users total requested books on 'UserDetails' collection
    const updatedTotalAcceptedBooks = totalAcceptedBooks + 1;
    const updatedTotalRequestedBooks = totalRequestedBooks + 1;
    await UserSchema.findByIdAndUpdate(userId, {
      totalAcceptedBooks: updatedTotalAcceptedBooks,
      totalRequestedBooks: updatedTotalRequestedBooks,
    });

    // Store users last borrowed book
    const checkUsersLastBook = await UserLastBookModel.find({ userId });
    if (checkUsersLastBook.length != 0) {
      await UserLastBookModel.findOneAndUpdate(
        { userId },
        { lastBorrowedBookId: bookId, lastBorrowedBookTitle: title },
        {
          new: true, // Return the updated document
          runValidators: true, // Run validation rules on update
        }
      );
    } else {
      await UserLastBookModel.create({
        userId,
        userEmail,
        lastBorrowedBookId: bookId,
        lastBorrowedBookTitle: title,
      });
    }

    return res.status(200).json({ success: true, data: result });
  }
};

// issueStatus (filter PENDING BooksTransaction)
const getRequestedBooks = async (req, res) => {
  const result = await BookTransaction.find({
    issueStatus: { $in: ["PENDING", "READY"] },
  })
    .sort({ issueDate: -1 }) // 1 for ascending order, -1 for descending order
    .exec();
  res
    .status(200)
    .json({ success: true, totalHits: result.length, data: result });
};

// NOT RETURNED BOOKS, filters ( ACCEPTED + notReturned Books)
const getNotReturnedBooks = async (req, res) => {
  const result = await BookTransaction.find({
    issueStatus: "ACCEPTED",
    isReturned: false,
  });
  res
    .status(200)
    .json({ success: true, totalHits: result.length, data: result });
};

// Update book issue Status
const patchRequestedBooks = async (req, res) => {
  const { id, issueStatus, isReturned, remark, issuedBy, returnDate, fineType, fineAmount } = req.body;

  // if user cancels the PENDING request then delete it from DB completly
  if (issueStatus === "DELETE") {
    const getTransactionDetail = await BookTransaction.findById(id);
    if (getTransactionDetail) {
      await RequestActivityLog.create({
        userId: getTransactionDetail.userId,
        userEmail: getTransactionDetail.userEmail,
        username: getTransactionDetail.username,
        bookId: getTransactionDetail.bookId,
        bookTitle: getTransactionDetail.bookTitle,
        transactionId: getTransactionDetail._id,
        action: 'CANCELLED_BY_USER',
        performedBy: getTransactionDetail.username,
        remark: 'Request deleted by student',
      });
    }

    // user's id destructer to decrement total books qty for users so he can request for a new books
    const { userId } = getTransactionDetail;
    const getUserData = await UserSchema.findById(userId);

    // destructure user's total books qty and decrement by 1
    const { totalRequestedBooks } = getUserData;
    const updatedTotalRequestedBooks = Math.max(0, totalRequestedBooks - 1);
    await UserSchema.findByIdAndUpdate(userId, {
      totalRequestedBooks: updatedTotalRequestedBooks,
    });

    await BookTransaction.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: `Book removed successfully` });
  }

  // Book returned already , client le profile bata remove matra gareko
  if (issueStatus === "ALREADYRETURNED") {
    const getTransactionDetail = await BookTransaction.findById(id);
    if (getTransactionDetail) {
      await RequestActivityLog.create({
        userId: getTransactionDetail.userId,
        userEmail: getTransactionDetail.userEmail,
        username: getTransactionDetail.username,
        bookId: getTransactionDetail.bookId,
        bookTitle: getTransactionDetail.bookTitle,
        transactionId: getTransactionDetail._id,
        action: 'ARCHIVED',
        performedBy: getTransactionDetail.username,
        remark: 'Removed from student dashboard (Already Returned)',
      });
    }

    await BookTransaction.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: `Book removed successfully` });
  }

  // If admin cancels the book then , user le profile bata cancel garda just remove it , dont decrement TotalRequestedBooks
  // when admin cancels the book request, totalRequestBook is automatically decremented
  if (issueStatus === "ADMINCANCELLED") {
    const getTransactionDetail = await BookTransaction.findById(id);
    if (getTransactionDetail) {
      await RequestActivityLog.create({
        userId: getTransactionDetail.userId,
        userEmail: getTransactionDetail.userEmail,
        username: getTransactionDetail.username,
        bookId: getTransactionDetail.bookId,
        bookTitle: getTransactionDetail.bookTitle,
        transactionId: getTransactionDetail._id,
        action: 'ARCHIVED',
        performedBy: getTransactionDetail.username,
        remark: 'Removed from student dashboard (Admin Cancelled)',
      });
    }

    await BookTransaction.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: `Book removed successfully` });
  }

  const transactionDetail = await BookTransaction.findById(id);
  if (!transactionDetail) {
    return res
      .status(400)
      .json({ success: false, message: `Transaction doesn't exist` });
  }
  const bookId = transactionDetail.bookId;

  if (issueStatus === "ACCEPTED") {
    const bookDetails = await BookSchema.findById(bookId);
    if (!bookDetails || !bookDetails.available || bookDetails.quantity <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Book is out of stock / not available" });
    }
  }

  // if issueStatus ayo vane issueStatus only update that , and viceversa
  const result = await BookTransaction.findByIdAndUpdate(
    id,
    {
      issueStatus,
      isReturned,
      remark,
      issuedBy,
      returnDate: returnDate ? new Date(returnDate) : undefined,
      fineType,
      fineAmount: fineAmount !== undefined ? Number(fineAmount) : undefined,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // Fetching Book ID and Book Title for updating popular books if STATUS is ACCEPTED
  const { bookTitle, userId, userEmail } = result;

  // If book return TRUE, and it was not previously marked as returned
  if (isReturned && !transactionDetail.isReturned) {
    // increment users TotalAcceptedBooks
    const getUserData = await UserSchema.findById(userId);
    const { totalAcceptedBooks, totalRequestedBooks } = getUserData;
    const updatedTotalAcceptedBooks = Math.max(0, totalAcceptedBooks - 1);
    const updatedTotalRequestedBooks = Math.max(0, totalRequestedBooks - 1);

    // is returned = true , means bookTransaction status is to be set to - "RETURNED"
    await BookTransaction.findByIdAndUpdate(
      id,
      {
        issueStatus: "RETURNED",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // Increment book stock
    const bookDetails = await BookSchema.findById(bookId);
    if (bookDetails) {
      bookDetails.quantity += 1;
      bookDetails.available = true;
      await bookDetails.save();
    }

    await UserSchema.findByIdAndUpdate(userId, {
      totalAcceptedBooks: updatedTotalAcceptedBooks,
      totalRequestedBooks: updatedTotalRequestedBooks,
    });

    // Create activity log for return
    await RequestActivityLog.create({
      userId: transactionDetail.userId,
      userEmail: transactionDetail.userEmail,
      username: transactionDetail.username,
      bookId: transactionDetail.bookId,
      bookTitle: transactionDetail.bookTitle,
      transactionId: transactionDetail._id,
      action: 'RETURNED',
      performedBy: issuedBy || req.username || 'Admin',
      remark: remark || '',
      fineAmount: transactionDetail.extraCharge || 0,
    });
  }

  // If "ACCEPTED" then push that into popular books collection
  if (issueStatus === "ACCEPTED") {
    // update issueDate and returnDate
    await BookTransaction.findByIdAndUpdate(id, {
      issueDate: new Date(),
      returnDate: returnDate ? new Date(returnDate) : new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Add 10 days to the current date or use custom return date
    });

    // Decrement book stock
    const bookDetails = await BookSchema.findById(bookId);
    if (bookDetails) {
      bookDetails.quantity = Math.max(0, bookDetails.quantity - 1);
      bookDetails.available = bookDetails.quantity > 0;
      await bookDetails.save();
    }

    // increment users TotalAcceptedBooks
    const getUserData = await UserSchema.findById(userId);
    const { totalAcceptedBooks } = getUserData;
    const updatedTotalAcceptedBooks = totalAcceptedBooks + 1;

    await UserSchema.findByIdAndUpdate(userId, {
      totalAcceptedBooks: updatedTotalAcceptedBooks,
    });

    // Store users last borrowed book
    const checkUsersLastBook = await UserLastBookModel.find({ userId });
    if (checkUsersLastBook.length != 0) {
      await UserLastBookModel.findOneAndUpdate(
        { userId },
        { lastBorrowedBookId: bookId, lastBorrowedBookTitle: bookTitle },
        {
          new: true, // Return the updated document
          runValidators: true, // Run validation rules on update
        }
      );
    } else {
      await UserLastBookModel.create({
        userId,
        userEmail,
        lastBorrowedBookId: bookId,
        lastBorrowedBookTitle: bookTitle,
      });
    }

    createOrUpdatePopularBook(bookId, bookTitle);

    // Create activity log for issued
    await RequestActivityLog.create({
      userId: transactionDetail.userId,
      userEmail: transactionDetail.userEmail,
      username: transactionDetail.username,
      bookId: transactionDetail.bookId,
      bookTitle: transactionDetail.bookTitle,
      transactionId: transactionDetail._id,
      action: 'ISSUED',
      performedBy: issuedBy || req.username || 'Admin',
      remark: remark || '',
    });
  } else if (issueStatus === "CANCELLED" && transactionDetail.issueStatus !== "CANCELLED") {
    // user's id destructer to decrement total books qty for users so he can request for a new books
    const getUserData = await UserSchema.findById(userId);

    // destructure user's total books qty and decrement by 1
    const { totalRequestedBooks } = getUserData;
    const updatedTotalRequestedBooks = Math.max(0, totalRequestedBooks - 1);
    await UserSchema.findByIdAndUpdate(userId, {
      totalRequestedBooks: updatedTotalRequestedBooks,
    });

    // Create activity log for cancelled
    await RequestActivityLog.create({
      userId: transactionDetail.userId,
      userEmail: transactionDetail.userEmail,
      username: transactionDetail.username,
      bookId: transactionDetail.bookId,
      bookTitle: transactionDetail.bookTitle,
      transactionId: transactionDetail._id,
      action: 'CANCELLED_BY_ADMIN',
      performedBy: issuedBy || req.username || 'Admin',
      remark: remark || '',
    });
  } else if (issueStatus === "READY" && transactionDetail.issueStatus !== "READY") {
    // Create activity log for ready
    await RequestActivityLog.create({
      userId: transactionDetail.userId,
      userEmail: transactionDetail.userEmail,
      username: transactionDetail.username,
      bookId: transactionDetail.bookId,
      bookTitle: transactionDetail.bookTitle,
      transactionId: transactionDetail._id,
      action: 'READY',
      performedBy: issuedBy || req.username || 'Admin',
      remark: remark || '',
    });
  }

  res
    .status(200)
    .json({ success: true, totalHits: result.length, data: result });
};

// POPULAR BOOKS TRACKING FUNCTION
const createOrUpdatePopularBook = async (bookId, bookTitle) => {
  const checkPopularBook = await PopularBookSchema.findOne({ bookId });

  if (!checkPopularBook) {
    // If book does not exist in popular collection, create a new one
    await PopularBookSchema.create({
      bookId,
      bookTitle,
    });
  } else {
    // If book already exists in popular collection, increment issueQuantity
    const updatedIssueQuantity = checkPopularBook.issueQuantity + 1;

    await PopularBookSchema.findOneAndUpdate(
      { bookId },
      { issueQuantity: updatedIssueQuantity },
      {
        new: true, // Return the updated document
        runValidators: true, // Run validation rules on update
      }
    );
  }
};

const getActivityLogs = async (req, res) => {
  const { search, action } = req.query;
  const query = {};

  if (action) {
    query.action = action;
  }

  if (search) {
    query.$or = [
      { userEmail: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
      { bookTitle: { $regex: search, $options: "i" } },
    ];
  }

  const result = await RequestActivityLog.find(query)
    .sort({ timestamp: -1 })
    .exec();

  res.status(200).json({
    success: true,
    totalHits: result.length,
    data: result,
  });
};

module.exports = {
  postBooks,
  getRequestedBooks,
  patchRequestedBooks,
  getNotReturnedBooks,
  postIssueBooks,
  getActivityLogs,
};
