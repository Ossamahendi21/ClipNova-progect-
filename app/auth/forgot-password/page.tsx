"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // TODO: Implement password reset logic
    setTimeout(() => {
      setIsLoading(false)
      setIsEmailSent(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full bg-card p-8 rounded-xl shadow-lg border border-border/50">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-70 animate-pulse"></div>
                <div className="absolute inset-1 bg-background rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-emerald-500 rounded-sm rotate-45"></div>
                </div>
              </div>
              <span className="text-xl font-bold">
                Clip<span className="text-emerald-500">Nova</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold">Reset your password</h1>
            <p className="text-muted-foreground mt-2">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {!isEmailSent ? (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  disabled={isLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-500 mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Check your email</h3>
              <p className="text-muted-foreground">
                We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/auth/signin"
              className="text-sm text-emerald-500 hover:text-emerald-600"
            >
              <Icons.arrowLeft className="inline-block mr-1 h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="mt-8" asChild>
          <Link href="/">
            <Icons.arrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  )
} 