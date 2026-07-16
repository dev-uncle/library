import React, { useEffect, useState } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import './booksrequests.css'
import {
  HiOutlineInbox,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineBookOpen,
} from 'react-icons/hi2'

const BooksRequests = () => {
  const API_URL = `${backend_server}/api/v1/requestBooks`

  const [pendingBooks, setPendingBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasRequests, setHasRequests] = useState(true)

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  
  const [formData, setFormData] = useState({
    issueStatus: 'READY',
    remark: '',
    issuedBy: 'Admin',
    returnDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })
  
  const [adminPassword, setAdminPassword] = useState('')
  const [submittingModal, setSubmittingModal] = useState(false)

  const fetchPendingBooks = async () => {
    try {
      const response = await axios.get(API_URL)
      const totalHits = response.data.totalHits
      if (totalHits === 0) {
        setHasRequests(false)
        setPendingBooks([])
      } else {
        const books = response.data.data
        setPendingBooks(books)
        setHasRequests(true)
      }
    } catch (error) {
      console.log(error.response)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingBooks()
  }, [])

  const handleOpenModal = (request) => {
    setSelectedRequest(request)
    setFormData({
      issueStatus: 'READY',
      remark: request.remark || '',
      issuedBy: 'Admin',
      returnDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      fineType: 'DAILY',
      fineAmount: 10
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

      // 2. Update Request Status API Call
      await axios.patch(API_URL, {
        id: selectedRequest._id,
        issueStatus: formData.issueStatus,
        remark: formData.remark,
        issuedBy: formData.issuedBy,
        returnDate: formData.issueStatus !== 'CANCELLED' ? formData.returnDate : undefined,
        fineType: formData.issueStatus !== 'CANCELLED' ? formData.fineType : undefined,
        fineAmount: formData.issueStatus !== 'CANCELLED' ? Number(formData.fineAmount) : undefined
      })

      toast.success('Book request processed successfully')
      setIsVerifyModalOpen(false)
      setIsModalOpen(false)
      fetchPendingBooks()
    } catch (error) {
      console.log(error.response)
      const msg = error.response?.data?.message || 'Verification or update failed'
      toast.error(msg)
    } finally {
      setSubmittingModal(false)
    }
  }

  return (
    <div className='page-content'>
      <div className='br-page'>

        {/* ── Header ───────────────────────────── */}
        <div className='br-header'>
          <div>
            <h1 className='br-title'>Book Requests</h1>
            <p className='br-subtitle'>Review and process pending borrow requests from students.</p>
          </div>
          {!loading && hasRequests && pendingBooks.length > 0 && (
            <span className='br-count-badge'>
              {pendingBooks.length} request{pendingBooks.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* ── Content ──────────────────────────── */}
        {loading ? (
          <div className='br-skeleton-wrap'>
            {[...Array(5)].map((_, i) => <div key={i} className='br-skeleton-row' />)}
          </div>
        ) : !hasRequests || pendingBooks.length === 0 ? (
          <div className='br-empty'>
            <HiOutlineInbox size={42} />
            <p>No pending book requests</p>
          </div>
        ) : (
          <div className='br-table-card'>
            <div className='br-table-wrap'>
              <table className='br-table'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th><span className='br-th-inner'><HiOutlineUser size={13} />Student</span></th>
                    <th><span className='br-th-inner'><HiOutlineEnvelope size={13} />Email</span></th>
                    <th><span className='br-th-inner'><HiOutlineBookOpen size={13} />Book</span></th>
                    <th>Current Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBooks.map((book, index) => {
                    const { _id, userEmail, bookTitle, issueStatus, username } = book
                    return (
                      <tr key={_id}>
                        <td className='br-td-num'>{index + 1}</td>
                        <td className='br-td-bold'>{username}</td>
                        <td className='br-td-muted'>{userEmail}</td>
                        <td className='br-td-book'>
                          <HiOutlineBookOpen size={14} className='br-book-icon' />
                          {bookTitle}
                        </td>
                        <td>
                          <span className={`br-badge br-badge--pending`}>
                            {issueStatus}
                          </span>
                        </td>
                        <td>
                          <button
                            className='br-process-btn'
                            onClick={() => handleOpenModal(book)}
                          >
                            Process Request
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Main Process Request Modal ────────── */}
      {isModalOpen && (
        <div className='br-modal-overlay'>
          <div className='br-modal-card br-modal-card--wide'>
            <div className='br-modal-header'>
              <h3 className='br-modal-title'>Process Book Request</h3>
              <button type='button' className='br-modal-close' onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleMainFormSubmit} className='br-modal-form'>
              <div className='br-modal-form-grid'>
                
                {/* Left Column */}
                <div className='br-modal-form-col'>
                  <div className='br-modal-details-card-wrap'>
                    <div className='br-modal-detail-item'>
                      <strong>Student Name</strong>
                      <span>{selectedRequest?.username}</span>
                    </div>
                    <div className='br-modal-detail-item'>
                      <strong>Student Email</strong>
                      <span>{selectedRequest?.userEmail}</span>
                    </div>
                    <div className='br-modal-detail-item br-modal-detail-item--full'>
                      <strong>Book Requested</strong>
                      <span>{selectedRequest?.bookTitle}</span>
                    </div>
                  </div>

                  <div className='br-modal-field'>
                    <label htmlFor='modal-issue-status'>Action / Status</label>
                    <select
                      id='modal-issue-status'
                      className='br-modal-select'
                      value={formData.issueStatus}
                      onChange={(e) => setFormData({ ...formData, issueStatus: e.target.value })}
                    >
                      <option value='READY'>Ready to Pick</option>
                      <option value='ACCEPTED'>Accept & Issue Book</option>
                      <option value='CANCELLED'>Cancel / Reject Request</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className='br-modal-form-col'>
                  {formData.issueStatus !== 'CANCELLED' && (
                    <>
                      <div className='br-modal-field'>
                        <label htmlFor='modal-return-date'>Return Date Limit</label>
                        <input
                          id='modal-return-date'
                          type='date'
                          className='br-modal-input'
                          value={formData.returnDate}
                          onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                          required
                        />
                      </div>

                      <div className='br-modal-field'>
                        <label htmlFor='modal-fine-type'>Overdue Fine Type</label>
                        <select
                          id='modal-fine-type'
                          className='br-modal-select'
                          value={formData.fineType}
                          onChange={(e) => {
                            const type = e.target.value
                            setFormData({
                              ...formData,
                              fineType: type,
                              fineAmount: type === 'DAILY' ? 10 : 100
                            })
                          }}
                        >
                          <option value='DAILY'>Daily Fee</option>
                          <option value='FLAT'>Flat Fee</option>
                        </select>
                      </div>

                      <div className='br-modal-field'>
                        <label htmlFor='modal-fine-amount'>
                          {formData.fineType === 'DAILY' ? 'Daily Rate (Nrs / day)' : 'Flat Fee Amount (Nrs)'}
                        </label>
                        <input
                          id='modal-fine-amount'
                          type='number'
                          className='br-modal-input'
                          value={formData.fineAmount}
                          onChange={(e) => setFormData({ ...formData, fineAmount: e.target.value })}
                          min={0}
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className='br-modal-field'>
                    <label htmlFor='modal-issued-by'>Issued By</label>
                    <input
                      id='modal-issued-by'
                      type='text'
                      className='br-modal-input'
                      value={formData.issuedBy}
                      onChange={(e) => setFormData({ ...formData, issuedBy: e.target.value })}
                      required
                    />
                  </div>

                  <div className='br-modal-field'>
                    <label htmlFor='modal-remark'>Remarks / Notes</label>
                    <textarea
                      id='modal-remark'
                      className='br-modal-textarea'
                      placeholder='E.g., Checked conditions, ID verified...'
                      value={formData.remark}
                      onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                      rows={2}
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

      {/* ── Secondary Admin Password Verification Modal ── */}
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

export default BooksRequests
