import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { total, orderNumber } = await req.json()

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json(
        { error: 'MERCADOPAGO_ACCESS_TOKEN não configurado' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `cremoso-burguer-${orderNumber}-${Date.now()}`,
      },
      body: JSON.stringify({
        transaction_amount: Number(Number(total).toFixed(2)),
        description: `Pedido #${String(orderNumber).padStart(3, '0')} - Cremoso Burguer`,
        payment_method_id: 'pix',
        payer: {
          email: 'cliente@cremoso.com.br',
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Mercado Pago error:', data)
      return NextResponse.json(
        { error: data.message || 'Erro ao criar cobrança PIX' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      id: data.id,
      qr_code: data.point_of_interaction?.transaction_data?.qr_code ?? null,
      qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64 ?? null,
      status: data.status,
    })
  } catch (error) {
    console.error('PIX create error:', error)
    return NextResponse.json({ error: 'Erro interno ao criar PIX' }, { status: 500 })
  }
}
