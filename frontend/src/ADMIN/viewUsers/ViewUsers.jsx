import React, { useState, useEffect } from 'react'
import useFetch from '../../useFetch'
import { backend_server } from '../../main'
import { Link } from 'react-router-dom'
import './viewusers.css'
import {
  HiOutlineUsers,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineBookOpen,
  HiOutlineArrowRight,
} from 'react-icons/hi2'

const ViewUsers = () => {
  const users_api = `${backend_server}/api/v1/users`
  const [totalUsers, setTotalUsers] = useState([])

  const { fetched_data, loading } = useFetch(users_api)
  const data = fetched_data.data

  useEffect(() => {
    if (data) setTotalUsers(data)
  }, [data])

  return (
    <div className='page-content'>
      <div className='vu-page'>

        {/* ── Header ──────────────────────────── */}
        <div className='vu-header'>
          <div>
            <h1 className='vu-title'>View Users</h1>
            <p className='vu-subtitle'>All registered library members and their book activity.</p>
          </div>
          {!loading && totalUsers.length > 0 && (
            <span className='vu-count-badge'>
              {totalUsers.length} user{totalUsers.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* ── Content ─────────────────────────── */}
        {loading ? (
          <div className='vu-skeleton-wrap'>
            {[...Array(6)].map((_, i) => <div key={i} className='vu-skeleton-row' />)}
          </div>
        ) : totalUsers && totalUsers.length > 0 ? (
          <div className='vu-table-card'>
            <div className='vu-table-wrap'>
              <table className='vu-table'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th><span className='vu-th-inner'><HiOutlineUser size={13} />Username</span></th>
                    <th><span className='vu-th-inner'><HiOutlineEnvelope size={13} />Email</span></th>
                    <th><span className='vu-th-inner'><HiOutlinePhone size={13} />Phone</span></th>
                    <th><span className='vu-th-inner'><HiOutlineBookOpen size={13} />Books Held</span></th>
                    <th>Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {totalUsers.map((user, index) => {
                    const { _id, username, email, phone, totalAcceptedBooks } = user
                    const initials = username?.slice(0, 2).toUpperCase() || '??'
                    return (
                      <tr key={_id}>
                        <td className='vu-td-num'>{index + 1}</td>
                        <td>
                          <div className='vu-user-cell'>
                            <div className='vu-avatar'>{initials}</div>
                            <span className='vu-username'>{username}</span>
                          </div>
                        </td>
                        <td className='vu-td-muted'>{email}</td>
                        <td className='vu-td-muted'>{phone || '—'}</td>
                        <td>
                          <span className={`vu-books-badge ${totalAcceptedBooks > 0 ? 'vu-books-badge--active' : ''}`}>
                            {totalAcceptedBooks ?? 0}
                          </span>
                        </td>
                        <td>
                          <Link to={`/admin/viewusers/${_id}`} className='vu-view-btn'>
                            View <HiOutlineArrowRight size={13} />
                          </Link>
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
            <HiOutlineUsers size={42} />
            <p>No registered users found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewUsers
