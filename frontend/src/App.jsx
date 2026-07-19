import React, { useState, useEffect } from 'react'
import ClientApp from './CLIENT/ClientApp'
import AdminAPP from './ADMIN/AdminAPP'
import { backend_server } from './main'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'

import { ThemeProvider } from './ADMIN/context/ThemeContext'

// conditionally rendering home page based on user Role/Type
const App = () => {
  const UPDATE_BOOK_FINE = `${backend_server}/api/v1/checkbookreturn`

  const [userType, setUserType] = useState(() => localStorage.getItem('userType') || '')

  const updateBookCharges = async () => {
    // hits api endpoints that runs book fine charge if not returned
    try {
      await axios.get(UPDATE_BOOK_FINE)
    } catch (error) {
      console.log('Error updating book charges:', error)
    }
  }

  useEffect(() => {
    updateBookCharges()
  }, [])

  return (
    <ThemeProvider>
      <Toaster />
      {userType === 'admin_user' ? <AdminAPP /> : <ClientApp />}
    </ThemeProvider>
  )
}

export default App
