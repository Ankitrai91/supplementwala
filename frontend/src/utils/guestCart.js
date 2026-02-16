const CART_KEY = "guest_cart"

export const getGuestCart = () => {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]")
}

export const saveGuestCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export const addGuestItem = (item) => {
  const cart = getGuestCart()

  const existing = cart.find(
    i =>
      i.productId === item.productId &&
      (i.variantId || "") === (item.variantId || "")
  )

  if (existing) {
    existing.quantity += item.quantity
  } else {
    cart.push(item)
  }

  saveGuestCart(cart)
}

export const clearGuestCart = () => {
  localStorage.removeItem(CART_KEY)
}
