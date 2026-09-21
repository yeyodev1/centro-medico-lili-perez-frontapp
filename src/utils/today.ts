/** Hoy en hora local como "YYYY-MM-DD" (toISOString a secas daría el día en UTC). */
export function todayInput(): string {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}
