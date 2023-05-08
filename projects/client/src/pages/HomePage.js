import React from 'react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyContent from '../components/PropertyContent'
import SearchForm from '../components/SearchForm'
import PromotionalBanner from '../components/PromotionalBanner'

const HomePage = () => {
  
  return (
    <div className='flex flex-col min-h-screen overflow-hidden'>
      <div className='relative z-10 border shadow-md'>
        <Navbar />
      </div>

      <div className='flex-1'>
        <SearchForm />
        <PromotionalBanner />
        <PropertyContent />
      </div>

      <div className='flex-shrink'>
        <Footer />
      </div>
    </div>
  )
}
export default HomePage