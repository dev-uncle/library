import React from 'react'
import { NavLink } from 'react-router-dom'
import { sidebarData } from './sidebarData'
import { useSidebar } from '../context/SidebarContext'
import './sidebar.css'

const Sidebar = () => {
  const { isOpen } = useSidebar()

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--closed'}`}>
      <nav className='sidebar-nav'>
        {sidebarData.map((group) => (
          <div className='sidebar-group' key={group.group}>
            {/* Group label — hidden when collapsed */}
            <span className='sidebar-group-label'>{group.group}</span>

            <ul className='sidebar-list'>
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id} className='sidebar-item'>
                    <NavLink
                      to={item.url}
                      end={item.exact}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
                      }
                      title={item.title}
                    >
                      <span className='sidebar-icon'>
                        <Icon size={20} />
                      </span>
                      <span className='sidebar-label'>{item.title}</span>
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

export default Sidebar