export const getImageUrl = (input) => {
  if (!input) return "/placeholder.png"

  // if image object
  if (typeof input === "object" && input.url) {
    input = input.url
  }

  // if array passed
  if (Array.isArray(input)) {
    input = input[0]?.url || input[0]
  }

  if (typeof input !== "string") return "/placeholder.png"

  if (input.includes("res.cloudinary.com")) {
    return input.replace(
      "/upload/",
      "/upload/q_auto:best,f_auto,dpr_auto/"
    )
  }

  return input
}
