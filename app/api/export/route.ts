import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Transaction } from '@/lib/types'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const mes = parseInt(searchParams.get('mes') ?? '0')
  const ano = parseInt(searchParams.get('ano') ?? '0')
  const categoria = searchParams.get('categoria')

  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (mes && ano) {
    const start = `${ano}-${String(mes).padStart(2, '0')}-01`
    const end = new Date(ano, mes, 0).toISOString().split('T')[0]
    query = query.gte('date', start).lte('date', end)
  }

  if (categoria && categoria !== 'all') {
    query = query.eq('category', categoria)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  const transactions: Transaction[] = data ?? []

  const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']
  const rows = transactions.map(t => [
    t.date,
    `"${t.description.replace(/"/g, '""')}"`,
    t.category,
    t.type === 'income' ? 'Receita' : 'Despesa',
    t.amount.toFixed(2).replace('.', ','),
  ])

  const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n')
  const fileName = mes && ano ? `transacoes-${String(mes).padStart(2, '0')}-${ano}.csv` : 'transacoes.csv'

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
  })
}
