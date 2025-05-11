"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    // In a real app, you would make an API call here
    const newUser = { email, name }
    localStorage.setItem("user", JSON.stringify(newUser))
    localStorage.setItem("credentials", JSON.stringify({ email, password }))
    setUser(newUser)
    router.push("/auth/signin")
  }

  const signIn = async (email: string, password: string) => {
    // In a real app, you would validate credentials against an API
    const storedCredentials = localStorage.getItem("credentials")
    if (storedCredentials) {
      const { email: storedEmail, password: storedPassword } = JSON.parse(storedCredentials)
      if (email === storedEmail && password === storedPassword) {
        const user = { email, name: "User" } // In a real app, you'd get the name from the API
        setUser(user)
        router.push("/dashboard")
      } else {
        throw new Error("Invalid credentials")
      }
    } else {
      throw new Error("No account found")
    }
  }

  const signOut = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/auth/signin")
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
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