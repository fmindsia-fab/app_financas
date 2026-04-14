import type { Transaction, Notification } from '@/lib/types'

export function generateNotifications(transactions: Transaction[]): Notification[] {
  const notifications: Notification[] = []
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const currentMonthTx = transactions.filter((t) => {
    const d = new Date(t.date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const totalIncome = currentMonthTx
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)

  const totalExpense = currentMonthTx
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)

  const balance = totalIncome - totalExpense

  if (balance < 0) {
    notifications.push({
      id: 'negative-balance',
      message: `Saldo negativo em ${now.toLocaleString('pt-BR', { month: 'long' })}: R$ ${Math.abs(balance).toFixed(2)}`,
      type: 'danger',
      read: false,
    })
  }

  const bigExpenses = currentMonthTx.filter(
    (t) => t.type === 'expense' && t.amount > 1000
  )
  bigExpenses.forEach((t) => {
    notifications.push({
      id: `big-expense-${t.id}`,
      message: `Despesa alta: ${t.description} — R$ ${t.amount.toFixed(2)}`,
      type: 'warning',
      read: false,
    })
  })

  if (totalIncome === 0 && currentMonthTx.length > 0) {
    notifications.push({
      id: 'no-income',
      message: 'Nenhuma receita registrada neste mês.',
      type: 'info',
      read: false,
    })
  }

  return notifications
}
