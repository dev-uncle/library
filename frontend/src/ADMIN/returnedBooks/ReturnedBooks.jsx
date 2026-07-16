import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { backend_server } from '../../main'
import './returnedbooks.css'
import '../booksRequests/booksrequests.css' // Reuse the request modal CSS styles
import {
  HiOutlineInbox,
  HiOutlineEnvelope,
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlineCurrencyRupee,
  HiOutlineXMark,
  HiOutlineUser,
  HiOutlineChatBubbleBottomCenterText
} from 'react-icons/hi2'

const ReturnedBooks = () => {
  const NOT_RETURNED_API = `${backend_server}/api/v1/requestBooks/notreturnedbooks`
  const Update_Return_Status_API = `${backend_server}/api/v1/requestBooks`

  const [notReturnedBooks, setNotReturnedBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAnyBooksPending, setIsAnyBooksPending] = useState(false)

  // Modal and verification states
  const [selectedBook, setSelectedBook] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
  const [submittingModal, setSubmittingModal] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [formData, setFormData] = useState({
    isReturned: 'false',
    remark: '',
    issuedBy: 'Admin'
  })

  const fetchNotReturnedBooks = async () => {
    try {
      const response = await axios.get(NOT_RETURNED_API)
      const books = response.data.data ?? []
      setNotReturnedBooks(books)
      setIsAnyBooksPending(books.length > 0)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotReturnedBooks()
  }, [])

  const handleOpenModal = (book) => {
    setSelectedBook(book)
    setFormData({
      isReturned: book.isReturned ? 'true' : 'false',
      remark: book.remark || '',
      issuedBy: book.issuedBy || 'Admin'
    })
    setIsModalOpen(true)
  }

  const handleMainFormSubmit = (e) => {
    e.preventDefault()
    setAdminPassword('')
    setIsVerifyModalOpen(true)
  }

  const handleVerifyAndConfirm = async (e) => {
    e.preventDefault()
    if (!adminPassword) {
      toast.error('Admin password is required')
      return
    }

    setSubmittingModal(true)
    try {
      // 1. Password Verification API Call
      await axios.post(`${backend_server}/api/v1/users/verify-password`, {
        password: adminPassword
      })

      // 2. Update Return Status API Call
      const updateReturnStatus = formData.isReturned === 'true'
      await axios.patch(Update_Return_Status_API, {
        id: selectedBook._id,
        isReturned: updateReturnStatus,
        issueStatus: updateReturnStatus ? 'RETURNED' : 'ACCEPTED',
        remark: formData.remark,
        issuedBy: formData.issuedBy
      })

      toast.success('Book return status processed successfully')
      setIsVerifyModalOpen(false)
      setIsModalOpen(false)
      fetchNotReturnedBooks()
    } catch (error) {
      console.log(error)
      const msg = error.response?.data?.message || 'Verification or update failed'
      toast.error(msg)
    } finally {
      setSubmittingModal(false)
    }
  }

  const isOverdue = (returnDate) => {
    if (!returnDate) return false
    return new Date(returnDate) < new Date()
  }

  return (
    <div className='page-content'>
      <div className='rt-page'>
        {/* ── Header ──────────────────────────── */}
        <div className='rt-header'>
          <div>
            <h1 className='rt-title'>Return Due Books</h1>
            <p className='rt-subtitle'>Monitor return deadlines and update returned status for active loans.</p>
          </div>
          {!loading && isAnyBooksPending && (
            <span className='rt-count-badge'>
              {notReturnedBooks.length} pending
            </span>
          )}
        </div>

        {/* ── Content ─────────────────────────── */}
        {loading ? (
          <div className='rt-skeleton-wrap'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='rt-skeleton-row' />
            ))}
          </div>
        ) : isAnyBooksPending && notReturnedBooks.length > 0 ? (
          <div className='rt-table-card'>
            <div className='rt-table-wrap'>
              <table className='rt-table'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>
                      <span className='rt-th-inner'>
                        <HiOutlineEnvelope size={13} />
                        Email
                      </span>
                    </th>
                    <th>
                      <span className='rt-th-inner'>
                        <HiOutlineBookOpen size={13} />
                        Book
                      </span>
                    </th>
                    <th>
                      <span className='rt-th-inner'>
                        <HiOutlineCalendar size={13} />
                        Return Due
                      </span>
                    </th>
                    <th>Return Status</th>
                    <th>
                      <span className='rt-th-inner'>
                        <HiOutlineCurrencyRupee size={13} />
                        Charge
                      </span>
                    </th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {notReturnedBooks.map((book, index) => {
                    const {
                      _id,
                      userEmail,
                      bookTitle,
                      isReturned,
                      returnDate,
                      extraCharge,
                    } = book

                    const overdue = !isReturned && isOverdue(returnDate)

                    return (
                      <tr key={_id} className={overdue ? 'rt-row--overdue' : ''}>
                        <td className='rt-td-num'>{index + 1}</td>
                        <td className='rt-td-muted'>{userEmail}</td>
                        <td className='rt-td-book'>
                          <HiOutlineBookOpen size={14} className='rt-book-icon' />
                          {bookTitle}
                        </td>
                        <td className={overdue ? 'rt-td-overdue' : 'rt-td-muted'}>
                          {new Date(returnDate).toDateString()}
                        </td>
                        <td>
                          <span className={`rt-badge ${isReturned ? 'rt-badge--returned' : 'rt-badge--notreturned'}`}>
                            {isReturned ? 'Returned' : 'Not Returned'}
                          </span>
                        </td>
                        <td className='rt-td-bold'>
                          {extraCharge > 0 ? (
                            <span className='rt-charge--due'>Nrs. {extraCharge}/-</span>
                          ) : (
                            <span className='rt-charge--none'>Nrs. 0/-</span>
                          )}
                        </td>
                        <td>
                          <button
                            className='rt-update-btn'
                            onClick={() => handleOpenModal(book)}
                          >
                            Process
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className='rt-empty'>
            <HiOutlineInbox size={42} />
            <p>0 Book's left to RETURN</p>
          </div>
        )}
      </div>

      {/* ── Main Processing Modal ── */}
      {isModalOpen && selectedBook && (
        <div className='br-modal-overlay'>
          <div className='br-modal-card br-modal-card--wide'>
            <div className='br-modal-header'>
              <h3 className='br-modal-title'>Process Book Return</h3>
              <button type='button' className='br-modal-close' onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleMainFormSubmit} className='br-modal-form'>
              <div className='br-modal-form-grid'>
                {/* Left Column - Details */}
                <div className='br-modal-form-col'>
                  <div className='br-modal-details-card-wrap'>
                    <div className='br-modal-detail-item'>
                      <strong>Book Title</strong>
                      <span>{selectedBook.bookTitle}</span>
                    </div>
                    <div className='br-modal-detail-item'>
                      <strong>Borrower Email</strong>
                      <span>{selectedBook.userEmail}</span>
                    </div>
                    <div className='br-modal-detail-item'>
                      <strong>Return Deadline</strong>
                      <span className={isOverdue(selectedBook.returnDate) && !selectedBook.isReturned ? 'rt-td-overdue' : ''}>
                        {new Date(selectedBook.returnDate).toDateString()}
                      </span>
                    </div>
                    <div className='br-modal-detail-item'>
                      <strong>Fine (Extra Charge)</strong>
                      <span style={{ fontWeight: '700', color: selectedBook.extraCharge > 0 ? '#fb7185' : '#10b981' }}>
                        Nrs. {selectedBook.extraCharge}/-
                      </span>
                    </div>
                    <div className='br-modal-detail-item'>
                      <strong>Fine Behavior</strong>
                      <span>
                        {selectedBook.fineType === 'DAILY'
                          ? `Daily Rate (Nrs. ${selectedBook.fineAmount || 10}/day)`
                          : `Flat Fee (Nrs. ${selectedBook.fineAmount || 100})`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Inputs */}
                <div className='br-modal-form-col'>
                  <div className='br-modal-field'>
                    <label htmlFor='modal-return-status'>Return Status</label>
                    <select
                      id='modal-return-status'
                      className='br-modal-select'
                      value={formData.isReturned}
                      onChange={(e) => setFormData({ ...formData, isReturned: e.target.value })}
                    >
                      <option value='false'>Not Returned</option>
                      <option value='true'>Returned</option>
                    </select>
                  </div>

                  <div className='br-modal-field'>
                    <label htmlFor='modal-processed-by'>Processed By</label>
                    <input
                      id='modal-processed-by'
                      type='text'
                      className='br-modal-input'
                      value={formData.issuedBy}
                      onChange={(e) => setFormData({ ...formData, issuedBy: e.target.value })}
                      required
                    />
                  </div>

                  <div className='br-modal-field'>
                    <label htmlFor='modal-remark'>Return Remarks / Notes</label>
                    <textarea
                      id='modal-remark'
                      className='br-modal-textarea'
                      placeholder='E.g., Returned in good condition, damages fee collected...'
                      value={formData.remark}
                      onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className='br-modal-actions'>
                <button type='button' className='br-modal-btn br-modal-btn--cancel' onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type='submit' className='br-modal-btn br-modal-btn--submit'>
                  Confirm & Process
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Admin Password Verification Modal ── */}
      {isVerifyModalOpen && (
        <div className='br-modal-overlay br-modal-overlay--verify'>
          <div className='br-modal-card br-modal-card--verify'>
            <div className='br-modal-header'>
              <h3 className='br-modal-title'>Verify Admin Credentials</h3>
              <button type='button' className='br-modal-close' onClick={() => setIsVerifyModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleVerifyAndConfirm} className='br-modal-form'>
              <p className='br-modal-verify-text'>
                Please enter your administrator password to authorize and complete this action.
              </p>

              <div className='br-modal-field'>
                <label htmlFor='verify-password'>Admin Password</label>
                <input
                  id='verify-password'
                  type='password'
                  placeholder='Confirm with your password'
                  className='br-modal-input'
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className='br-modal-actions'>
                <button type='button' className='br-modal-btn br-modal-btn--cancel' onClick={() => setIsVerifyModalOpen(false)}>
                  Go Back
                </button>
                <button type='submit' className='br-modal-btn br-modal-btn--submit' disabled={submittingModal}>
                  {submittingModal ? 'Authorizing...' : 'Authorize & Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReturnedBooks
