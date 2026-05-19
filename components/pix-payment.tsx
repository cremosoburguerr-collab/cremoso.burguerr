'use client'

import { useState, useEffect } from 'react'
import { Copy, CheckCircle2, QrCode, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PixPaymentProps {
  total: number
  orderNumber: number
  onPaymentConfirmed?: () => void
}

export function PixPayment({ total, orderNumber, onPaymentConfirmed }: PixPaymentProps) {
  const [copied, setCopied] = useState(false)
  const [checking, setChecking] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  // Generate a mock PIX code (in production, this would come from your payment gateway)
  const pixCode = `00020126580014br.gov.bcb.pix0136cremoso-burguer-${orderNumber}5204000053039865802BR5925CREMOSO BURGUER LTDA6009SAO PAULO62070503***6304${String(Math.floor(total * 100)).padStart(4, '0')}`

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Simulate checking payment status
  const checkPayment = () => {
    setChecking(true)
    // In production, this would call your payment gateway API
    setTimeout(() => {
      setChecking(false)
      setConfirmed(true)
      onPaymentConfirmed?.()
    }, 2000)
  }

  if (confirmed) {
    return (
      <div className="text-center p-8">
        <div className="w-20 h-20 rounded-full bg-green-600/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Pagamento Confirmado!</h3>
        <p className="text-muted-foreground">Seu pedido está sendo preparado.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">Pagamento via PIX</h3>
        <p className="text-3xl font-bold text-primary">{formatPrice(total)}</p>
      </div>

      {/* QR Code Placeholder */}
      <div className="flex justify-center">
        <div className="w-48 h-48 bg-foreground rounded-lg p-4 relative">
          {/* This would be a real QR code in production */}
          <div className="w-full h-full bg-background rounded flex items-center justify-center">
            <QrCode className="w-24 h-24 text-foreground" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-foreground p-2 rounded">
              <QrCode className="w-8 h-8 text-background" />
            </div>
          </div>
        </div>
      </div>

      {/* PIX Code */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground text-center">Ou copie o código PIX:</p>
        <div className="flex gap-2">
          <div className="flex-1 p-3 bg-muted rounded-lg text-xs text-foreground font-mono overflow-hidden text-ellipsis whitespace-nowrap">
            {pixCode}
          </div>
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="shrink-0"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Check Payment Button */}
      <Button
        onClick={checkPayment}
        disabled={checking}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {checking ? (
          <>
            <Clock className="w-4 h-4 mr-2 animate-spin" />
            Verificando pagamento...
          </>
        ) : (
          'Já paguei'
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        O pagamento será confirmado automaticamente em até 30 segundos após o PIX ser realizado.
      </p>

      {/* Instructions */}
      <div className="border-t border-border pt-4">
        <p className="text-sm font-medium text-foreground mb-2">Como pagar:</p>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Abra o app do seu banco</li>
          <li>Escolha pagar com PIX</li>
          <li>Escaneie o QR Code ou cole o código</li>
          <li>Confirme o pagamento</li>
        </ol>
      </div>
    </div>
  )
}
