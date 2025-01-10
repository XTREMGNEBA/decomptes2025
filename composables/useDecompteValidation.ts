import { ref } from 'vue'
import type { Decompte } from '~/types'

export function useDecompteValidation() {
  const errors = ref<Record<string, string>>({})
  
  const validateDecompte = (decompte: Partial<Decompte>) => {
    errors.value = {}
    
    // Validation du titre
    if (!decompte.title) {
      errors.value.title = 'Le titre est requis'
    } else if (decompte.title.length < 5) {
      errors.value.title = 'Le titre doit contenir au moins 5 caractères'
    } else if (decompte.title.length > 100) {
      errors.value.title = 'Le titre ne peut pas dépasser 100 caractères'
    }
    
    // Validation du montant
    if (!decompte.amount && decompte.amount !== 0) {
      errors.value.amount = 'Le montant est requis'
    } else if (decompte.amount < 0) {
      errors.value.amount = 'Le montant ne peut pas être négatif'
    }
    
    // Validation de l'organisme
    if (!decompte.organism) {
      errors.value.organism = 'L\'organisme est requis'
    }
    
    return Object.keys(errors.value).length === 0
  }
  
  return {
    errors,
    validateDecompte
  }
}