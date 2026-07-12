import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { backend_server } from './main'

const AuthContext = createContext(null)

export const LoginState = ({ children }) => {
  const [userLogState, setUserLogState] = useState(null)
  const [userType, setUserType] = useState(null)
  const [requestedBookIds, setRequestedBookIds] = useState([])

  // Client password verification modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordResolver, setPasswordResolver] = useState(null)
  const [submittingPassword, setSubmittingPassword] = useState(false)

  const fetchUserTransactions = useCallback(async () => {
    const email = localStorage.getItem('userLogState')
    if (!email) return

    try {
      const response = await axios.post(`${backend_server}/api/v1/users`)
      const transactions = response.data.bookDataAll ?? []
      // Find IDs of books that are requested/borrowed (not returned, not cancelled)
      const activeIds = transactions
        .filter((t) => !t.isReturned && t.issueStatus !== 'CANCELLED')
        .map((t) => t.bookId)
      setRequestedBookIds(activeIds)
    } catch (error) {
      console.log('Error fetching user transactions:', error)
    }
  }, [])

  useEffect(() => {
    const storedUserLogState = localStorage.getItem('userLogState')
    const storedUserType = localStorage.getItem('userType')

    if (storedUserLogState && storedUserType) {
      setUserLogState(storedUserLogState)
      setUserType(storedUserType)
      fetchUserTransactions()
    }
  }, [fetchUserTransactions])

  const login = (user_email, user_role) => {
    setUserLogState(user_email)
    localStorage.setItem('userLogState', user_email)
    setUserType(user_role)
    localStorage.setItem('userType', user_role)
    fetchUserTransactions()
  }

  const logout = () => {
    setUserLogState(null)
    setUserType(null)
    setRequestedBookIds([])
    localStorage.removeItem('userLogState')
    localStorage.removeItem('userType')
  }

  const addRequestedBookId = (bookId) => {
    setRequestedBookIds((prev) => [...prev, bookId])
  }

  // Resolves to true if password verified, resolves to false if cancelled
  const promptPassword = () => {
    setPasswordValue('')
    setPasswordError('')
    setIsPasswordModalOpen(true)
    return new Promise((resolve) => {
      setPasswordResolver(() => resolve)
    })
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!passwordValue) {
      setPasswordError('Password is required')
      return
    }

    setSubmittingPassword(true)
    setPasswordError('')
    try {
      await axios.post(`${backend_server}/api/v1/users/verify-password`, {
        password: passwordValue,
      })
      if (passwordResolver) passwordResolver(true)
      setIsPasswordModalOpen(false)
    } catch (err) {
      console.log(err)
      const msg = err.response?.data?.message || 'Incorrect password'
      setPasswordError(msg)
    } finally {
      setSubmittingPassword(false)
    }
  }

  const handlePasswordCancel = () => {
    if (passwordResolver) passwordResolver(false)
    setIsPasswordModalOpen(false)
  }

  return (
    <AuthContext.Provider
      value={{
        userLogState,
        login,
        logout,
        requestedBookIds,
        addRequestedBookId,
        fetchUserTransactions,
        promptPassword,
      }}
    >
      {children}

      {/* Global Client Password Modal */}
      {isPasswordModalOpen && (
        <div className='client-modal-overlay'>
          <div className='client-modal-card'>
            <h3 className='client-modal-title'>Verify Your Password</h3>
            <p className='client-modal-subtitle'>
              For your security, please enter your password to confirm this request.
            </p>
            <form onSubmit={handlePasswordSubmit} className='client-modal-form'>
              <div className='client-modal-input-wrap'>
                <input
                  type='password'
                  placeholder='Enter password'
                  className='client-modal-input'
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  disabled={submittingPassword}
                  autoFocus
                  required
                />
              </div>
              {passwordError && <p className='client-modal-error'>{passwordError}</p>}
              <div className='client-modal-actions'>
                <button
                  type='button'
                  className='client-modal-btn client-modal-btn--cancel'
                  onClick={handlePasswordCancel}
                  disabled={submittingPassword}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='client-modal-btn client-modal-btn--submit'
                  disabled={submittingPassword}
                >
                  {submittingPassword ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export const useLoginState = () => {
  return useContext(AuthContext)
}
