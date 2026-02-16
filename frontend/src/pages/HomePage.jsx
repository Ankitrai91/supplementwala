"use client"

import { useEffect, useState, useRef } from "react"
import "./HomePage.css"
import BrandCarousel from "../components/BrandCarousel"
import SeasonBestsellers from "../components/SeasonBestsellers"
import PromoBanner from "../components/PromoBanner"
import ShopByCategory from "../components/ShopByCategory"
import CarouselSlide from "../components/CarouselSlide"



export default function HomePage() {



  return (<>

  <CarouselSlide />
    
                {/* TRUST STRIP */}
<section className="trust-strip">
  <div className="trust-strip-container">
    <div className="trust-item">
      <h3>Fuss Free Returns*</h3>
      <p>3 days money-back guarantee</p>
    </div>

    <div className="trust-item">
      <h3>Fast Delivery</h3>
      <p>Weight based fast shipping all over India</p>
    </div>

    <div className="trust-item">
      <h3>Secure Payment</h3>
      <p>We offer a variety of secure payment methods</p>
    </div>
  </div>
</section>

 <BrandCarousel />

 <div className=" spacer season-section" >
  <img load="lazy" style={{"width":'-webkit-fill-available'}} src="https://nutristar.in/cdn/shop/files/PRIDE_IN_EVERY_PURCHASE_4_a7c82ac7-3e4c-4992-9123-8c61a92f520c.png?v=1768542917" alt="" />
 </div>
 <SeasonBestsellers/>
 <PromoBanner />

<ShopByCategory/>


            </>
  )
}
