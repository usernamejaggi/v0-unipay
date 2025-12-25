"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  auth,
  signIn,
  signUp,
  signInWithGoogle,
  logOut,
  getUserProfile,
  updateUserProfile,
  subscribeToUserProfile,
  subscribeToNotifications,
  type UserProfile,
  type Notification,
  ADMIN_EMAILS,
} from "@/lib/firebase"
import { onAuthStateChanged, type User } from "firebase/auth"

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ success: boolean; isAdmin: boolean; error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  signInWithGoogle: () => Promise<{ success: boolean; isAdmin: boolean; error?: string }>
  logOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: string | null }>
  refreshProfile: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = profile?.isAdmin || false
  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const userProfile = await getUserProfile(firebaseUser.uid)
        setProfile(userProfile)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null
    let unsubscribeNotifications: (() => void) | null = null
  
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
  
      // Clean up old listeners
      if (unsubscribeProfile) unsubscribeProfile()
      if (unsubscribeNotifications) unsubscribeNotifications()
  
      if (firebaseUser) {
        const userProfile = await getUserProfile(firebaseUser.uid)
        setProfile(userProfile)
  
        unsubscribeProfile = subscribeToUserProfile(firebaseUser.uid, setProfile)
        unsubscribeNotifications = subscribeToNotifications(
          firebaseUser.uid,
          setNotifications,
        )
      } else {
        setProfile(null)
        setNotifications([])
      }
  
      setLoading(false)
    })
  
    return () => {
      unsubscribeAuth()
      if (unsubscribeProfile) unsubscribeProfile()
      if (unsubscribeNotifications) unsubscribeNotifications()
    }
  }, [])
  

  const handleSignIn = async (email: string, password: string) => {
    setError(null)
    setLoading(true)

    try {
      // Check if admin login
      const isAdminEmail = ADMIN_EMAILS.includes((auth.currentUser?.email || "").toLowerCase())


      // For admin, check password matches

      const result = await signIn(email, password)

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return { success: false, isAdmin: false, error: result.error }
      }

      setLoading(false)
      return { success: true, isAdmin: isAdminEmail }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      setLoading(false)
      return { success: false, isAdmin: false, error: errorMessage }
    }
  }

  const handleSignUp = async (email: string, password: string, name: string) => {
    setError(null)
    setLoading(true)

    const result = await signUp(email, password, name)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return { success: false, error: result.error }
    }

    setLoading(false)
    return { success: true }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)

    try {
      const result = await signInWithGoogle()

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return { success: false, isAdmin: false, error: result.error }
      }

      const isAdminEmail = ADMIN_EMAILS.includes((result.user?.email || "").toLowerCase())
      setLoading(false)
      return { success: true, isAdmin: isAdminEmail }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      setLoading(false)
      return { success: false, isAdmin: false, error: errorMessage }
    }
  }

  const handleLogOut = async () => {
    await logOut()
    setUser(null)
    setProfile(null)
    setNotifications([])
  }
  

  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return { error: "Not authenticated" }
    return await updateUserProfile(user.uid, data)
  }

  const refreshProfile = async () => {
    if (!user) return
    const userProfile = await getUserProfile(user.uid)
    setProfile(userProfile)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        notifications,
        unreadCount,
        loading,
        error,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signInWithGoogle: handleGoogleSignIn,
        logOut: handleLogOut,
        updateProfile: handleUpdateProfile,
        refreshProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
