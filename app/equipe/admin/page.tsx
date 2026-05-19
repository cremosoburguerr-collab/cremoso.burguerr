'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { AdminSidebar } from '@/components/admin/sidebar'
import { KitchenPanel } from '@/components/admin/kitchen-panel'

export default function AdminPage() {
  const router = useRouter()
  const { user } = useStore()

  useEffect(() => {
    if (!user) {
      router.push('/equipe')
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64">
        <KitchenPanel />
      </main>
    </div>
  )
}
