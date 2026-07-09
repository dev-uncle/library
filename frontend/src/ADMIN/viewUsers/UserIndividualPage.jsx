import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { backend_server } from '../../main'
import useFetch from '../../useFetch'
import { MdVerified } from 'react-icons/md'
import { GoUnverified } from 'react-icons/go'
import toast from 'react-hot-toast'
import axios from 'axios'
import './viewusers.css'
import {
  HiOutlineArrowLeft,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineBookOpen,
  HiOutlinePencilSquare,
  HiOutlineXMark,
  HiOutlineUser,
} from 'react-icons/hi2'

const statusBadgeClass = (status) => {
  switch (status?.toUpperCase()) {
    case 'ACCEPTED':  return 'vu-status--accepted'
    case 'PENDING':   return 'vu-status--pending'
    case 'CANCELLED': return 'vu-status--cancelled'
    case 'READY':     return 'vu-status--ready'
    default:          return ''
  }
}

const UserIndividualPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const getSingleUser_API_URL = `${backend_server}/api/v1/users/${id}`
  const UpdateClientEmail_API_URL = `${backend_server}/api/v1/updateUserEmail`

  const [userBookData, setUserBookData] = useState([])
  const [userData, setUserData] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [updating, setUpdating] = useState(false)

  const { fetched_data, loading } = useFetch(getSingleUser_API_URL)
  const bookData  = fetched_data.bookData
  const usersData = fetched_data.userData

  useEffect(() => {
    if (bookData)  setUserBookData(bookData)
    if (usersData) setUserData(usersData)
  }, [bookData, usersData])

  const handleEmailUpdate = async (e) => {
    e.preventDefault()
    const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/
    if (!emailRegex.test(newEmail)) {
      return toast('Invalid email format — must be a Gmail address', { icon: 'ℹ️' })
    }
    setUpdating(true)
    try {
      const response = await axios.post(UpdateClientEmail_API_URL, { userId: id, newEmail })
      if (response.data.ENTER_OTP === true) {
        navigate('/admin/otp', { replace: true })
        toast(response.data.message, { icon: 'ℹ️' })
      }
    } catch (error) {
      toast.error('Failed to update email')
      console.log(error)
    } finally {
      setUpdating(false)
    }
  }

  const initials = userData?.username?.slice(0, 2).toUpperCase() || '??'

  return (
    <div className='page-content'>
      <div className='vu-page'>

        {/* ── Back + Header ───────────────────── */}
        <div className='vu-header'>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <button className='vu-back-btn' onClick={() => navigate(-1)}>
              <HiOutlineArrowLeft size={16} /> Back
            </button>
            <div>
              <h1 className='vu-title'>User Profile</h1>
              <p className='vu-subtitle'>Viewing member details and book history.</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className='vu-skeleton-wrap'>
            {[...Array(4)].map((_, i) => <div key={i} className='vu-skeleton-row' />)}
          </div>
        ) : userData ? (
          <>
            {/* ── Profile card ──────────────── */}
            <div className='uip-profile-card'>
              {/* Avatar */}
              <div className='uip-avatar-col'>
                <div className='uip-avatar'>{initials}</div>
                <p className='uip-avatar-name'>{userData.username}</p>
                <span className={`uip-verified-badge ${userData.emailVerified ? 'uip-verified--yes' : 'uip-verified--no'}`}>
                  {userData.emailVerified
                    ? <><MdVerified size={14} /> Verified</>
                    : <><GoUnverified size={14} /> Unverified</>
                  }
                </span>
              </div>

              {/* Info grid */}
              <div className='uip-info-grid'>
                <div className='uip-info-item'>
                  <span className='uip-info-label'><HiOutlineUser size={13} /> Username</span>
                  <span className='uip-info-value'>{userData.username}</span>
                </div>
                <div className='uip-info-item'>
                  <span className='uip-info-label'><HiOutlineEnvelope size={13} /> Email</span>
                  <div className='uip-info-email-row'>
                    <span className='uip-info-value'>{userData.email}</span>
                    <button className='uip-edit-email-btn' onClick={() => setShowModal(true)}>
                      <HiOutlinePencilSquare size={14} /> Edit
                    </button>
                  </div>
                </div>
                <div className='uip-info-item'>
                  <span className='uip-info-label'><HiOutlinePhone size={13} /> Phone</span>
                  <span className='uip-info-value'>{userData.phone || '—'}</span>
                </div>
                <div className='uip-info-item'>
                  <span className='uip-info-label'><HiOutlineBookOpen size={13} /> Books Held</span>
                  <span className='uip-info-value'>{userData.totalAcceptedBooks ?? 0}</span>
                </div>
              </div>
            </div>

            {/* ── Book history table ─────────── */}
            <div className='uip-section-label'>Book History</div>
            {userBookData.length > 0 ? (
              <div className='vu-table-card'>
                <div className='vu-table-wrap'>
                  <table className='vu-table'>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Book Title</th>
                        <th>Issue Status</th>
                        <th>Issue Date</th>
                        <th>Return Due</th>
                        <th>Returned</th>
                        <th>Extra Charge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userBookData.map((item, index) => {
                        const { _id, bookTitle, issueStatus, isReturned, extraCharge, issueDate, returnDate } = item
                        return (
                          <tr key={_id}>
                            <td className='vu-td-num'>{index + 1}</td>
                            <td className='vu-td-book'>
                              <HiOutlineBookOpen size={14} className='vu-book-icon' />
                              {bookTitle}
                            </td>
                            <td>
                              <span className={`vu-status-badge ${statusBadgeClass(issueStatus)}`}>
                                {issueStatus}
                              </span>
                            </td>
                            <td className='vu-td-muted'>{new Date(issueDate).toDateString()}</td>
                            <td className='vu-td-muted'>
                              {returnDate ? new Date(returnDate).toDateString() : '—'}
                            </td>
                            <td>
                              <span className={`vu-returned-badge ${isReturned ? 'vu-returned--yes' : 'vu-returned--no'}`}>
                                {isReturned ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className='vu-td-charge'>
                              {extraCharge > 0
                                ? <span className='vu-charge--due'>Nrs. {extraCharge} /-</span>
                                : <span className='vu-charge--clear'>Nrs. 0 /-</span>
                              }
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className='vu-empty'>
                <HiOutlineBookOpen size={36} />
                <p>No book history for this user</p>
              </div>
            )}
          </>
        ) : (
          <div className='vu-empty'>
            <HiOutlineUser size={36} />
            <p>User not found</p>
          </div>
        )}
      </div>

      {/* ── Edit Email Modal ─────────────────── */}
      {showModal && (
        <div className='uip-modal-overlay' onClick={() => setShowModal(false)}>
          <div className='uip-modal' onClick={(e) => e.stopPropagation()}>
            <div className='uip-modal-header'>
              <h2 className='uip-modal-title'>Update Email</h2>
              <button className='uip-modal-close' onClick={() => setShowModal(false)}>
                <HiOutlineXMark size={20} />
              </button>
            </div>
            <form className='uip-modal-body' onSubmit={handleEmailUpdate}>
              <div className='uip-modal-field'>
                <label className='uip-modal-label'>Current Email</label>
                <input className='uip-modal-input' type='text' value={userData?.email} disabled />
              </div>
              <div className='uip-modal-field'>
                <label className='uip-modal-label'>New Email</label>
                <input
                  className='uip-modal-input'
                  type='email'
                  placeholder='Enter new Gmail address'
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  autoComplete='off'
                  required
                />
              </div>
              <div className='uip-modal-actions'>
                <button type='button' className='uip-modal-cancel' onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type='submit' className='uip-modal-submit' disabled={updating}>
                  {updating ? 'Saving…' : 'Update Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserIndividualPage
