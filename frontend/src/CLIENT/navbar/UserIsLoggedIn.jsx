import React from 'react'
import { Link } from 'react-router-dom'
import navbarData from './navbardata'
import './navbar.css'

const UserIsLoggedIn = () => {
  const { navbarLinksIsAuthenticated } = navbarData
  return (
    <>
      {navbarLinksIsAuthenticated.map((map_para, index) => {
        const { name, url } = map_para
        return (
          <li className='nav-item' key={index}>
            <Link to={url} className='nav-link modern-nav-link'>
              {name}
            </Link>
          </li>
        )
      })}
    </>
  )
}

export default UserIsLoggedIn
