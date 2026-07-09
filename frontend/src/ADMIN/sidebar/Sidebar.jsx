import React from 'react'
import { NavLink } from 'react-router-dom'
import { sidebarData } from './sidebarData'
import './sidebar.css'

const Sidebar = () => {
  return (
    <nav className='sidebar'>
      <ul className='nav flex-column'>
        {sidebarData.map((panelItem) => (
          <li className='nav-item sidebar-nav-item' key={panelItem.id}>
            <NavLink
              to={panelItem.url}
              className={({ isActive }) =>
                `nav-link sidebar-nav-link ${isActive ? "active" : ""}`
              }
            >
              {panelItem.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Sidebar