import './globals.css'
export const metadata = {
  title: 'Nassar AI Dashboard',
  description: 'Live Vapi Agent Stats for Businesses',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <div className="max-w-7xl mx-auto p-4">{children}</div>
      </body>
    </html>
  )
}
