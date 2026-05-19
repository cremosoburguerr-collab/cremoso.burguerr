'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Benefits } from '@/components/benefits'
import { Menu } from '@/components/menu'
import { About } from '@/components/about'
import { Footer } from '@/components/footer'
import { Cart } from '@/components/cart'
import { Checkout } from '@/components/checkout'
import { OrderTracking } from '@/components/order-tracking'
import { StatusBanner } from '@/components/status-banner'
import { useStore } from '@/lib/store'
import type { Order } from '@/lib/types'

type View = 'home' | 'checkout' | 'tracking'

export default function Home() {
  const [view, setView] = useState<View>('home')
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null)
  const { setCartOpen, loadSettings } = useStore()

  useEffect(() => {
    loadSettings()
  }, [])

  const handleCheckout = () => {
    setCartOpen(false)
    setView('checkout')
  }

  const handleOrderComplete = (order: Order) => {
    setCompletedOrder(order)
    setView('tracking')
  }

  const handleBackToHome = () => {
    setView('home')
    setCompletedOrder(null)
  }

  return (
    <main className="min-h-screen bg-background">
      {view === 'home' && (
        <>
          <Header />
          <div className="pt-16">
            <StatusBanner />
          </div>
          <Hero />
          <Benefits />
          <Menu />
          <About />
          <Footer />
          <Cart onCheckout={handleCheckout} />
        </>
      )}

      {view === 'checkout' && (
        <Checkout
          onBack={handleBackToHome}
          onComplete={handleOrderComplete}
        />
      )}

      {view === 'tracking' && completedOrder && (
        <OrderTracking
          order={completedOrder}
          onBack={handleBackToHome}
        />
      )}
    </main>
  )
}
