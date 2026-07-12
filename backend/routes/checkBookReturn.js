const express = require('express')
const BookTransactionSchema = require('../models/bookTransaction')
const CheckBookReturnRouter = express.Router()

const runBookReturnCheck = async (req, res) => {
  await checkBookReturn()
  res.status(200).json({ success: true, message: `Book Fine Charges Checked` })
}

CheckBookReturnRouter.route('/').get(runBookReturnCheck)

// This API is to be called everytime ADMIN / CLIENT logs in
// Update Extra charge (PRICE) of entire booktransaction if returnDate is passed and isReturned is still False
const checkBookReturn = async () => {
  try {
    // Find the book transactions where returnDate is passed and isReturned is false
    const overdueTransactions = await BookTransactionSchema.find({
      returnDate: { $lt: new Date() },
      isReturned: false,
    })

    // Update the extraCharge field for overdue transactions based on configuration
    for (const transaction of overdueTransactions) {
      const type = transaction.fineType || 'FLAT'
      const amount = transaction.fineAmount !== undefined ? transaction.fineAmount : 100

      if (type === 'DAILY') {
        const daysOverdue = Math.floor((new Date() - new Date(transaction.returnDate)) / (1000 * 60 * 60 * 24))
        if (daysOverdue > 0) {
          const calculatedFine = daysOverdue * amount
          if (transaction.extraCharge !== calculatedFine) {
            transaction.extraCharge = calculatedFine
            await transaction.save()
          }
        }
      } else {
        // FLAT fine type
        if (transaction.extraCharge === 0) {
          transaction.extraCharge = amount
          await transaction.save()
        }
      }
    }
  } catch (error) {
    console.error('Error updating book Fine CHARGE : ', error)
  }
}

module.exports = CheckBookReturnRouter
