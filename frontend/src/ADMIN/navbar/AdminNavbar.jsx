import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HiOutlineMenuAlt2,
  HiOutlineBell,
  HiOutlineChevronRight,
} from 'react-icons/hi'
import { HiOutlineArrowRightOnRectangle, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2'
import { useSidebar } from '../context/SidebarContext'
import { useTheme } from '../context/ThemeContext'
import { useNotification } from '../context/NotificationContext'
import NotificationDropdown from './NotificationDropdown'
import './navbar.css'

/* Map route segments → human-readable labels */
const routeLabels = {
  admin: 'Dashboard',
  managebooks: 'Manage Books',
  addnewbook: 'Add New Book',
  booksrequests: "Book Requests",
  viewusers: 'View Users',
  issuedbooks: 'Issued Books',
  issuebooktouser: 'Issue Book to User',
  returnedbooks: 'Return Due Books',
  logout: 'Logout',
  adminsignup: 'Create Admin',
  otp: 'OTP Verification',
}

const buildBreadcrumb = (pathname) => {
  const segments = pathname.split('/').filter(Boolean)
  return segments.map((seg) => ({
    label: routeLabels[seg] ?? seg,
    raw: seg,
  }))
}

const AdminNavbar = () => {
  const { toggle } = useSidebar()
  const { theme, toggleTheme } = useTheme()
  const { unreadCount } = useNotification()
  const [notifOpen, setNotifOpen] = useState(false)
  const location = useLocation()
  const breadcrumb = buildBreadcrumb(location.pathname)

  return (
    <header className='admin-topbar'>
      {/* ── Left: toggle + brand ──────────────── */}
      <div className='topbar-left'>
        <button
          id='topbar-toggle-btn'
          className='topbar-icon-btn'
          onClick={toggle}
          aria-label='Toggle sidebar'
        >
          <HiOutlineMenuAlt2 size={22} />
        </button>

        <Link to='/admin' className='topbar-brand'>
          <div className='topbar-logo-wrap'>
            <img src='/book-min.png' alt='CDM Library Logo' width={30} />
          </div>
          <span className='topbar-brand-text'>CDM Library</span>
        </Link>
      </div>

      {/* ── Center: breadcrumb ───────────────── */}
      <div className='topbar-center'>
        <nav className='topbar-breadcrumb' aria-label='Breadcrumb'>
          {breadcrumb.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <HiOutlineChevronRight className='breadcrumb-sep' size={14} />
              )}
              <span
                className={`breadcrumb-item ${
                  i === breadcrumb.length - 1 ? 'breadcrumb-active' : ''
                }`}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* ── Right: actions + profile ─────────── */}
      <div className='topbar-right'>
        {/* Theme toggle */}
        <button
          id='topbar-theme-btn'
          className='topbar-icon-btn theme-toggle-btn'
          onClick={toggleTheme}
          aria-label='Toggle theme'
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark'
            ? <HiOutlineSun size={20} />
            : <HiOutlineMoon size={20} />}
        </button>

        {/* Notification bell */}
        <div className="notif-wrapper" style={{ position: 'relative' }}>
          <button
            id='topbar-notif-btn'
            className={`topbar-icon-btn ${notifOpen ? 'topbar-icon-btn--active' : ''}`}
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label='Notifications'
          >
            <HiOutlineBell size={22} />
            {unreadCount > 0 && <span className='notif-badge'>{unreadCount}</span>}
          </button>
          <NotificationDropdown isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* Admin avatar */}
        <div className='admin-profile'>
          <div className='admin-avatar' aria-label='Admin avatar'>
            A
          </div>
          <span className='admin-name'>Admin</span>
        </div>

        {/* Quick logout */}
        <Link to='/admin/logout' id='topbar-logout-btn' className='topbar-icon-btn logout-btn' aria-label='Logout'>
          <HiOutlineArrowRightOnRectangle size={22} />
        </Link>
      </div>
    </header>
  )
}

export default AdminNavbar
