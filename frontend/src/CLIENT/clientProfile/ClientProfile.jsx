import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useLoginState } from '../../LoginState'
import axios from 'axios'
import { backend_server } from '../../main'
import { SidebarProvider, useSidebar } from '../../ADMIN/context/SidebarContext'
import { ThemeProvider } from '../../ADMIN/context/ThemeContext'
import ClientProfileTopbar from './ClientProfileTopbar'
import ClientProfileSidebar from './ClientProfileSidebar'
import ClientDashboard from './ClientDashboard'
import ClientDetails from './ClientDetails'
import ClientArchive from './ClientArchive'
import ClientLogout from '../clientLogout/ClientLogout'
import './client-profile-layout.css'

const ClientProfileLayout = () => {
  const { isOpen, toggle } = useSidebar()
  const getSingleUser_API_URL = `${backend_server}/api/v1/users/`

  const [userBookData, setUserBookData] = useState([])
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const response = await axios.post(getSingleUser_API_URL, {})
      const bookData = response.data.bookDataAll
      const usersData = response.data.userData

      if (bookData) {
        setUserBookData(bookData)
      }
      if (usersData) {
        setUserData(usersData)
      }
    } catch (error) {
      console.log(error.response)
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // Save original styles
    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlHeight = document.documentElement.style.height
    const originalBodyHeight = document.body.style.height

    // Disable viewport-level scrolling for the layout shell
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.height = '100vh'
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100vh'

    return () => {
      // Revert styles when leaving the layout
      document.documentElement.style.overflow = originalHtmlOverflow
      document.documentElement.style.height = originalHtmlHeight
      document.body.style.overflow = originalBodyOverflow
      document.body.style.height = originalBodyHeight
    }
  }, [])

  if (loading || !userData) {
    return (
      <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh', background: 'var(--bg-shell)', color: '#fff' }}>
        <div className='text-center'>
          <div className='spinner-border text-warning' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
          <p className='mt-2 text-muted'>Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`profile-shell ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <ClientProfileTopbar userData={userData} />
      <ClientProfileSidebar />
      {/* Mobile backdrop — tap to close sidebar */}
      <div className='profile-sidebar-backdrop' onClick={toggle} />
      <main className='profile-main'>
        <div className='page-content'>
          <Routes>
            <Route path='/' element={<ClientDashboard userBookData={userBookData} userData={userData} onUpdate={fetchData} />} />
            <Route path='/details' element={<ClientDetails userData={userData} onUpdate={fetchData} />} />
            <Route path='/archive' element={<ClientArchive userData={userData} />} />
            <Route path='/logout' element={<ClientLogout />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

const ClientProfile = () => {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <ClientProfileLayout />
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default ClientProfile
