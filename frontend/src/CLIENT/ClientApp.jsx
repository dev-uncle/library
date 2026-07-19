import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './navbar/Navbar'
import AuthPage from './auth/AuthPage'
import Home from './home/Home'
import FeaturedBooks from './featuredBooks/FeaturedBooks'
import Books from './books/Books'
import Footer from './footer/Footer'
import AboutUsPage from './about/AboutUsPage'
import PagenotFound from './404-pageNotFound/PagenotFound'
import { LoginState } from '../LoginState'
import ClientProfile from './clientProfile/ClientProfile'
import ViewBook from './viewBooks/ViewBook'
import ForgotPassword from './forgotPassword/ForgotPassword'
import OtpForm from './otpForm/OtpForm'

const ClientAppContent = () => {
  const location = useLocation()
  const isProfilePage = location.pathname.startsWith('/profile')
  const authRoutes = ['/login', '/signup', '/forgotpassword', '/otp']
  const isAuthPage = authRoutes.includes(location.pathname)

  return (
    <div className='d-flex flex-column min-vh-100'>
      {!isProfilePage && <Navbar />}
      <div className='flex-grow-1'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<AuthPage />} />
          <Route path='/signup' element={<AuthPage />} />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
          <Route path='/menu' element={<FeaturedBooks />} />
          <Route path='/books' element={<Books />} />
          <Route path='/books/:id' element={<ViewBook />} />
          <Route path='/profile/*' element={<ClientProfile />} />
          <Route path='/about' element={<AboutUsPage />} />
          <Route path='/otp' element={<OtpForm />} />

          <Route path='*' element={<PagenotFound />} />
        </Routes>
      </div>
      {!isProfilePage && !isAuthPage && <Footer />}
    </div>
  )
}

const ClientApp = () => {
  return (
    <LoginState>
      <Router>
        <ClientAppContent />
      </Router>
    </LoginState>
  )
}

export default ClientApp

