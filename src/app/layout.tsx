import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Girl Scout Cookie Orders',
  description: 'Sales order app for Girl Scouts to manage cookie orders and payments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-gs-green text-white p-4">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold">Girl Scout Cookie Orders</h1>
            </div>
          </header>
          <main className="container mx-auto py-8 px-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
