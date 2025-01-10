export function formatStatus(status: string) {
  const labels = {
    draft: 'Brouillon',
    pending: 'En attente',
    validated: 'Validé',
    signed: 'Signé',
    closed: 'Clôturé'
  }
  return labels[status as keyof typeof labels] || status
}

export function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency
  }).format(amount)
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}