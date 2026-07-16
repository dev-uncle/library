import React, { useState } from 'react'
import { backend_server } from '../../main'
import { Modal } from 'react-bootstrap'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'
import {
  HiOutlineBookOpen,
  HiOutlineInbox,
  HiOutlineTag,
  HiOutlineClipboardDocumentList,
  HiOutlineCreditCard,
  HiOutlineXMark,
  HiOutlineTrash
} from 'react-icons/hi2'

const ClientDashboard = ({ userBookData = [], userData = {}, onUpdate }) => {
  const DELETE_BOOK_API = `${backend_server}/api/v1/requestBooks`

  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const handleOpenDetails = (transaction) => {
    setSelectedTransaction(transaction)
    setShowDetailsModal(true)
  }

  const handleCloseDetails = () => {
    setSelectedTransaction(null)
    setShowDetailsModal(false)
  }

  const handleRemoveBook = async (transactionId, issueStatus) => {
    try {
      const response = await axios.patch(DELETE_BOOK_API, {
        id: transactionId,
        issueStatus,
      })

      if (issueStatus === 'DELETE') {
        toast.success('Request Cancelled successfully')
      } else {
        toast.success('Record Removed successfully')
      }
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.log(error)
      toast.error('An error occurred. Please try again.')
    }
  }

  // Calculate local metrics
  const pendingRequests = userBookData.filter(b => b.issueStatus?.toUpperCase() === 'PENDING').length
  const readyToCollect = userBookData.filter(b => b.issueStatus?.toUpperCase() === 'READY').length
  const borrowedBooks = userBookData.filter(b => b.issueStatus?.toUpperCase() === 'ACCEPTED' && !b.isReturned).length
  const totalFines = userBookData.reduce((sum, b) => sum + (b.extraCharge || 0), 0)

  const statsList = [
    {
      id: 1,
      label: 'Accepted Overall',
      value: Math.max(0, userData.totalAcceptedBooks ?? 0),
      icon: HiOutlineBookOpen,
      color: 'amber'
    },
    {
      id: 2,
      label: 'Pending Requests',
      value: pendingRequests,
      icon: HiOutlineInbox,
      color: 'violet'
    },
    {
      id: 3,
      label: 'Ready to Collect',
      value: readyToCollect,
      icon: HiOutlineTag,
      color: 'blue'
    },
    {
      id: 4,
      label: 'Borrowed Active',
      value: borrowedBooks,
      icon: HiOutlineClipboardDocumentList,
      color: 'emerald'
    },
    {
      id: 5,
      label: 'Extra Charges',
      value: `Nrs. ${totalFines}`,
      icon: HiOutlineCreditCard,
      color: 'rose'
    }
  ]

  const getStatusBadge = (status, isReturned, remark) => {
    const s = status?.toUpperCase()
    if (isReturned) {
      return (
        <div className='d-flex flex-column align-items-start gap-1'>
          <span className='status-badge status-badge--returned'>Returned</span>
          {remark && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Note: {remark}</span>}
        </div>
      )
    }
    switch (s) {
      case 'PENDING':
        return (
          <div className='d-flex flex-column align-items-start gap-1'>
            <span className='status-badge status-badge--pending'>Pending</span>
            {remark && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Note: {remark}</span>}
          </div>
        )
      case 'READY':
        return (
          <div className='d-flex flex-column align-items-start gap-1'>
            <span className='status-badge status-badge--ready'>Ready to Pick</span>
            {remark && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '500' }}>Note: {remark}</span>}
          </div>
        )
      case 'ACCEPTED':
      case 'ISSUED':
        return (
          <div className='d-flex flex-column align-items-start gap-1'>
            <span className='status-badge status-badge--issued'>Issued</span>
            {remark && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Note: {remark}</span>}
          </div>
        )
      case 'CANCELLED':
        return (
          <div className='d-flex flex-column align-items-start gap-1'>
            <span className='status-badge status-badge--cancelled'>Cancelled</span>
            {remark && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Reason: {remark}</span>}
          </div>
        )
      default:
        return (
          <div className='d-flex flex-column align-items-start gap-1'>
            <span className='status-badge'>{status}</span>
            {remark && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Note: {remark}</span>}
          </div>
        )
    }
  }

  return (
    <div className='dashboard'>
      {/* ── Welcome header ───────────────────── */}
      <div className='dashboard-header mb-4'>
        <h1 className='dashboard-title'>My Dashboard</h1>
        <p className='dashboard-subtitle'>
          Welcome back, {userData.username ? userData.username.toUpperCase() : 'Student'}. Here's your library dashboard summary.
        </p>
      </div>

      {/* ── Stats cards grid ─────────────────── */}
      <div className='client-stat-grid mb-4'>
        {statsList.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.id} className={`client-stat-card client-stat-card--${stat.color}`}>
              <div className='client-stat-card__icon-wrap'>
                <Icon size={22} />
              </div>
              <div className='client-stat-card__body'>
                <span className='client-stat-card__value'>{stat.value}</span>
                <span className='client-stat-card__label'>{stat.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Section Header ───────────────────── */}
      <div className='dashboard-section'>
        <h2 className='dashboard-section-title'>My Book Requests & Logs</h2>
        
        {/* User Books data table */}
        {userBookData.length > 0 ? (
          <div className='profile-table-card mt-3'>
            <div className='profile-table-wrap'>
              <table className='profile-table'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Book Title</th>
                    <th scope='col'>Issue Status</th>
                    <th scope='col'>Issue Date</th>
                    <th scope='col'>Return Due</th>
                    <th scope='col'>Returned</th>
                    <th scope='col'>Extra Charge</th>
                    <th scope='col' className='text-end pe-4'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userBookData.map((users, index) => {
                    const {
                      bookTitle,
                      _id,
                      issueStatus,
                      isReturned,
                      extraCharge,
                      issueDate,
                      returnDate,
                      remark,
                    } = users

                    const bookissuedate = issueDate ? new Date(issueDate).toDateString() : 'N/A'
                    const returnOrNot = isReturned === true ? 'Yes' : 'No'
                    const updatedReturnDate = !returnDate ? 'NONE' : new Date(returnDate).toDateString()

                    return (
                      <tr key={_id}>
                        <th scope='row' style={{ paddingLeft: '1rem' }}>{index + 1}</th>
                        <td style={{ fontWeight: '500', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {bookTitle}
                        </td>
                        <td>{getStatusBadge(issueStatus, isReturned, remark)}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{bookissuedate}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{updatedReturnDate}</td>
                        <td style={{ fontSize: '0.85rem' }}>{returnOrNot}</td>
                        <td style={{ fontWeight: '600', color: extraCharge > 0 ? 'var(--accent)' : 'inherit' }}>
                          Nrs. {extraCharge} /-
                        </td>
                        <td className='text-end pe-3'>
                          {issueStatus === 'PENDING' ? (
                            <button
                              className='profile-action-btn profile-btn-cancel gap-1'
                              onClick={() => handleRemoveBook(_id, 'DELETE')}
                            >
                              <HiOutlineXMark size={14} /> Cancel
                            </button>
                          ) : null}
                          {issueStatus === 'READY' ? (
                            <div className='d-flex gap-2 justify-content-end'>
                              <button
                                className='profile-action-btn profile-btn-view'
                                onClick={() => handleOpenDetails(users)}
                              >
                                View
                              </button>
                              <button
                                className='profile-action-btn profile-btn-cancel gap-1'
                                onClick={() => handleRemoveBook(_id, 'DELETE')}
                              >
                                <HiOutlineXMark size={14} /> Cancel
                              </button>
                            </div>
                          ) : null}
                          {issueStatus === 'ACCEPTED' || issueStatus === 'ISSUED' ? (
                            <button
                              className='profile-action-btn profile-btn-view'
                              onClick={() => handleOpenDetails(users)}
                            >
                              View
                            </button>
                          ) : null}
                          {issueStatus === 'RETURNED' ? (
                            <button
                              className='profile-action-btn profile-btn-remove gap-1'
                              onClick={() => handleRemoveBook(_id, 'ALREADYRETURNED')}
                            >
                              <HiOutlineTrash size={14} /> Remove
                            </button>
                          ) : null}
                          {issueStatus === 'CANCELLED' ? (
                            <button
                              className='profile-action-btn profile-btn-remove gap-1'
                              onClick={() => handleRemoveBook(_id, 'ADMINCANCELLED')}
                            >
                              <HiOutlineTrash size={14} /> Remove
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className='text-center py-5 border rounded-3 mt-3' style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <p className='text-muted mb-0'>No book logs or requests found.</p>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      <Modal show={showDetailsModal} onHide={handleCloseDetails} centered contentClassName='client-modal-card-override'>
        <Modal.Header closeButton style={{ borderBottom: '1px solid var(--border-color)', background: 'transparent' }}>
          <Modal.Title style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.25rem' }}>
            Book Request Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ background: 'transparent', padding: '1.5rem' }}>
          {selectedTransaction && (
            <div className='d-flex flex-column gap-3'>
              <div className='border-bottom pb-2' style={{ borderColor: 'var(--border-inner)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Book Title</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                  {selectedTransaction.bookTitle}
                </span>
              </div>

              <div className='row border-bottom pb-2' style={{ borderColor: 'var(--border-inner)', marginLeft: 0, marginRight: 0 }}>
                <div className='col-6 p-0'>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Status</span>
                  <span>{getStatusBadge(selectedTransaction.issueStatus, selectedTransaction.isReturned, selectedTransaction.remark)}</span>
                </div>
                <div className='col-6 p-0'>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Extra Charges</span>
                  <span style={{ fontWeight: '600', color: selectedTransaction.extraCharge > 0 ? 'var(--accent)' : 'var(--text-primary)' }}>
                    Nrs. {selectedTransaction.extraCharge} /-
                  </span>
                </div>
              </div>

              <div className='row border-bottom pb-2' style={{ borderColor: 'var(--border-inner)', marginLeft: 0, marginRight: 0 }}>
                <div className='col-6 p-0'>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Request Date</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                    {selectedTransaction.issueDate ? new Date(selectedTransaction.issueDate).toDateString() : 'N/A'}
                  </span>
                </div>
                <div className='col-6 p-0'>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Return Due Date</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                    {selectedTransaction.returnDate ? new Date(selectedTransaction.returnDate).toDateString() : 'NONE'}
                  </span>
                </div>
              </div>

              {/* Fine Behavior */}
              {selectedTransaction.issueStatus !== 'CANCELLED' && (
                <div className='border-bottom pb-2' style={{ borderColor: 'var(--border-inner)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Fine Behavior</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                    {selectedTransaction.fineType === 'DAILY'
                      ? `Daily Rate (Nrs. ${selectedTransaction.fineAmount || 10}/day)`
                      : `Flat Fee (Nrs. ${selectedTransaction.fineAmount || 100})`}
                  </span>
                </div>
              )}

              {selectedTransaction.issuedBy && (
                <div className='border-bottom pb-2' style={{ borderColor: 'var(--border-inner)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Issued By</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                    {selectedTransaction.issuedBy}
                  </span>
                </div>
              )}

              <div className='pb-1'>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Librarian Remarks / Notes</span>
                <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                  {selectedTransaction.remark || 'No remarks provided.'}
                </span>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer style={{ borderTop: '1px solid var(--border-color)', background: 'transparent' }}>
          <button 
            className='profile-action-btn profile-btn-remove px-4' 
            onClick={handleCloseDetails}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ClientDashboard
