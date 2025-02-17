import Image from 'next/image'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-slate-100">
      {/* Left side with background and logo */}
      <div className="relative flex-1 bg-slate-800 hidden lg:block">
        <div className="absolute top-6 left-6 z-10">
          <Image
            src="/placeholder.svg?height=40&width=120"
            alt="IFS Logo"
            width={120}
            height={40}
            className="w-auto h-10"
          />
        </div>
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Background"
          fill
          className="object-cover opacity-50"
          priority
        />
      </div>

      {/* Right side with login form */}
      <div className="w-full max-w-md lg:max-w-2xl xl:max-w-3xl bg-white p-8 flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  )
}

