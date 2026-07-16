import React, { useEffect, useState } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import './activitylog.css'
import {
  HiOutlineInbox,
  HiOutlineBookOpen,
  HiOutlineUser,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowPath
} from 'react-icons/hi2'

const ActivityLog = () => {
  const API_URL = `${backend_server}/api/v1/requestBooks/activity-log`

  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('')

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await axios.get(API_URL, {
        params: {
          search: search || undefined,
          action: actionFilter || undefined
        }
      })
      setLogs(response.data.data ?? [])
    } catch (error) {
      console.error('Error fetching activity logs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [actionFilter])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchLogs()
  }

  const formatAction = (action) => {
    switch (action) {
      case 'REQUESTED': return 'Requested'
      case 'READY': return 'Ready to Pick'
      case 'ISSUED': return 'Issued'
      case 'RETURNED': return 'Returned'
      case 'CANCELLED_BY_ADMIN': return 'Cancelled (Admin)'
      case 'CANCELLED_BY_USER': return 'Cancelled (Student)'
      case 'ARCHIVED': return 'Archived'
      default: return action
    }
  }

  const getActionBadgeClass = (action) => {
    switch (action) {
      case 'REQUESTED': return 'al-badge--requested'
      case 'READY': return 'al-badge--ready'
      case 'ISSUED': return 'al-badge--issued'
      case 'RETURNED': return 'al-badge--returned'
      case 'CANCELLED_BY_ADMIN':
      case 'CANCELLED_BY_USER': return 'al-badge--cancelled'
      case 'ARCHIVED': return 'al-badge--archived'
      default: return ''
    }
  }

  return (
    <div className='page-content'>
      <div className='al-page'>
        {/* ── Header ───────────────────────────── */}
        <div className='al-header'>
          <div>
            <h1 className='al-title'>Request Activity Log</h1>
            <p className='al-subtitle'>Track the complete lifecycle and history of all book borrow requests.</p>
          </div>
          <button className='al-refresh-btn' onClick={fetchLogs} title="Refresh Logs">
            <HiOutlineArrowPath size={18} />
          </button>
        </div>

        {/* ── Filter Bar ────────────────────────── */}
        <div className='al-filter-card'>
          <form onSubmit={handleSearchSubmit} className='al-filter-form'>
            <div className='al-search-box'>
              <HiOutlineMagnifyingGlass className='al-search-icon' />
              <input
                type='text'
                placeholder='Search student, email, or book...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='al-search-input'
              />
              <button type='submit' className='al-search-btn'>Search</button>
            </div>

            <div className='al-select-box'>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className='al-filter-select'
              >
                <option value=''>All Actions</option>
                <option value='REQUESTED'>Requested</option>
                <option value='READY'>Ready to Pick</option>
                <option value='ISSUED'>Issued</option>
                <option value='RETURNED'>Returned</option>
                <option value='CANCELLED_BY_ADMIN'>Cancelled by Admin</option>
                <option value='CANCELLED_BY_USER'>Cancelled by Student</option>
                <option value='ARCHIVED'>Archived</option>
              </select>
            </div>
          </form>
        </div>

        {/* ── Table / Content ───────────────────── */}
        {loading ? (
          <div className='al-skeleton-wrap'>
            {[...Array(5)].map((_, i) => <div key={i} className='al-skeleton-row' />)}
          </div>
        ) : logs.length === 0 ? (
          <div className='al-empty'>
            <HiOutlineInbox size={42} />
            <p>No activity logs found</p>
          </div>
        ) : (
          <div className='al-table-card'>
            <div className='al-table-wrap'>
              <table className='al-table'>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th><span className='al-th-inner'><HiOutlineUser size={13} />Student</span></th>
                    <th><span className='al-th-inner'><HiOutlineBookOpen size={13} />Book Title</span></th>
                    <th>Performed By</th>
                    <th><span className='al-th-inner'><HiOutlineChatBubbleBottomCenterText size={13} />Remarks</span></th>
                    <th>Charges Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const { _id, timestamp, action, username, userEmail, bookTitle, performedBy, remark, fineAmount } = log
                    return (
                      <tr key={_id}>
                        <td className='al-td-date'>
                          {new Date(timestamp).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </td>
                        <td>
                          <span className={`al-badge ${getActionBadgeClass(action)}`}>
                            {formatAction(action)}
                          </span>
                        </td>
                        <td>
                          <div className='al-student-info'>
                            <span className='al-student-name'>{username}</span>
                            <span className='al-student-email'>{userEmail}</span>
                          </div>
                        </td>
                        <td className='al-td-book'>
                          <HiOutlineBookOpen size={14} className='al-book-icon' />
                          {bookTitle}
                        </td>
                        <td className='al-td-muted'>{performedBy}</td>
                        <td className='al-td-remark'>
                          {remark ? (
                            <span className='al-remark-text' title={remark}>{remark}</span>
                          ) : (
                            <span className='al-remark-none'>—</span>
                          )}
                        </td>
                        <td className='al-td-bold'>
                          {fineAmount > 0 ? (
                            <span className='al-charge--due'>Nrs. {fineAmount}/-</span>
                          ) : (
                            <span className='al-charge--none'>—</span>
                          )}
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

export default ActivityLog
