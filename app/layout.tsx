import './globals.css'
import { Roboto } from 'next/font/google'

const roboto = Roboto({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Cordial CMS',
  description: 'Dashboard for Cordial Project',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-slate-100">
      <body className={`${roboto.className} h-full`}>
        {children}
      </body>
    </html>
  )
}

