import './globals.css'

export const metadata = {
  title: 'StudySpace — Library Management',
  description: 'Fair study spaces for everyone. Reserve library desks in real time.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
