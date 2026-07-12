import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { backend_server } from '../../main'

const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [readSet, setReadSet] = useState(() => {
    const stored = localStorage.getItem('admin-notif-read')
    return stored ? new Set(JSON.parse(stored)) : new Set()
  })

  const fetchNotifications = useCallback(async () => {
    try {
      const [reqRes, overdueRes] = await Promise.allSettled([
        axios.get(`${backend_server}/api/v1/requestBooks`),
        axios.get(`${backend_server}/api/v1/requestBooks/notreturnedbooks`),
      ])

      const pending =
        reqRes.status === 'fulfilled'
          ? (reqRes.value.data.data ?? [])
              .filter((r) => r.issueStatus?.toUpperCase() === 'PENDING')
              .map((r) => ({
                id: `req-${r._id}`,
                type: 'request',
                title: 'New Book Request',
                message: `${r.username} requested "${r.bookTitle}"`,
                link: '/admin/booksrequests',
                timestamp: new Date(r.createdAt || Date.now()),
              }))
          : []

      const overdue =
        overdueRes.status === 'fulfilled'
          ? (overdueRes.value.data.data ?? [])
              .filter((b) => b.returnDate && new Date(b.returnDate) < new Date())
              .map((b) => ({
                id: `over-${b._id}`,
                type: 'overdue',
                title: 'Overdue Book Warning',
                message: `"${b.bookTitle}" is overdue (borrowed by ${b.username})`,
                link: '/admin/issuedbooks',
                timestamp: new Date(b.returnDate),
              }))
          : []

      // Merge and sort by timestamp descending
      const merged = [...pending, ...overdue].sort((a, b) => b.timestamp - a.timestamp)
      setNotifications(merged)
    } catch (err) {
      console.error('Error fetching notifications:', err)
    }
  }, [])

  // Poll notifications
  useEffect(() => {
    fetchNotifications()
    const intervalId = setInterval(fetchNotifications, 60000)
    return () => clearInterval(intervalId)
  }, [fetchNotifications])

  // Sync readSet to localStorage
  useEffect(() => {
    localStorage.setItem('admin-notif-read', JSON.stringify(Array.from(readSet)))
  }, [readSet])

  const markRead = (id) => {
    setReadSet((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const markAllRead = () => {
    setReadSet((prev) => {
      const next = new Set(prev)
      notifications.forEach((n) => next.add(n.id))
      return next
    })
  }

  const unreadCount = notifications.filter((n) => !readSet.has(n.id)).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        readSet,
        markRead,
        markAllRead,
        refresh: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}
