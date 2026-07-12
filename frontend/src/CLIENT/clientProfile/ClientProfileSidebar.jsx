import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSidebar } from '../../ADMIN/context/SidebarContext'
import {
  HiOutlineBookOpen,
  HiOutlineIdentification,
  HiOutlineArrowRightOnRectangle,
  HiOutlineHome
} from 'react-icons/hi2'

const ClientProfileSidebar = () => {
  const { isOpen } = useSidebar()

  const menuGroups = [
    {
      group: 'Student Panel',
      items: [
        {
          id: 'dashboard',
          title: 'My Books',
          url: '/profile',
          exact: true,
          icon: HiOutlineBookOpen,
        },
        {
          id: 'details',
          title: 'My Details',
          url: '/profile/details',
          exact: false,
          icon: HiOutlineIdentification,
        },
      ],
    },
    {
      group: 'System',
      items: [
        {
          id: 'home',
          title: 'Back to Library',
          url: '/',
          exact: false,
          icon: HiOutlineHome,
        },
        {
          id: 'logout',
          title: 'Logout',
          url: '/profile/logout',
          exact: false,
          icon: HiOutlineArrowRightOnRectangle,
        },
      ],
    },
  ]

  return (
    <aside className={`profile-sidebar ${isOpen ? 'profile-sidebar--open' : 'profile-sidebar--closed'}`}>
      <nav className='profile-sidebar-nav'>
        {menuGroups.map((group) => (
          <div className='profile-sidebar-group' key={group.group}>
            <span className='profile-sidebar-group-label'>{group.group}</span>

            <ul className='profile-sidebar-list'>
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id} className='profile-sidebar-item'>
                    <NavLink
                      to={item.url}
                      end={item.exact}
                      className={({ isActive }) =>
                        `profile-sidebar-link ${isActive ? 'profile-sidebar-link--active' : ''}`
                      }
                      title={item.title}
                    >
                      <span className='profile-sidebar-icon'>
                        <Icon size={20} />
                      </span>
                      <span className='profile-sidebar-label'>{item.title}</span>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default ClientProfileSidebar
