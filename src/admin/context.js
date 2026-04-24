import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

// Keep TokenContext alias so existing pages don't need to change
export const TokenContext = AuthContext
export const useToken    = useAuth
