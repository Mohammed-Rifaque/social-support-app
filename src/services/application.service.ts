export async function submitApplication() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 1500)
  })

  return { success: true }
}
