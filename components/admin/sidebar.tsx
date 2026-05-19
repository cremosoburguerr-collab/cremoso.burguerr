'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  Users,
  ChefHat,
  LogOut 
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

const menuItems = [
  { href: '/equipe/admin', label: 'Painel da Cozinha', icon: ChefHat },
  { href: '/equipe/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { href: '/equipe/admin/cardapio', label: 'Cardápio', icon: UtensilsCrossed },
  { href: '/equipe/admin/relatorios', label: 'Relatórios', icon: BarChart3 },
  { href: '/equipe/admin/configuracoes', label: 'Configurações', icon: Settings },
  { href: '/equipe/admin/usuarios', label: 'Usuários', icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/equipe')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Cremoso Burguer"
            width={50}
            height={50}
          />
          <div>
            <span className="block text-lg font-bold fire-text">Cremoso</span>
            <span className="block text-xs text-foreground/80">BURGUER</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  )
}
