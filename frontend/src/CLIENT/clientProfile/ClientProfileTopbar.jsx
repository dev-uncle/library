import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HiOutlineMenuAlt2,
  HiOutlineChevronRight,
} from 'react-icons/hi'
import {
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineHome,
  HiOutlineArrowRightOnRectangle
} from 'react-icons/hi2'
import { useSidebar } from '../../ADMIN/context/SidebarContext'
import { useTheme } from '../../ADMIN/context/ThemeContext'

const routeLabels = {
  profile: 'Profile',
  details: 'My Details',
  logout: 'Logout',
}

const buildBreadcrumb = (pathname) => {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 1 && segments[0] === 'profile') {
    return [
      { label: 'Profile', raw: 'profile' },
      { label: 'My Books', raw: 'books' }
    ]
  }
  return segments.map((seg) => ({
    label: routeLabels[seg] ?? seg,
    raw: seg,
  }))
}

const ClientProfileTopbar = ({ userData }) => {
  const { toggle } = useSidebar()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const breadcrumb = buildBreadcrumb(location.pathname)

  // Get initials for avatar
  const getInitials = () => {
    if (!userData || !userData.username) return 'S'
    return userData.username.charAt(0).toUpperCase()
  }

  // Get display name
  const getDisplayName = () => {
    if (!userData || !userData.username) return 'Student'
    return userData.username
  }

  return (
    <header className='profile-topbar'>
      {/* ── Left: toggle + brand ──────────────── */}
      <div className='profile-topbar-left'>
        <button
          className='profile-topbar-icon-btn'
          onClick={toggle}
          aria-label='Toggle sidebar'
        >
          <HiOutlineMenuAlt2 size={22} />
        </button>

        <Link to='/' className='profile-topbar-brand'>
          <div className='profile-topbar-logo-wrap'>
            <img src='/book-min.png' alt='Library Logo' width={30} />
          </div>
          <span className='profile-topbar-brand-text'>CDM Library</span>
        </Link>
      </div>

      {/* ── Center: breadcrumb ───────────────── */}
      <div className='profile-topbar-center'>
        <nav className='profile-topbar-breadcrumb' aria-label='Breadcrumb'>
          {breadcrumb.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <HiOutlineChevronRight className='breadcrumb-sep' size={14} style={{ color: 'var(--text-muted)', margin: '0 4px', opacity: 0.5 }} />
              )}
              <span
                className={`breadcrumb-item ${
                  i === breadcrumb.length - 1 ? 'breadcrumb-active' : ''
                }`}
                style={{
                  color: i === breadcrumb.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: i === breadcrumb.length - 1 ? '600' : '500',
                  fontSize: '0.8rem',
                  textTransform: 'capitalize'
                }}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* ── Right: actions + profile ─────────── */}
      <div className='profile-topbar-right'>
        {/* Return Home */}
        <Link
          to='/'
          className='profile-topbar-icon-btn'
          title='Back to Library Homepage'
        >
          <HiOutlineHome size={20} />
        </Link>

        {/* Theme toggle */}
        <button
          className='profile-topbar-icon-btn theme-toggle-btn'
          onClick={toggleTheme}
          aria-label='Toggle theme'
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
        </button>

        {/* User badge */}
        <div className='profile-user-badge'>
          <div className='profile-avatar-circle'>
            {getInitials()}
          </div>
          <span className='profile-user-name'>{getDisplayName()}</span>
        </div>

        {/* Quick logout */}
        <Link
          to='/profile/logout'
          className='profile-topbar-icon-btn logout-btn'
          aria-label='Logout'
          title='Logout'
        >
          <HiOutlineArrowRightOnRectangle size={22} />
        </Link>
      </div>
    </header>
  )
}

export default ClientProfileTopbar
