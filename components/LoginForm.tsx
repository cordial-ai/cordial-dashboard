'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EyeIcon } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">
        CoRDial CMS
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label 
            htmlFor="username" 
            className="block text-sm font-medium text-slate-700"
          >
            Username
          </label>
          <Input
            id="username"
            type="text"
            placeholder="Ex: johnsmith"
            className="w-full pl-3"
          />
        </div>
        <div className="space-y-2">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              className="w-full pl-3 pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              <EyeIcon className="h-5 w-5" />
              <span className="sr-only">Toggle password visibility</span>
            </button>
          </div>
        </div>
        <Button 
          type="submit" 
          className="w-full bg-slate-800 hover:bg-slate-700 text-white"
        >
          Log in
        </Button>
      </form>
    </div>
  )
}
