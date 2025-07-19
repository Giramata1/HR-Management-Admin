// src/components/AuthContext.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface UserType {
  fullName: string
  email: string
  role: string
  profileImage?: string
}

interface AuthContextType {
  user: UserType | null
  setUser: (user: UserType | null) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          if (
            parsedUser &&
            typeof parsedUser === 'object' &&
            'fullName' in parsedUser &&
            'email' in parsedUser &&
            'role' in parsedUser
          ) {
            setUser(parsedUser as UserType)
          } else {
            setUser(null)
            localStorage.removeItem('user')
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error)
        setUser(null)
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    const handleStorageChange = () => {
      loadUser()
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}