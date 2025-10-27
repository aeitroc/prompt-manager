import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prompt Manager',
  description: 'AI Prompt Manager with VSCode Dark Theme',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#252526',
              color: '#CCCCCC',
              border: '1px solid #454545',
            },
            success: {
              iconTheme: {
                primary: '#89D185',
                secondary: '#252526',
              },
            },
            error: {
              iconTheme: {
                primary: '#F48771',
                secondary: '#252526',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
