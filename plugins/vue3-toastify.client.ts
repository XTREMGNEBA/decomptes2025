import Toast, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  const options: ToastContainerOptions = {
    autoClose: 3000,
    position: 'top-right',
  }

  nuxtApp.vueApp.use(Toast, options)
})
