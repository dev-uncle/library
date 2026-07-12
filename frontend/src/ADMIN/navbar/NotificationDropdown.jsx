import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNotification } from '../context/NotificationContext'
import { HiOutlineCheck, HiOutlineInbox, HiOutlineChevronRight } from 'react-icons/hi2'
import './notificationdropdown.css'

const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications, readSet, markRead, markAllRead } = useNotification()
  const dropdownRef = useRef(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest('#topbar-notif-btn')
      ) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Format time helper
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="notif-dropdown" ref={dropdownRef}>
      <div className="notif-dropdown__header">
        <h4 className="notif-dropdown__title">Notifications</h4>
        {notifications.some(n => !readSet.has(n.id)) && (
          <button className="notif-dropdown__mark-all-btn" onClick={markAllRead}>
            <HiOutlineCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="notif-dropdown__body">
        {notifications.length === 0 ? (
          <div className="notif-dropdown__empty">
            <HiOutlineInbox size={32} className="notif-dropdown__empty-icon" />
            <p className="notif-dropdown__empty-text">You're all caught up</p>
          </div>
        ) : (
          <div className="notif-dropdown__list">
            {notifications.map((item) => {
              const isRead = readSet.has(item.id)
              return (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`notif-item ${isRead ? 'notif-item--read' : 'notif-item--unread'} notif-item--${item.type}`}
                  onClick={() => {
                    markRead(item.id)
                    onClose()
                  }}
                >
                  <div className="notif-item__indicator" />
                  <div className="notif-item__content">
                    <span className="notif-item__title">{item.title}</span>
                    <span className="notif-item__message">{item.message}</span>
                    <span className="notif-item__time">{formatTimeAgo(item.timestamp)}</span>
                  </div>
                  <HiOutlineChevronRight size={14} className="notif-item__arrow" />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationDropdown
