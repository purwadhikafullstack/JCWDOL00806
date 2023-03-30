import React from 'react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CheckoutContent from '../components/CheckoutContent'

const Checkout = () => {
    return (
        <div className='flex flex-col min-h-screen overflow-hidden'>
            <div className='relative z-10 border shadow-md'>
                <Navbar />
            </div>

            <div className='flex-1'>
                <CheckoutContent />
            </div>

            <div className='flex-shrink'>
                <Footer />
            </div>
        </div>
    )
}

export default Checkout