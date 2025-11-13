export default defineNuxtPlugin(async () => {
  // Utiliser le composable useAuth pour initialiser l'authentification
  if (process.client) {
    const { initAuth } = useAuth()
    await initAuth()
  }
})