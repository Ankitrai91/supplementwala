import axios from 'axios'

const API_URL = process.env.API_URL || 'http://localhost:5000/api'

// Test configuration
const tests = []
let passCount = 0
let failCount = 0

// Test helper
async function test(name, fn) {
  try {
    await fn()
    console.log(`✓ ${name}`)
    passCount++
  } catch (error) {
    console.error(`✗ ${name}`)
    console.error(`  Error: ${error.message}`)
    failCount++
  }
}

// Sample data for testing
let authToken = ''
let userId = ''
let productId = ''
let cartId = ''

// Run tests
async function runTests() {
  console.log('Starting API Tests...\n')

  // Health Check
  await test('Health Check', async () => {
    const res = await axios.get(`${API_URL}/health`)
    if (res.data.status !== 'Server is running') {
      throw new Error('Server health check failed')
    }
  })

  // Authentication Tests
  await test('User Registration', async () => {
    const res = await axios.post(`${API_URL}/auth/register`, {
      email: `testuser${Date.now()}@example.com`,
      password: 'testpass123',
    })
    if (!res.data.token) {
      throw new Error('No token returned')
    }
    authToken = res.data.token
    userId = res.data.user._id
  })

  await test('User Login', async () => {
    const res = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@nutristar.com',
      password: 'admin123',
    })
    if (!res.data.token) {
      throw new Error('Login failed')
    }
  })

  // Product Tests
  await test('Get All Products', async () => {
    const res = await axios.get(`${API_URL}/products`)
    if (!Array.isArray(res.data.data)) {
      throw new Error('Products not returned as array')
    }
    if (res.data.data.length > 0) {
      productId = res.data.data[0]._id
    }
  })

  await test('Get Product by ID', async () => {
    if (!productId) {
      throw new Error('No product ID available')
    }
    const res = await axios.get(`${API_URL}/products/${productId}`)
    if (!res.data.data.name) {
      throw new Error('Product data incomplete')
    }
  })

  await test('Search Products', async () => {
    const res = await axios.get(`${API_URL}/products/search?query=Protein`)
    if (!Array.isArray(res.data.data)) {
      throw new Error('Search results not returned as array')
    }
  })

  // Category Tests
  await test('Get All Categories', async () => {
    const res = await axios.get(`${API_URL}/categories`)
    if (!Array.isArray(res.data.data)) {
      throw new Error('Categories not returned as array')
    }
  })

  // Brand Tests
  await test('Get All Brands', async () => {
    const res = await axios.get(`${API_URL}/brands`)
    if (!Array.isArray(res.data.data)) {
      throw new Error('Brands not returned as array')
    }
  })

  // Menu Tests
  await test('Get Menu Structure', async () => {
    const res = await axios.get(`${API_URL}/menu/structure`)
    if (!res.data.data || typeof res.data.data !== 'object') {
      throw new Error('Menu structure not returned as object')
    }
  })

  await test('Get Mega Menu', async () => {
    const res = await axios.get(`${API_URL}/menu/mega-menu`)
    if (!Array.isArray(res.data.data)) {
      throw new Error('Mega menu not returned as array')
    }
  })

  await test('Get Featured Items', async () => {
    const res = await axios.get(`${API_URL}/menu/featured`)
    if (!Array.isArray(res.data.data)) {
      throw new Error('Featured items not returned as array')
    }
  })

  // Cart Tests (requires auth)
  await test('Add to Cart', async () => {
    if (!productId) {
      throw new Error('No product ID available')
    }
    const res = await axios.post(
      `${API_URL}/cart/add`,
      {
        productId,
        variantId: '507f1f77bcf86cd799439011',
        quantity: 1,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    )
    cartId = res.data.data._id
  })

  await test('Get Cart', async () => {
    const res = await axios.get(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    if (!res.data.data) {
      throw new Error('Cart data not returned')
    }
  })

  // User Profile Tests
  await test('Get User Profile', async () => {
    const res = await axios.get(`${API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    if (!res.data.data.email) {
      throw new Error('User profile incomplete')
    }
  })

  await test('Get User Orders', async () => {
    const res = await axios.get(`${API_URL}/user/orders`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    if (!Array.isArray(res.data.data)) {
      throw new Error('Orders not returned as array')
    }
  })

  // Summary
  console.log('\n========== Test Summary ==========')
  console.log(`Total Tests: ${passCount + failCount}`)
  console.log(`Passed: ${passCount}`)
  console.log(`Failed: ${failCount}`)
  console.log('==================================\n')

  process.exit(failCount > 0 ? 1 : 0)
}

// Run the tests
runTests().catch(console.error)
