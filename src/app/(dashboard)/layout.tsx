import Sidebar from '@/components/ui/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--background-secondary)' }}>
      <Sidebar />
      <main className="main-content min-h-screen">
        {children}
      </main>
    </div>
  )
}
