import React from 'react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyContent from '../components/PropertyContent'
import SearchForm from '../components/SearchForm'
import PromotionalBanner from '../components/PromotionalBanner'

const HomePage = () => {
  return (
    <div className='overflow-hidden'>
      <div className='relative z-10 border shadow-md'>
        <Navbar />
      </div>
      <SearchForm />
      <PromotionalBanner />
      <PropertyContent />
      <Footer />
    </div>
  )
}
export default HomePage