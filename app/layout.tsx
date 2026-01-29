import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VISION AI Scanner',
  description: 'Elite AI Assistant',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'VISION',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="bg-black">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/876/876569.png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
