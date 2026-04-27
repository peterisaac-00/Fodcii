"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication - in real app, this would call your auth API
      if (formData.email && formData.password) {
        login({
          id: "1",
          email: formData.email,
          name: formData.email.split("@")[0],
          avatar: "/diverse-user-avatars.png",
        })
        router.push("/problems")
      } else {
        setError("Please fill in all fields")
      }
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Abstract Background Decorative Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-primary-fixed/20 blur-[120px] -z-10"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[35rem] h-[35rem] rounded-full bg-secondary-fixed/30 blur-[100px] -z-10"></div>

        <div className="w-full max-w-[480px] z-10">
          {/* Brand Anchor */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-container rounded-xl flex items-center justify-center shadow-lg shadow-primary/10">
                <span className="text-white text-2xl">🏗️</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tighter text-primary font-headline">Fodci</span>
            </div>
          </div>

          {/* Main Auth Card */}
          <div className="bg-surface-container-lowest rounded-[2rem] p-10 md:p-12 shadow-[0px_20px_40px_rgba(0,33,22,0.06)] border border-outline-variant/10">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">Welcome back</h1>
              <p className="text-secondary text-sm font-medium">Precision engineering starts with your identity.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                    <span className="text-[20px]">✉️</span>
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-11 pr-4 py-4 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline/50 focus:ring-0 focus:bg-surface-container-lowest focus:border-primary/20 transition-all duration-300 border focus:shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary" htmlFor="password">
                    Password
                  </label>
                  <Link className="text-[11px] font-bold text-primary hover:text-primary-container transition-colors tracking-tight" href="#">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                    <span className="text-[20px]">🔒</span>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-11 pr-12 py-4 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline/50 focus:ring-0 focus:bg-surface-container-lowest focus:border-primary/20 transition-all duration-300 border focus:shadow-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto px-2 py-1 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-outline" />
                    ) : (
                      <Eye className="h-4 w-4 text-outline" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300 font-headline tracking-wide"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                <span className="bg-surface-container-lowest px-4 text-outline">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3.5 px-4 bg-surface-container-high rounded-xl hover:bg-surface-variant transition-colors group active:scale-[0.98]">
                <img alt="Google Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_a4gHuYpep9Y0HkjjgzX8b7QX2KGZdW_3jOg6bNE2z1z6Xgw4pn0CvsoMb8fnEdCuov2cE0GO3veZFhQTH6SxHVga5ApTQYHSBy77TF4HGvDlfVTjrVLm-b3sMXRbVu7uzPMVr-KUyF-87oA3RKBNopu50LYAonRM_YCkF2LWhVOkc4rbIE-MzRpQJLoVaMiJyC1k43nAUBOpZZOpL60sp6Vyjpe1TQ7BcYE8s65MmtjGYP8OT5GloBosFNLq9P5MzCqWxC-bcg" />
                <span className="text-sm font-semibold text-on-surface">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-3.5 px-4 bg-surface-container-high rounded-xl hover:bg-surface-variant transition-colors group active:scale-[0.98]">
                <img alt="GitHub Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb2m30BIs0fSPusduSHzw1QyZ_Dua_yFfdLK6nHEZM2qG7GWd1ESz8j1GpEUGRYKfeoh0mq6fyWCotrx_n-NggSUSsR6GIk-Ivsajf5W7nZEKaBVnmqpD5-1aD38dRZUBZxCGryvQxX_vqOJc_m7AFofASMQzEx-Emi8K_SMi-bQ6_HWUuZqPgMuQzTRmnC5D8CayPlu-CNmtzji2xsOfX5Nn29u12Rz8nEx7oaPVyDDWu1mYV2yK7odZhAtmal271ejWAFfxViQ" />
                <span className="text-sm font-semibold text-on-surface">GitHub</span>
              </button>
            </div>

            <p className="mt-10 text-center text-sm text-secondary font-medium">
              New to Fodci?
              <Link className="text-primary font-bold hover:underline underline-offset-4 ml-1" href="/signup">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row justify-between items-center px-12 py-12 w-full border-t border-emerald-900/5 bg-[#f3f3f5] dark:bg-slate-900 mt-auto">
        <div className="mb-4 md:mb-0">
          <span className="font-['Inter'] text-[11px] font-medium tracking-[0.05em] uppercase text-slate-500 dark:text-slate-400">
            © 2024 Fodci Systems. Engineered for precision.
          </span>
        </div>
        <div className="flex gap-8">
          <a className="font-['Inter'] text-[11px] font-medium tracking-[0.05em] uppercase text-slate-500 dark:text-slate-400 hover:text-emerald-900 dark:hover:text-white transition-colors" href="#">
            Privacy
          </a>
          <a className="font-['Inter'] text-[11px] font-medium tracking-[0.05em] uppercase text-slate-500 dark:text-slate-400 hover:text-emerald-900 dark:hover:text-white transition-colors" href="#">
            Security
          </a>
          <a className="font-['Inter'] text-[11px] font-medium tracking-[0.05em] uppercase text-slate-500 dark:text-slate-400 hover:text-emerald-900 dark:hover:text-white transition-colors" href="#">
            Terms
          </a>
          <a className="font-['Inter'] text-[11px] font-medium tracking-[0.05em] uppercase text-slate-500 dark:text-slate-400 hover:text-emerald-900 dark:hover:text-white transition-colors" href="#">
            Status
          </a>
        </div>
      </footer>
    </div>
  )
}
