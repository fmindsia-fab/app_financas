export type TransactionType = 'income' | 'expense'

export const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Salário',
  'Freelance',
  'Outros',
] as const

export type Category = (typeof CATEGORIES)[number]

export interface Transaction {
  id: string
  user_id: string
  description: string
  amount: number
  date: string
  type: TransactionType
  category: Category
  created_at: string
}

export interface MonthlySummary {
  total_income: number
  total_expense: number
  balance: number
}

export interface CategorySummary {
  category: string
  total: number
  percentage: number
}

export interface MonthlyChartData {
  month: string
  income: number
  expense: number
}

export interface Notification {
  id: string
  message: string
  type: 'warning' | 'info' | 'danger'
  read: boolean
}
