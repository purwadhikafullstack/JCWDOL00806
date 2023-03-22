import React from 'react'

import { promo } from '../assets'

const PromotionalBanner = () => {
  return (
    <div className='lg:px-16 md:px-10 px-5'>
      <div 
        className='py-6 flex justify-center
        items-center'
      >
        <img 
          src={promo}
          alt="promotion"
          className='max-h-[300px] 
          object-contain rounded-lg'
        />
      </div>
    </div>
  )
}

export default PromotionalBanner