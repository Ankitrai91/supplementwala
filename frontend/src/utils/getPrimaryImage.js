export const getPrimaryImage = (images = []) => {
  if (!images.length) return null

  return (
    images.find(img => img.isPrimary)?.url ||
    images.sort((a, b) => a.order - b.order)[0]?.url
  )
}