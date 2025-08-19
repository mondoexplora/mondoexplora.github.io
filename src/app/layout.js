import './globals.css'

export const metadata = {
  title: {
    default: 'MondoExplora',
    template: '%s | MondoExplora'
  },
  description: 'Discover amazing destinations and find the best hotel deals',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
