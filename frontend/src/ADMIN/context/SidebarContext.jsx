import React, { createContext, useContext, useState, useEffect } from 'react'

const SidebarContext = createContext(null)

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(() => {
    const stored = localStorage.getItem('admin-sidebar-open')
    return stored !== null ? JSON.parse(stored) : true
  })

  useEffect(() => {
    localStorage.setItem('admin-sidebar-open', JSON.stringify(isOpen))
  }, [isOpen])

  const toggle = () => setIsOpen((prev) => !prev)

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}
