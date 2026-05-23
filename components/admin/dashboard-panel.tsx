'use client'

import { useEffect, useState, useCallback } from 'react'
import { ShoppingBag, Clock, ChefHat, Package, Truck, RefreshCw, TrendingUp } from 'lucide-react'
import type { OrderStatus } from '@/lib/types'

interface OrderRow {
  id: string
  number: number
  status: OrderStatus
  total: number
  createdAt: string
  customer: { name: string }
}

const statusConfig: Record<OrderStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  novo:      { label: 'Novos',      icon: ShoppingBag, color: 'text-primary',    bg: 'bg-primary/10' },
  preparando:{ label: 'Preparando', icon: ChefHat,     color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  pronto:    { label: 'Prontos',    icon: Package,     color: 'text-green-400',  bg: 'bg-green-400/10' },
  entregue:  { label: 'Entregues',  icon: Truck,       color: 'text-muted-foreground', bg: 'bg-muted/50' },
}

function avgDeliveryMinutes(orders: OrderRow[]): number | null {
  const delivered = orders.filter(o => o.status === 'entregue')
  if (delivered.length === 0) return null
  const avg = delivered.reduce((s, o) => {
    const mins = (Date.now() - new Date(o.createdAt).getTime()) / 60000
    return s + Math.min(mins, 120)
  }, 0) / delivered.length
  return Math.round(avg)
}

export function DashboardPanel() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders')
      const json = await res.json()
      setOrders(json.orders || [])
      setLastRefresh(new Date())
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const todayStr = new Date().toISOString().slice(0, 10)
  const todayOrders = orders.filter(o => o.createdAt?.slice(0, 10) === todayStr)

  const counts: Record<OrderStatus, number> = {
    novo:       orders.filter(o => o.status === 'novo').length,
    preparando: orders.filter(o => o.status === 'preparando').length,
    pronto:     orders.filter(o => o.status === 'pronto').length,
    entregue:   orders.filter(o => o.status === 'entregue').length,
  }

  const inProgress = orders.filter(o => o.status !== 'entregue')
  const todayRevenue = todayOrders.reduce((s, o) => s + (o.total || 0), 0)
  const avgMins = avgDeliveryMinutes(todayOrders)

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const fmtTime = (d: Date) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">DASHBOARD</h1>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {fmtTime(lastRefresh)}
        </button>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(statusConfig) as OrderStatus[]).map(s => {
          const { label, icon: Icon, color, bg } = statusConfig[s]
          return (
            <div key={s} className={`rounded-xl border border-border p-4 ${bg}`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className={`text-2xl font-black ${color}`}>{counts[s]}</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">{label}</p>
            </div>
          )
        })}
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Faturamento hoje</p>
            <p className="text-lg font-bold text-primary">{fmt(todayRevenue)}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-yellow-400/10 rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pedidos hoje</p>
            <p className="text-lg font-bold text-foreground">{todayOrders.length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-400/10 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tempo médio entrega</p>
            <p className="text-lg font-bold text-foreground">
              {avgMins !== null ? `~${avgMins} min` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Active orders */}
      {inProgress.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="font-bold text-foreground text-sm">
              Pedidos em andamento ({inProgress.length})
            </h3>
          </div>
          <div className="divide-y divide-border">
            {inProgress.slice(0, 8).map(o => {
              const cfg = statusConfig[o.status]
              const Icon = cfg.icon
              return (
                <div key={o.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground text-sm">
                      #{String(o.number).padStart(3, '0')}
                    </span>
                    <span className="text-muted-foreground text-sm truncate max-w-[120px]">
                      {o.customer?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-bold text-sm">{fmt(o.total)}</span>
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                      <Icon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </div>
                </div>
              )
            })}
            {inProgress.length > 8 && (
              <p className="px-5 py-3 text-xs text-muted-foreground text-center">
                +{inProgress.length - 8} pedidos
              </p>
            )}
          </div>
        </div>
      )}

      {!loading && inProgress.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Nenhum pedido em andamento</p>
        </div>
      )}
    </div>
  )
}
