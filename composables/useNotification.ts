export function useNotification() {
  const toast = useToast()

  return {
    success: (message: string) => {
      toast.add({
        title: 'Succès',
        description: message,
        color: 'green'
      })
    },
    error: (message: string) => {
      toast.add({
        title: 'Erreur',
        description: message,
        color: 'red'
      })
    }
  }
}