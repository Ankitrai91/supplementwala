import './StaticPages.css'

function AboutPage() {
  return (
    <div className="static-page">
      <div className="page-hero">
        <h1>About NutriStar</h1>
        <p>Your trusted partner in fitness and nutrition</p>
      </div>

      <div className="container">
        <section className="content-section">
          <h2>Our Story</h2>
          <p>
            NutriStar was founded with a mission to make premium nutrition and supplements accessible to everyone.
            We believe that everyone deserves access to high-quality products that support their fitness goals
            and overall wellness.
          </p>
          <p>
            Since our launch, we've grown to become one of the leading online nutrition retailers, serving
            thousands of customers across the country with authentic, high-quality products from trusted brands.
          </p>
        </section>

        <section className="content-section">
          <h2>Our Mission</h2>
          <p>
            To empower individuals to achieve their fitness and health goals by providing access to premium
            nutrition products, expert guidance, and a supportive community.
          </p>
        </section>

        <section className="content-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Quality</h3>
              <p>We only stock authentic products from trusted brands</p>
            </div>
            <div className="value-card">
              <h3>Affordability</h3>
              <p>Competitive prices with our exclusive Supercash rewards</p>
            </div>
            <div className="value-card">
              <h3>Customer Service</h3>
              <p>Dedicated support to help you find what you need</p>
            </div>
            <div className="value-card">
              <h3>Trust</h3>
              <p>Transparent pricing and genuine customer reviews</p>
            </div>
          </div>
        </section>

        <section className="content-section">
          <h2>Why Choose NutriStar?</h2>
          <ul className="benefits-list">
            <li>Authentic products from verified brands</li>
            <li>Competitive pricing with no hidden charges</li>
            <li>Fast and reliable shipping</li>
            <li>Supercash rewards on every purchase</li>
            <li>Expert product recommendations</li>
            <li>24/7 customer support</li>
            <li>Easy returns and exchanges</li>
            <li>Secure payment options</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default AboutPage
