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
  HiOutlineCheckCircle,
} from 'react-icons/hi2'

const STATUS_OPTIONS = [
  { value: 'PENDING',   label: 'Pending' },
  { value: 'READY',     label: 'Ready to Pick' },
  { value: 'ACCEPTED',  label: 'Accepted' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const statusClass = (status) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':   return 'br-badge--pending'
    case 'READY':     return 'br-badge--ready'
    case 'ACCEPTED':  return 'br-badge--accepted'
    case 'CANCELLED': return 'br-badge--cancelled'
    default:          return ''
  }
}

const BooksRequests = () => {
  const API_URL = `${backend_server}/api/v1/requestBooks`

  const [pendingBooks, setPendingBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasRequests, setHasRequests] = useState(true)

  // Per-row selected status
  const [rowStatus, setRowStatus] = useState({})
  // Per-row updating spinner
  const [updating, setUpdating] = useState({})

  const fetchPendingBooks = async () => {
    try {
      const response = await axios.get(API_URL)
      const totalHits = response.data.totalHits
      if (totalHits === 0) {
        setHasRequests(false)
      } else {
        const books = response.data.data
        setPendingBooks(books)
        // Seed per-row status from current issueStatus
        const initial = {}
        books.forEach((b) => { initial[b._id] = b.issueStatus?.toUpperCase() || 'PENDING' })
        setRowStatus(initial)
      }
    } catch (error) {
      console.log(error.response)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPendingBooks() }, [])

  const handleSelectChange = (id, value) => {
    setRowStatus((prev) => ({ ...prev, [id]: value }))
  }

  const handleUpdate = async (id) => {
    setUpdating((prev) => ({ ...prev, [id]: true }))
    try {
      await axios.patch(API_URL, { id, issueStatus: rowStatus[id] })
      toast.success('Request updated successfully')
      fetchPendingBooks()
    } catch (error) {
      toast.error('Failed to update request')
      console.log(error.response)
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }))
    }
  }

  return (
    <div className='page-content'>
      <div className='br-page'>

        {/* ── Header ───────────────────────────── */}
        <div className='br-header'>
          <div>
            <h1 className='br-title'>Book Requests</h1>
            <p className='br-subtitle'>Review and update pending borrow requests from users.</p>
          </div>
          {!loading && hasRequests && (
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
                    <th><span className='br-th-inner'><HiOutlineUser size={13} />Username</span></th>
                    <th><span className='br-th-inner'><HiOutlineEnvelope size={13} />Email</span></th>
                    <th><span className='br-th-inner'><HiOutlineBookOpen size={13} />Book</span></th>
                    <th>Current Status</th>
                    <th>Update Status</th>
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
                          <span className={`br-badge ${statusClass(issueStatus)}`}>
                            {issueStatus}
                          </span>
                        </td>
                        <td>
                          <div className='br-action-row'>
                            <select
                              className='br-select'
                              value={rowStatus[_id] || issueStatus?.toUpperCase()}
                              onChange={(e) => handleSelectChange(_id, e.target.value)}
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <button
                              className='br-update-btn'
                              onClick={() => handleUpdate(_id)}
                              disabled={updating[_id]}
                            >
                              <HiOutlineCheckCircle size={15} />
                              {updating[_id] ? 'Saving…' : 'Update'}
                            </button>
                          </div>
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
    </div>
  )
}

export default BooksRequests
